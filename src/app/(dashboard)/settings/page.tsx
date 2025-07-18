'use client';

import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { ProtectedRoute } from "@/components/features/auth/protected-route";
import { UserSessions } from "@/components/features/auth/user-sessions";
import MetaMaskConnect from '@/components/metamask/meta-mask-connect';
import { useState, useEffect } from 'react';
import { Wallet, Shield, Bell, User, ChevronRight, CheckCircle, AlertCircle, Trash2 } from 'lucide-react';
import { DeleteDialog } from "@/components/ui/delete-dialog";



interface WalletSettingsProps {
    connectedAccount: string;
    onConnect: (account: string) => void;
    onDisconnect: () => void;
    balance: string;
}



// Wallet Settings Component
function WalletSettings({ connectedAccount, onConnect, onDisconnect, balance }: WalletSettingsProps) {
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
                                <p className="text-lg font-semibold text-gray-900">{balance} ETH</p>
                            </div>
                        </div>
                    </div>

                    {/* Wallet Actions */}
                    <div className="space-y-3">
                        <h3 className="font-semibold text-gray-900">Wallet Actions</h3>

                        <div className="border border-gray-200 rounded-lg divide-y">
                            <button className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center justify-between">
                                <div>
                                    <p className="font-medium text-gray-900">View Transaction History</p>
                                    <p className="text-sm text-gray-500">See all your wallet transactions</p>
                                </div>
                                <ChevronRight className="w-5 h-5 text-gray-400" />
                            </button>

                            <button className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center justify-between">
                                <div>
                                    <p className="font-medium text-gray-900">Network Settings</p>
                                    <p className="text-sm text-gray-500">Manage network connections</p>
                                </div>
                                <ChevronRight className="w-5 h-5 text-gray-400" />
                            </button>

                            <button
                                onClick={onDisconnect}
                                className="w-full px-4 py-3 text-left hover:bg-red-50 flex items-center justify-between text-red-600"
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
                    <button className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center justify-between">
                        <div>
                            <p className="font-medium text-gray-900">Profile Information</p>
                            <p className="text-sm text-gray-500">Update your personal details</p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                    </button>

                    <button className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center justify-between">
                        <div>
                            <p className="font-medium text-gray-900">Email & Password</p>
                            <p className="text-sm text-gray-500">Manage your login credentials</p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                    </button>

                    <button className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center justify-between">
                        <div>
                            <p className="font-medium text-gray-900">Two-Factor Authentication</p>
                            <p className="text-sm text-gray-500">Enable additional security</p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                    </button>

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
                    <div className="px-4 py-3 flex items-center justify-between">
                        <div>
                            <p className="font-medium text-gray-900">Login Notifications</p>
                            <p className="text-sm text-gray-500">Get notified of new login attempts</p>
                        </div>
                        <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600 transition-colors">
                            <span className="translate-x-6 inline-block h-4 w-4 transform rounded-full bg-white transition-transform" />
                        </button>
                    </div>

                    <div className="px-4 py-3 flex items-center justify-between">
                        <div>
                            <p className="font-medium text-gray-900">Transaction Alerts</p>
                            <p className="text-sm text-gray-500">Alert for large transactions</p>
                        </div>
                        <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600 transition-colors">
                            <span className="translate-x-6 inline-block h-4 w-4 transform rounded-full bg-white transition-transform" />
                        </button>
                    </div>

                    <button className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center justify-between">
                        <div>
                            <p className="font-medium text-gray-900">Active Sessions</p>
                            <p className="text-sm text-gray-500">Manage your active login sessions</p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                    </button>
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
                    <div className="px-4 py-3 flex items-center justify-between">
                        <div>
                            <p className="font-medium text-gray-900">Email Notifications</p>
                            <p className="text-sm text-gray-500">Receive updates via email</p>
                        </div>
                        <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600 transition-colors">
                            <span className="translate-x-6 inline-block h-4 w-4 transform rounded-full bg-white transition-transform" />
                        </button>
                    </div>

                    <div className="px-4 py-3 flex items-center justify-between">
                        <div>
                            <p className="font-medium text-gray-900">Push Notifications</p>
                            <p className="text-sm text-gray-500">Get instant push notifications</p>
                        </div>
                        <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition-colors">
                            <span className="translate-x-1 inline-block h-4 w-4 transform rounded-full bg-white transition-transform" />
                        </button>
                    </div>

                    <div className="px-4 py-3 flex items-center justify-between">
                        <div>
                            <p className="font-medium text-gray-900">SMS Notifications</p>
                            <p className="text-sm text-gray-500">Receive SMS for important updates</p>
                        </div>
                        <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition-colors">
                            <span className="translate-x-1 inline-block h-4 w-4 transform rounded-full bg-white transition-transform" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function SettingsPage() {
    const [connectedAccount, setConnectedAccount] = useState('');
    const [accountBalance, setAccountBalance] = useState('0.0');

    // Load saved account from localStorage on component mount
    useEffect(() => {
        const savedAccount = localStorage.getItem('metamask_account');
        if (savedAccount) {
            setConnectedAccount(savedAccount);
            // In a real app, you'd fetch the current balance here
            setAccountBalance('1.234'); // Mock balance
        }
    }, []);

    const handleAccountConnect = (account: string) => {
        setConnectedAccount(account);
        localStorage.setItem('metamask_account', account);
        // In a real app, you'd fetch the balance here
        setAccountBalance('1.234'); // Mock balance
    };

    const handleAccountDisconnect = () => {
        setConnectedAccount('');
        setAccountBalance('0.0');
        localStorage.removeItem('metamask_account');
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