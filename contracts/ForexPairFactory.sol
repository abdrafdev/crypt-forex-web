// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/**
 * @title ForexPairFactory
 * @dev Factory contract for creating and managing forex trading pairs
 */
contract ForexPairFactory is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;
    
    struct ForexPair {
        address token0;
        address token1;
        uint256 reserve0;
        uint256 reserve1;
        uint256 totalSupply;
        uint256 fee; // Fee in basis points (e.g., 30 = 0.3%)
        bool active;
    }
    
    struct Position {
        uint256 liquidity;
        uint256 token0Amount;
        uint256 token1Amount;
        uint256 timestamp;
    }
    
    mapping(string => ForexPair) public pairs;
    mapping(string => mapping(address => Position)) public positions;
    mapping(address => string[]) public userPairs;
    
    uint256 public defaultFee = 30; // 0.3%
    uint256 public constant FEE_DENOMINATOR = 10000;
    uint256 public constant MINIMUM_LIQUIDITY = 1000;
    
    event PairCreated(string indexed pairId, address token0, address token1);
    event LiquidityAdded(string indexed pairId, address indexed provider, uint256 amount0, uint256 amount1, uint256 liquidity);
    event LiquidityRemoved(string indexed pairId, address indexed provider, uint256 amount0, uint256 amount1, uint256 liquidity);
    event Swap(string indexed pairId, address indexed trader, address tokenIn, uint256 amountIn, uint256 amountOut);
    
    /**
     * @dev Create a new forex trading pair
     */
    function createPair(
        string memory pairId,
        address token0,
        address token1
    ) external onlyOwner {
        require(token0 != address(0) && token1 != address(0), "Invalid tokens");
        require(token0 != token1, "Identical tokens");
        require(!pairs[pairId].active, "Pair already exists");
        
        pairs[pairId] = ForexPair({
            token0: token0,
            token1: token1,
            reserve0: 0,
            reserve1: 0,
            totalSupply: 0,
            fee: defaultFee,
            active: true
        });
        
        emit PairCreated(pairId, token0, token1);
    }
    
    /**
     * @dev Add liquidity to a forex pair
     */
    function addLiquidity(
        string memory pairId,
        uint256 amount0Desired,
        uint256 amount1Desired,
        uint256 amount0Min,
        uint256 amount1Min
    ) external nonReentrant returns (uint256 amount0, uint256 amount1, uint256 liquidity) {
        ForexPair storage pair = pairs[pairId];
        require(pair.active, "Pair does not exist");
        
        if (pair.totalSupply == 0) {
            // First liquidity provider
            amount0 = amount0Desired;
            amount1 = amount1Desired;
            liquidity = sqrt(amount0 * amount1) - MINIMUM_LIQUIDITY;
            pair.totalSupply = liquidity + MINIMUM_LIQUIDITY;
        } else {
            // Subsequent liquidity providers
            uint256 amount1Optimal = (amount0Desired * pair.reserve1) / pair.reserve0;
            if (amount1Optimal <= amount1Desired) {
                require(amount1Optimal >= amount1Min, "Insufficient amount1");
                amount0 = amount0Desired;
                amount1 = amount1Optimal;
            } else {
                uint256 amount0Optimal = (amount1Desired * pair.reserve0) / pair.reserve1;
                require(amount0Optimal >= amount0Min, "Insufficient amount0");
                amount0 = amount0Optimal;
                amount1 = amount1Desired;
            }
            
            liquidity = min(
                (amount0 * pair.totalSupply) / pair.reserve0,
                (amount1 * pair.totalSupply) / pair.reserve1
            );
            pair.totalSupply += liquidity;
        }
        
        // Transfer tokens from user
        IERC20(pair.token0).safeTransferFrom(msg.sender, address(this), amount0);
        IERC20(pair.token1).safeTransferFrom(msg.sender, address(this), amount1);
        
        // Update reserves
        pair.reserve0 += amount0;
        pair.reserve1 += amount1;
        
        // Update position
        Position storage position = positions[pairId][msg.sender];
        position.liquidity += liquidity;
        position.token0Amount += amount0;
        position.token1Amount += amount1;
        position.timestamp = block.timestamp;
        
        // Track user pairs
        if (position.liquidity == liquidity) {
            userPairs[msg.sender].push(pairId);
        }
        
        emit LiquidityAdded(pairId, msg.sender, amount0, amount1, liquidity);
    }
    
    /**
     * @dev Remove liquidity from a forex pair
     */
    function removeLiquidity(
        string memory pairId,
        uint256 liquidity,
        uint256 amount0Min,
        uint256 amount1Min
    ) external nonReentrant returns (uint256 amount0, uint256 amount1) {
        ForexPair storage pair = pairs[pairId];
        require(pair.active, "Pair does not exist");
        
        Position storage position = positions[pairId][msg.sender];
        require(position.liquidity >= liquidity, "Insufficient liquidity");
        
        amount0 = (liquidity * pair.reserve0) / pair.totalSupply;
        amount1 = (liquidity * pair.reserve1) / pair.totalSupply;
        
        require(amount0 >= amount0Min, "Insufficient amount0");
        require(amount1 >= amount1Min, "Insufficient amount1");
        
        // Update position
        position.liquidity -= liquidity;
        position.token0Amount -= amount0;
        position.token1Amount -= amount1;
        
        // Update pair
        pair.totalSupply -= liquidity;
        pair.reserve0 -= amount0;
        pair.reserve1 -= amount1;
        
        // Transfer tokens to user
        IERC20(pair.token0).safeTransfer(msg.sender, amount0);
        IERC20(pair.token1).safeTransfer(msg.sender, amount1);
        
        emit LiquidityRemoved(pairId, msg.sender, amount0, amount1, liquidity);
    }
    
    /**
     * @dev Swap tokens in a forex pair
     */
    function swap(
        string memory pairId,
        address tokenIn,
        uint256 amountIn,
        uint256 amountOutMin
    ) external nonReentrant returns (uint256 amountOut) {
        ForexPair storage pair = pairs[pairId];
        require(pair.active, "Pair does not exist");
        require(tokenIn == pair.token0 || tokenIn == pair.token1, "Invalid token");
        
        bool isToken0 = tokenIn == pair.token0;
        uint256 reserveIn = isToken0 ? pair.reserve0 : pair.reserve1;
        uint256 reserveOut = isToken0 ? pair.reserve1 : pair.reserve0;
        
        // Calculate output amount (with fee)
        uint256 amountInWithFee = amountIn * (FEE_DENOMINATOR - pair.fee);
        amountOut = (amountInWithFee * reserveOut) / (reserveIn * FEE_DENOMINATOR + amountInWithFee);
        
        require(amountOut >= amountOutMin, "Insufficient output amount");
        
        // Transfer tokens
        IERC20(tokenIn).safeTransferFrom(msg.sender, address(this), amountIn);
        IERC20(isToken0 ? pair.token1 : pair.token0).safeTransfer(msg.sender, amountOut);
        
        // Update reserves
        if (isToken0) {
            pair.reserve0 += amountIn;
            pair.reserve1 -= amountOut;
        } else {
            pair.reserve1 += amountIn;
            pair.reserve0 -= amountOut;
        }
        
        emit Swap(pairId, msg.sender, tokenIn, amountIn, amountOut);
    }
    
    /**
     * @dev Get the current price of a pair
     */
    function getPrice(string memory pairId) external view returns (uint256 price0, uint256 price1) {
        ForexPair memory pair = pairs[pairId];
        require(pair.active, "Pair does not exist");
        
        if (pair.reserve0 > 0 && pair.reserve1 > 0) {
            price0 = (pair.reserve1 * 1e18) / pair.reserve0;
            price1 = (pair.reserve0 * 1e18) / pair.reserve1;
        }
    }
    
    /**
     * @dev Calculate output amount for a swap
     */
    function getAmountOut(
        string memory pairId,
        address tokenIn,
        uint256 amountIn
    ) external view returns (uint256 amountOut) {
        ForexPair memory pair = pairs[pairId];
        require(pair.active, "Pair does not exist");
        require(tokenIn == pair.token0 || tokenIn == pair.token1, "Invalid token");
        
        bool isToken0 = tokenIn == pair.token0;
        uint256 reserveIn = isToken0 ? pair.reserve0 : pair.reserve1;
        uint256 reserveOut = isToken0 ? pair.reserve1 : pair.reserve0;
        
        uint256 amountInWithFee = amountIn * (FEE_DENOMINATOR - pair.fee);
        amountOut = (amountInWithFee * reserveOut) / (reserveIn * FEE_DENOMINATOR + amountInWithFee);
    }
    
    /**
     * @dev Update the fee for a pair (owner only)
     */
    function updatePairFee(string memory pairId, uint256 newFee) external onlyOwner {
        require(newFee <= 100, "Fee too high"); // Max 1%
        pairs[pairId].fee = newFee;
    }
    
    /**
     * @dev Helper function: square root
     */
    function sqrt(uint256 x) private pure returns (uint256 y) {
        uint256 z = (x + 1) / 2;
        y = x;
        while (z < y) {
            y = z;
            z = (x / z + z) / 2;
        }
    }
    
    /**
     * @dev Helper function: minimum
     */
    function min(uint256 a, uint256 b) private pure returns (uint256) {
        return a < b ? a : b;
    }
}
