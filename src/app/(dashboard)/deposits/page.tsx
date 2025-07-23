'use client';

import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { DepositForm, DepositHistory } from '@/components/features/deposits/deposit-form';
import { useState, useEffect } from 'react';
import { ProtectedRoute } from "@/components/features/auth/protected-route";
import Link from 'next/link';
import { Settings, Wallet, AlertCircle, RefreshCw } from 'lucide-react';

// Mock data - in production this would come from your API
const mockDeposits = [
    {
        id: '1',
        amount: 10000,
        currency: 'USD',
        type: 'fiat',
        status: 'confirmed',
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    },
    {
        id: '2',
        amount: 1.5,
        currency: 'BTC',
        type: 'crypto',
        status: 'pending',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
    },
    {
        id: '3',
        amount: 5000,
        currency: 'USDC',
        type: 'crypto',
        status: 'confirmed',
        createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    },
];


interface MetaMaskAccountDetailsProps {
    account: string;
    balance: string;
    isLoadingBalance: boolean;
    onDisconnect: () => void;
    onRefreshBalance: () => void;
}

interface DepositFormData {
    amount: number;
    currency: string; // e.g., 'USD', 'BTC', 'USDC'
    paymentMethod?: string; // optional, e.g., 'metamask', 'bank-transfer'
    walletAddress?: string; // if crypto deposit
    transactionId?: string; // if submitting proof of transfer
}

// MetaMask Account Details Component
function MetaMaskAccountDetails({ account, balance, isLoadingBalance, onDisconnect, onRefreshBalance }: MetaMaskAccountDetailsProps) {
    const formatAddress = (address: string) => {
        if (!address) return '';
        return `${address.slice(0, 6)}...${address.slice(-4)}`;
    };

    return (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <Wallet className="w-6 h-6 text-blue-600" />
                    <h3 className="text-lg font-semibold text-gray-900">MetaMask Account</h3>
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    <span className="text-sm text-green-600">Connected</span>
                </div>
            </div>

            <div className="space-y-3">
                <div>
                    <label className="text-sm font-medium text-gray-500">Account Address</label>
                    <div className="flex items-center gap-2 mt-1">
                        <code className="text-sm bg-gray-100 px-2 py-1 rounded font-mono">
                            {formatAddress(account)}
                        </code>
                        <button
                            onClick={() => navigator.clipboard.writeText(account)}
                            className="text-xs text-blue-600 hover:text-blue-800"
                        >
                            Copy
                        </button>
                    </div>
                </div>

                <div>
                    <label className="text-sm font-medium text-gray-500">Balance</label>
                    <div className="flex items-center gap-2 mt-1">
                        <p className="text-lg font-semibold text-gray-900">
                            {isLoadingBalance ? 'Loading...' : `${balance} ETH`}
                        </p>
                        <button
                            onClick={onRefreshBalance}
                            disabled={isLoadingBalance}
                            className="p-1 text-gray-500 hover:text-gray-700 disabled:opacity-50"
                            title="Refresh balance"
                        >
                            <RefreshCw className={`w-4 h-4 ${isLoadingBalance ? 'animate-spin' : ''}`} />
                        </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                        This is your actual MetaMask balance. Click refresh to update.
                    </p>
                </div>

                <div className="flex gap-2 pt-2">
                    <button
                        onClick={onDisconnect}
                        className="px-4 py-2 text-sm text-red-600 border border-red-300 rounded-md hover:bg-red-50"
                    >
                        Disconnect
                    </button>
                    <Link href="/settings">
                        <button className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 flex items-center gap-2">
                            <Settings className="w-4 h-4" />
                            Settings
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
}

// No MetaMask Account Component
function NoMetaMaskAccount() {
    return (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
                <AlertCircle className="w-6 h-6 text-yellow-600" />
                <h3 className="text-lg font-semibold text-yellow-900">No MetaMask Account Connected</h3>
            </div>

            <p className="text-yellow-700 mb-4">
                Connect your MetaMask wallet to enable crypto deposits and withdrawals.
            </p>

            <Link href="/settings">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2">
                    <Settings className="w-4 h-4" />
                    Connect in Settings
                </button>
            </Link>
        </div>
    );
}

export default function DepositsPage() {
    const [connectedAccount, setConnectedAccount] = useState('');
    const [accountBalance, setAccountBalance] = useState('0.0');
    const [isLoadingBalance, setIsLoadingBalance] = useState(false);
    const CONTRACT_ADDRESS = "0x...";

    // Function to fetch actual MetaMask balance
    const fetchMetaMaskBalance = async (account: string) => {
        try {
            setIsLoadingBalance(true);

            if (typeof window !== 'undefined' && window.ethereum) {
                // Check if MetaMask is connected
                const accounts = await window.ethereum.request({ method: 'eth_accounts' });
                if (!accounts.includes(account)) {
                    throw new Error('Account not connected in MetaMask');
                }

                // Request balance from MetaMask
                const balance = await window.ethereum.request({
                    method: 'eth_getBalance',
                    params: [account, 'latest']
                });

                // Convert from Wei to ETH (1 ETH = 10^18 Wei)
                const balanceInEth = parseInt(balance, 16) / Math.pow(10, 18);
                setAccountBalance(balanceInEth.toFixed(4));
            } else {
                throw new Error('MetaMask not found');
            }
        } catch (error) {
            console.error('Error fetching balance:', error);
            setAccountBalance('0.0000');
            // You could show a user-friendly error message here
        } finally {
            setIsLoadingBalance(false);
        }
    };

    // Load saved account from localStorage on component mount
    useEffect(() => {
        const savedAccount = localStorage.getItem('metamask_account');
        if (savedAccount) {
            setConnectedAccount(savedAccount);
            // Fetch the actual balance from MetaMask
            fetchMetaMaskBalance(savedAccount);
        }

        // Listen for account changes in MetaMask
        if (typeof window !== 'undefined' && window.ethereum) {
            const handleAccountsChanged = (accounts: string[]) => {
                if (accounts.length === 0) {
                    // User disconnected
                    handleAccountDisconnect();
                } else if (accounts[0] !== connectedAccount) {
                    // User switched accounts
                    setConnectedAccount(accounts[0]);
                    localStorage.setItem('metamask_account', accounts[0]);
                    fetchMetaMaskBalance(accounts[0]);
                }
            };

            window.ethereum.on('accountsChanged', handleAccountsChanged);

            // Cleanup listener on unmount
            return () => {
                if (window.ethereum?.removeListener) {
                    window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
                }
            };
        }
    }, [connectedAccount]);

    const handleAccountDisconnect = () => {
        setConnectedAccount('');
        setAccountBalance('0.0');
        localStorage.removeItem('metamask_account');
    };

    const handleRefreshBalance = () => {
        if (connectedAccount) {
            fetchMetaMaskBalance(connectedAccount);
        }
    };

    const handleDepositSubmit = (data: DepositFormData) => {
        // Here you would call your API to create the deposit
        alert(`Deposit request created: ${data.amount} ${data.currency}`);
    };

    return (
        <ProtectedRoute>
            <DashboardLayout>
                <div className="mx-auto space-y-8">
                    {/*<div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg text-white p-8">*/}
                    {/*    <h1 className="text-2xl font-bold mb-6">USD Deposit</h1>*/}

                    {/*    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">*/}
                    {/*        <h2 className="text-lg font-semibold mb-4">Wallet Connection</h2>*/}

                    {/*        {connectedAccount ? (*/}
                    {/*            <div className="text-white">*/}
                    {/*                <p className="text-sm opacity-90 mb-2">Connected Account:</p>*/}
                    {/*                <code className="text-sm bg-black/20 px-2 py-1 rounded">*/}
                    {/*                    {connectedAccount.slice(0, 6)}...{connectedAccount.slice(-4)}*/}
                    {/*                </code>*/}
                    {/*                <p className="text-sm opacity-90 mt-2">Balance: {accountBalance} ETH</p>*/}
                    {/*            </div>*/}
                    {/*        ) : (*/}
                    {/*            <MetaMaskConnect onConnect={handleAccountConnect} />*/}
                    {/*        )}*/}
                    {/*    </div>*/}
                    {/*</div>*/}

                    {/*<div>*/}
                    {/*    <h1 className="text-3xl font-bold text-gray-900">Deposits</h1>*/}
                    {/*    <p className="text-gray-600 mt-2">*/}
                    {/*        Add funds to your account to start trading forex pairs and creating stablecoins*/}
                    {/*    </p>*/}
                    {/*</div>*/}

                    {/* MetaMask Account Status */}
                    <div>
                        {connectedAccount ? (
                            <MetaMaskAccountDetails
                                account={connectedAccount}
                                balance={accountBalance}
                                isLoadingBalance={isLoadingBalance}
                                onDisconnect={handleAccountDisconnect}
                                onRefreshBalance={handleRefreshBalance}
                            />
                        ) : (
                            <NoMetaMaskAccount />
                        )}
                    </div>

                    <div className="flex gap-5">
                        {/* Deposit Form */}
                        <div className={'w-full md:w-1/2'}>
                            <DepositForm onSubmit={handleDepositSubmit} />
                        </div>

                        {/* Deposit History */}
                        <div className={'w-full'}>
                            <DepositHistory deposits={mockDeposits} />
                        </div>
                    </div>

                    {/* Info Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                            <h3 className="font-semibold text-blue-900 mb-2">Fast Processing</h3>
                            <p className="text-blue-700 text-sm">
                                Crypto deposits are confirmed within minutes. Bank transfers take 1-3 business days.
                            </p>
                        </div>

                        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                            <h3 className="font-semibold text-green-900 mb-2">No Deposit Fees</h3>
                            <p className="text-green-700 text-sm">
                                We don't charge any fees for deposits. Only network fees apply for crypto deposits.
                            </p>
                        </div>

                        <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                            <h3 className="font-semibold text-purple-900 mb-2">Multi-Currency Support</h3>
                            <p className="text-purple-700 text-sm">
                                Deposit in major fiat currencies or popular cryptocurrencies like BTC, ETH, USDC.
                            </p>
                        </div>
                    </div>
                </div>
            </DashboardLayout>
        </ProtectedRoute>
    );
}