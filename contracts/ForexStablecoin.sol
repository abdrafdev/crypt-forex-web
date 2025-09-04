// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title ForexStablecoin
 * @dev Implementation of forex-backed stablecoins (USDfx, EURfx, JPYfx, etc.)
 */
contract ForexStablecoin is ERC20, ERC20Burnable, Ownable, Pausable, ReentrancyGuard {
    string public baseCurrency;
    uint256 public collateralRatio = 100; // 100% collateralized
    uint256 public totalCollateral;
    uint256 public mintFee = 10; // 0.1% = 10 basis points
    uint256 public burnFee = 10; // 0.1% = 10 basis points
    
    mapping(address => uint256) public userCollateral;
    mapping(address => bool) public authorizedMinters;
    
    event Minted(address indexed user, uint256 amount, uint256 collateral);
    event Burned(address indexed user, uint256 amount, uint256 collateralReturned);
    event CollateralDeposited(address indexed user, uint256 amount);
    event CollateralWithdrawn(address indexed user, uint256 amount);
    event MinterAuthorized(address indexed minter);
    event MinterRevoked(address indexed minter);
    
    modifier onlyAuthorizedMinter() {
        require(authorizedMinters[msg.sender] || msg.sender == owner(), "Not authorized to mint");
        _;
    }
    
    constructor(
        string memory _name,
        string memory _symbol,
        string memory _baseCurrency
    ) ERC20(_name, _symbol) {
        baseCurrency = _baseCurrency;
        authorizedMinters[msg.sender] = true;
    }
    
    /**
     * @dev Mint new stablecoins with collateral
     */
    function mint(uint256 amount) external payable nonReentrant whenNotPaused {
        require(amount > 0, "Amount must be greater than 0");
        require(msg.value >= calculateCollateralRequired(amount), "Insufficient collateral");
        
        uint256 fee = (amount * mintFee) / 10000;
        uint256 amountAfterFee = amount - fee;
        
        userCollateral[msg.sender] += msg.value;
        totalCollateral += msg.value;
        
        _mint(msg.sender, amountAfterFee);
        if (fee > 0) {
            _mint(owner(), fee); // Mint fee to owner
        }
        
        emit Minted(msg.sender, amountAfterFee, msg.value);
    }
    
    /**
     * @dev Burn stablecoins and return collateral
     */
    function burn(uint256 amount) public override nonReentrant whenNotPaused {
        require(amount > 0, "Amount must be greater than 0");
        require(balanceOf(msg.sender) >= amount, "Insufficient balance");
        
        uint256 fee = (amount * burnFee) / 10000;
        uint256 amountAfterFee = amount - fee;
        
        uint256 collateralToReturn = calculateCollateralToReturn(amountAfterFee);
        require(userCollateral[msg.sender] >= collateralToReturn, "Insufficient collateral");
        
        _burn(msg.sender, amount);
        
        userCollateral[msg.sender] -= collateralToReturn;
        totalCollateral -= collateralToReturn;
        
        (bool success, ) = msg.sender.call{value: collateralToReturn}("");
        require(success, "Collateral transfer failed");
        
        emit Burned(msg.sender, amount, collateralToReturn);
    }
    
    /**
     * @dev Authorize an address to mint tokens
     */
    function authorizeMinter(address minter) external onlyOwner {
        authorizedMinters[minter] = true;
        emit MinterAuthorized(minter);
    }
    
    /**
     * @dev Revoke minting authorization
     */
    function revokeMinter(address minter) external onlyOwner {
        authorizedMinters[minter] = false;
        emit MinterRevoked(minter);
    }
    
    /**
     * @dev Calculate collateral required for minting
     */
    function calculateCollateralRequired(uint256 amount) public view returns (uint256) {
        return (amount * collateralRatio) / 100;
    }
    
    /**
     * @dev Calculate collateral to return for burning
     */
    function calculateCollateralToReturn(uint256 amount) public view returns (uint256) {
        if (totalSupply() == 0) return 0;
        return (amount * totalCollateral) / totalSupply();
    }
    
    /**
     * @dev Update collateral ratio (only owner)
     */
    function updateCollateralRatio(uint256 newRatio) external onlyOwner {
        require(newRatio >= 50 && newRatio <= 200, "Invalid ratio");
        collateralRatio = newRatio;
    }
    
    /**
     * @dev Update fees (only owner)
     */
    function updateFees(uint256 _mintFee, uint256 _burnFee) external onlyOwner {
        require(_mintFee <= 100 && _burnFee <= 100, "Fees too high"); // Max 1%
        mintFee = _mintFee;
        burnFee = _burnFee;
    }
    
    /**
     * @dev Pause contract (emergency)
     */
    function pause() external onlyOwner {
        _pause();
    }
    
    /**
     * @dev Unpause contract
     */
    function unpause() external onlyOwner {
        _unpause();
    }
    
    /**
     * @dev Get user's collateral balance
     */
    function getUserCollateral(address user) external view returns (uint256) {
        return userCollateral[user];
    }
    
    /**
     * @dev Emergency withdrawal (only owner, when paused)
     */
    function emergencyWithdraw() external onlyOwner whenPaused {
        (bool success, ) = owner().call{value: address(this).balance}("");
        require(success, "Withdrawal failed");
    }
    
    receive() external payable {}
}
