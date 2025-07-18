'use client';

import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { ProtectedRoute } from "@/components/features/auth/protected-route";
import { UserSessions } from "@/components/features/auth/user-sessions";
import MetaMaskConnect from '@/components/metamask/meta-mask-connect';
import { useState, useEffect } from 'react';
import { Wallet, Shield, Bell, User, ChevronRight, CheckCircle, AlertCircle, Trash2, RefreshCw } from 'lucide-react';
import { DeleteDialog } from "@/components/ui/delete-dialog";
import Link from "next/link";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";



interface WalletSettingsProps {
    connectedAccount: string;
    onConnect: (account: string) => void;
    onDisconnect: () => void;
    balance: string;
    isLoadingBalance: boolean;
    onRefreshBalance: () => void;
}



// Wallet Settings Component
function WalletSettings({ connectedAccount, onConnect, onDisconnect, balance, isLoadingBalance, onRefreshBalance }: WalletSettingsProps) {
    const formatAddress = (address: string) => {
        if (!address) return '';
        return `${address.slice(0, 6)}...${address.slice(-4)}`;
    };

    return (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
                <Wallet className="w-6 h-6 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-900">Wallet Settings</h2>
            </div>

            {connectedAccount ? (
                <div className="space-y-6">
                    {/* Connected Account Info */}
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="flex items-center gap-3 mb-3">
                            <CheckCircle className="w-5 h-5 text-green-600" />
                            <h3 className="font-semibold text-green-900">MetaMask Connected</h3>
                        </div>

                        <div className="space-y-2">
                            <div>
                                <label className="text-sm font-medium text-gray-600">Account Address</label>
                                <div className="flex items-center gap-2 mt-1">
                                    <code className="text-sm bg-white px-2 py-1 rounded border font-mono">
                                        {formatAddress(connectedAccount)}
                                    </code>
                                    <button
                                        onClick={() => navigator.clipboard.writeText(connectedAccount)}
                                        className="text-xs text-blue-600 hover:text-blue-800"
                                    >
                                        Copy Full Address
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-600">Balance</label>
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
                        </div>
                    </div>

                    {/* Wallet Actions */}
                    <div className="space-y-3">
                        <h3 className="font-semibold text-gray-900">Wallet Actions</h3>

                        <div className="border border-gray-200 rounded-lg divide-y">
                            <Link href={''}>
                                <button className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center justify-between cursor-pointer">
                                    <div>
                                        <p className="font-medium text-gray-900">View Transaction History</p>
                                        <p className="text-sm text-gray-500">See all your wallet transactions</p>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-gray-400" />
                                </button>
                            </Link>

                            <Link href={''}>
                                <button className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center justify-between cursor-pointer">
                                    <div>
                                        <p className="font-medium text-gray-900">Network Settings</p>
                                        <p className="text-sm text-gray-500">Manage network connections</p>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-gray-400" />
                                </button>
                            </Link>

                            <button
                                onClick={onDisconnect}
                                className="w-full px-4 py-3 text-left hover:bg-red-50 flex items-center justify-between text-red-600 cursor-pointer"
                            >
                                <div>
                                    <p className="font-medium">Disconnect Wallet</p>
                                    <p className="text-sm text-red-500">Remove wallet connection</p>
                                </div>
                                <Trash2 className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="space-y-6">
                    {/* No Wallet Connected */}
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <div className="flex items-center gap-3 mb-3">
                            <AlertCircle className="w-5 h-5 text-yellow-600" />
                            <h3 className="font-semibold text-yellow-900">No Wallet Connected</h3>
                        </div>
                        <p className="text-yellow-700">
                            Connect your MetaMask wallet to enable crypto deposits, withdrawals, and trading features.
                        </p>
                    </div>

                    {/* Connect Wallet Section */}
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-3">Connect Your Wallet</h3>
                        <div className="border border-gray-200 rounded-lg p-4">
                            <MetaMaskConnect onConnect={onConnect} />
                        </div>
                    </div>

                    {/* Wallet Benefits */}
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-3">Benefits of Connecting</h3>
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-green-600" />
                                <span className="text-sm text-gray-700">Instant crypto deposits and withdrawals</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-green-600" />
                                <span className="text-sm text-gray-700">Direct DeFi trading access</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-green-600" />
                                <span className="text-sm text-gray-700">Lower transaction fees</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-green-600" />
                                <span className="text-sm text-gray-700">Enhanced security features</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// Account Settings Component
function AccountSettings() {
    return (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
                <User className="w-6 h-6 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-900">Account Settings</h2>
            </div>

            <div className="space-y-4">
                <div className="border border-gray-200 rounded-lg divide-y">
                    <Link href={'/profile'}>
                        <button className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center justify-between cursor-pointer">
                            <div>
                                <p className="font-medium text-gray-900">Profile Information</p>
                                <p className="text-sm text-gray-500">Update your personal details</p>
                            </div>
                            <ChevronRight className="w-5 h-5 text-gray-400" />
                        </button>
                    </Link>

                    <Link href={'/'}>
                        <button className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center justify-between cursor-pointer">
                            <div>
                                <p className="font-medium text-gray-900">Email & Password</p>
                                <p className="text-sm text-gray-500">Manage your login credentials</p>
                            </div>
                            <ChevronRight className="w-5 h-5 text-gray-400" />
                        </button>
                    </Link>

                    <Link href={''}>
                        <button className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center justify-between cursor-pointer">
                            <div>
                                <p className="font-medium text-gray-900">Two-Factor Authentication</p>
                                <p className="text-sm text-gray-500">Enable additional security</p>
                            </div>
                            <ChevronRight className="w-5 h-5 text-gray-400" />
                        </button>
                    </Link>

                    <DeleteDialog />
                </div>
            </div>
        </div>
    );
}

// Security Settings Component
function SecuritySettings() {
    return (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
                <Shield className="w-6 h-6 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-900">Security Settings</h2>
            </div>

            <div className="space-y-4">
                <div className="border border-gray-200 rounded-lg divide-y">
                    <Label htmlFor={'notifications'} className="px-4 py-3 flex items-center justify-between cursor-pointer">
                        <div>
                            <p className="text-lg font-medium text-gray-900">Login Notifications</p>
                            <p className="text-sm text-gray-500">Get notified of new login attempts</p>
                        </div>
                        <Switch id={'notifications'} />
                    </Label>

                    <Label htmlFor={'transactions'} className="px-4 py-3 flex items-center justify-between cursor-pointer">
                        <div>
                            <p className="text-lg font-medium text-gray-900">Transaction Alerts</p>
                            <p className="text-sm text-gray-500">Alert for large transactions</p>
                        </div>
                        <Switch id={'transactions'} />
                    </Label>

                    <Link href={''}>
                        <button className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center justify-between cursor-pointer">
                            <div>
                                <p className="font-medium text-gray-900">Active Sessions</p>
                                <p className="text-sm text-gray-500">Manage your active login sessions</p>
                            </div>
                            <ChevronRight className="w-5 h-5 text-gray-400" />
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
}

// Notifications Settings Component
function NotificationSettings() {
    return (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
                <Bell className="w-6 h-6 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-900">Notification Settings</h2>
            </div>

            <div className="space-y-4">
                <div className="border border-gray-200 rounded-lg divide-y">
                    <Label htmlFor={'emailNotifications'} className="px-4 py-3 flex items-center justify-between cursor-pointer">
                        <div>
                            <p className="text-lg font-medium text-gray-900">Email Notifications</p>
                            <p className="text-sm text-gray-500">Receive updates via email</p>
                        </div>
                        <Switch id={'emailNotifications'} />
                    </Label>

                    <Label htmlFor={'pushNotifications'} className="px-4 py-3 flex items-center justify-between cursor-pointer">
                        <div>
                            <p className="text-lg font-medium text-gray-900">Push Notifications</p>
                            <p className="text-sm text-gray-500">Get instant push notifications</p>
                        </div>
                        <Switch id={'pushNotifications'} />
                    </Label>
                </div>
            </div>
        </div>
    );
}

export default function SettingsPage() {
    const [connectedAccount, setConnectedAccount] = useState('');
    const [accountBalance, setAccountBalance] = useState('0.0');
    const [isLoadingBalance, setIsLoadingBalance] = useState(false);

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

    const handleAccountConnect = (account: string) => {
        setConnectedAccount(account);
        localStorage.setItem('metamask_account', account);
        // Fetch the actual balance from MetaMask
        fetchMetaMaskBalance(account);
    };

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

    return (
        <ProtectedRoute>
            <DashboardLayout>
                <div className="mx-auto space-y-8">
                    <div className="flex flex-col gap-5">
                        {/* User Account Details */}
                        <AccountSettings />

                        {/* Wallet Settings */}
                        <WalletSettings
                            connectedAccount={connectedAccount}
                            onConnect={handleAccountConnect}
                            onDisconnect={handleAccountDisconnect}
                            balance={accountBalance}
                            isLoadingBalance={isLoadingBalance}
                            onRefreshBalance={handleRefreshBalance}
                        />

                        {/* Security Settings */}
                        <SecuritySettings />

                        {/* Active Sessions */}
                        <UserSessions />

                        {/* Notification Settings */}
                        <NotificationSettings />
                    </div>
                </div>
            </DashboardLayout>
        </ProtectedRoute>
    );
}