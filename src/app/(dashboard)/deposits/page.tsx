'use client';

import { useAppKitAccount } from "@reown/appkit/react";
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
            <div className="flex items-center justify-left mb-4 gap-3">
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
                <appkit-button balance="show" />
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

            <div>
                <appkit-button balance="hide" />
            </div>
        </div>
    );
}

export default function DepositsPage() {
    const { address, isConnected, caipAddress, status, embeddedWalletInfo } = useAppKitAccount();

    const handleDepositSubmit = (data: DepositFormData) => {
        // Here you would call your API to create the deposit
        alert(`Deposit request created: ${data.amount} ${data.currency}`);
    };

    return (
        <ProtectedRoute>
            <DashboardLayout>
                <div className="mx-auto space-y-8">
                    {/* MetaMask Account Status */}
                    <div>
                        {isConnected ? (
                            <MetaMaskAccountDetails />
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