'use client';

import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { DepositForm, DepositHistory } from '@/components/features/deposits/deposit-form';

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

export default function DepositsPage() {
    const handleDepositSubmit = (data: { amount: number; currency: string; type: string; paymentMethod?: string }) => {
        console.log('Deposit data:', data);
        // Here you would call your API to create the deposit
        alert(`Deposit request created: ${data.amount} ${data.currency}`);
    };

    return (
        <DashboardLayout>
            <div className="max-w-6xl mx-auto space-y-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Deposits</h1>
                    <p className="text-gray-600 mt-2">
                        Add funds to your account to start trading forex pairs and creating stablecoins
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Deposit Form */}
                    <div>
                        <DepositForm onSubmit={handleDepositSubmit} />
                    </div>

                    {/* Deposit History */}
                    <div>
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
    );
}
