'use client'
import { useState } from 'react'
import { ethers } from 'ethers'

// ERC-20 ABI for token transfers (simplified)
const ERC20_ABI = [
    "function transfer(address to, uint256 amount) returns (bool)",
    "function balanceOf(address account) view returns (uint256)",
    "function decimals() view returns (uint8)",
    "function approve(address spender, uint256 amount) returns (bool)"
]

// USDC contract address on Ethereum mainnet
const USDC_ADDRESS = "0xA0b86a33E6441319781B8d1d8dF0E5BAfAF71b4C"

interface USDDepositProps {
    connectedAccount: string
    contractAddress: string // Your smart contract address
}

// Add ethereum property to Window interface
declare global {
    interface Window {
        ethereum?: any
    }
}

export default function USDDeposit({ connectedAccount, contractAddress }: USDDepositProps) {
    const [amount, setAmount] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [balance, setBalance] = useState('0')

    const getProvider = async () => {
        if (typeof window !== 'undefined' && window.ethereum) {
            // For ethers v6
            return new ethers.BrowserProvider(window.ethereum)
        }
        throw new Error('MetaMask not found')
    }

    const checkUSDCBalance = async () => {
        try {
            const provider = await getProvider()
            const contract = new ethers.Contract(USDC_ADDRESS, ERC20_ABI, provider)
            const balance = await contract.balanceOf(connectedAccount)
            const decimals = await contract.decimals()
            setBalance(ethers.formatUnits(balance, decimals))
        } catch (error) {
            console.error('Error checking balance:', error)
        }
    }

    const depositUSDC = async () => {
        if (!amount || !connectedAccount) return

        setIsLoading(true)
        try {
            const provider = await getProvider()
            const signer = await provider.getSigner()

            // USDC contract instance
            const usdcContract = new ethers.Contract(USDC_ADDRESS, ERC20_ABI, signer)

            // Convert amount to proper decimals (USDC has 6 decimals)
            const amountInWei = ethers.parseUnits(amount, 6)

            // First approve the contract to spend USDC
            const approveTx = await usdcContract.approve(contractAddress, amountInWei)
            await approveTx.wait()

            // Then call your contract's deposit function
            // You'll need to implement this based on your smart contract
            const depositTx = await depositToContract(signer, amountInWei)
            await depositTx.wait()

            alert('Deposit successful!')
            setAmount('')
            checkUSDCBalance()
        } catch (error) {
            console.error('Deposit failed:', error)
            alert('Deposit failed: ' + (error as Error).message)
        } finally {
            setIsLoading(false)
        }
    }

    const depositToContract = async (signer: any, amount: bigint) => {
        // Your smart contract ABI and deposit function
        const contractABI = [
            "function depositUSDC(uint256 amount) external"
        ]

        const contract = new ethers.Contract(contractAddress, contractABI, signer)
        return await contract.depositUSDC(amount)
    }

    return (
        <div className="p-4 border rounded-lg">
            <h3 className="text-lg font-bold mb-4">Deposit USDC</h3>

            <div className="mb-4">
                <button
                    onClick={checkUSDCBalance}
                    className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-1 px-2 rounded text-sm"
                >
                    Check USDC Balance
                </button>
                <p className="text-sm mt-2">Balance: {balance} USDC</p>
            </div>

            <div className="mb-4">
                <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Amount in USDC"
                    className="border rounded px-3 py-2 w-full"
                    step="0.01"
                    min="0"
                />
            </div>

            <button
                onClick={depositUSDC}
                disabled={!amount || isLoading || !connectedAccount}
                className="bg-green-500 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded w-full"
            >
                {isLoading ? 'Processing...' : 'Deposit USDC'}
            </button>
        </div>
    )
}