'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';

export default function DashboardPage() {
    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Welcome Section */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-white">
                    <h1 className="text-3xl font-bold mb-2">Welcome to ForexFX Platform</h1>
                    <p className="text-blue-100 mb-6">
                        Transform your forex trading with blockchain-powered stablecoins and crypto forex pairs.
                    </p>
                    <div className="flex flex-wrap gap-4">
                        <div className="bg-white/20 rounded-lg p-4">
                            <p className="text-sm text-blue-100">Total Portfolio Value</p>
                            <p className="text-2xl font-bold">$125,430.50</p>
                        </div>
                        <div className="bg-white/20 rounded-lg p-4">
                            <p className="text-sm text-blue-100">24h P&L</p>
                            <p className="text-2xl font-bold text-green-300">+$2,340.75</p>
                        </div>
                        <div className="bg-white/20 rounded-lg p-4">
                            <p className="text-sm text-blue-100">Active Positions</p>
                            <p className="text-2xl font-bold">5</p>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Deposit Funds</h3>
                        <p className="text-gray-600 text-sm">Add fiat or crypto to your wallet</p>
                    </div>

                    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer">
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Create Stablecoins</h3>
                        <p className="text-gray-600 text-sm">Generate forex-backed stablecoins</p>
                    </div>

                    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer">
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Forex Pairs</h3>
                        <p className="text-gray-600 text-sm">Create and trade crypto forex pairs</p>
                    </div>

                    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer">
                        <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                            <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Analytics</h3>
                        <p className="text-gray-600 text-sm">View market data and bubbles</p>
                    </div>
                </div>

                {/* Recent Activity & Market Overview */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Recent Transactions */}
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                        <div className="space-y-4">
                            {[
                                { type: 'Deposit', amount: '$10,000', currency: 'USD', status: 'Confirmed', time: '2 hours ago' },
                                { type: 'Create Pair', amount: 'JPYGBPfx', currency: '', status: 'Completed', time: '4 hours ago' },
                                { type: 'Swap', amount: '5,000', currency: 'USDfx → EURfx', status: 'Completed', time: '1 day ago' },
                            ].map((tx, index) => (
                                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">{tx.type}</p>
                                            <p className="text-xs text-gray-500">{tx.amount} {tx.currency}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                            {tx.status}
                                        </span>
                                        <p className="text-xs text-gray-500 mt-1">{tx.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Market Overview */}
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Market Overview</h3>
                        <div className="space-y-4">
                            {[
                                { pair: 'USDJPYfx', price: '1.0045', change: '+0.25%', color: 'text-green-600' },
                                { pair: 'EURGBPfx', price: '0.8523', change: '-0.15%', color: 'text-red-600' },
                                { pair: 'USDEURfx', price: '1.1234', change: '+0.05%', color: 'text-green-600' },
                                { pair: 'GBPJPYfx', price: '1.4567', change: '-0.30%', color: 'text-red-600' },
                            ].map((pair, index) => (
                                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">{pair.pair}</p>
                                        <p className="text-xs text-gray-500">Crypto Forex Pair</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-medium text-gray-900">{pair.price}</p>
                                        <p className={`text-xs ${pair.color}`}>{pair.change}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
