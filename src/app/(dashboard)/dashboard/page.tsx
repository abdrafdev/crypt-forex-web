'use client';

import { ProtectedRoute } from '@/components/features/auth/protected-route';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { useAuth } from '@/hooks/useAuth';

export default function DashboardPage() {
    const { user } = useAuth();

    // Get current date and time
    const currentDate = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    const currentTime = new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });

    return (
        <ProtectedRoute>
            <DashboardLayout>
                <div className="space-y-6">
                    {/* Welcome Section */}
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-white">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h1 className="text-3xl font-bold mb-2">
                                    Welcome back, {user?.name || user?.username || 'hmzi67'}!
                                </h1>
                                <p className="text-blue-100 mb-2">
                                    Transform your forex trading with blockchain-powered stablecoins and crypto forex pairs.
                                </p>
                                <div className="text-blue-100 text-sm">
                                    <p>{currentDate}</p>
                                    <p>Last login: {currentTime}</p>
                                </div>
                            </div>
                            <div className="text-right text-blue-100 text-sm">
                                <p>UTC: 2025-07-04 19:34:15</p>
                                <p>Market Status: <span className="text-green-300 font-semibold">Open</span></p>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-4">
                            <div className="bg-white/20 rounded-lg p-4 min-w-[200px]">
                                <p className="text-sm text-blue-100">Total Portfolio Value</p>
                                <p className="text-2xl font-bold">$125,430.50</p>
                                <p className="text-xs text-green-300">+2.3% today</p>
                            </div>
                            <div className="bg-white/20 rounded-lg p-4 min-w-[200px]">
                                <p className="text-sm text-blue-100">24h P&L</p>
                                <p className="text-2xl font-bold text-green-300">+$2,340.75</p>
                                <p className="text-xs text-blue-100">+1.9% change</p>
                            </div>
                            <div className="bg-white/20 rounded-lg p-4 min-w-[200px]">
                                <p className="text-sm text-blue-100">Active Positions</p>
                                <p className="text-2xl font-bold">5</p>
                                <p className="text-xs text-blue-100">2 profitable</p>
                            </div>
                            <div className="bg-white/20 rounded-lg p-4 min-w-[200px]">
                                <p className="text-sm text-blue-100">Available Balance</p>
                                <p className="text-2xl font-bold">$25,670.25</p>
                                <p className="text-xs text-blue-100">Ready to trade</p>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-all duration-200 cursor-pointer group">
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Deposit Funds</h3>
                            <p className="text-gray-600 text-sm mb-3">Add fiat or crypto to your wallet</p>
                            <div className="text-xs text-blue-600 font-medium">
                                Supported: USD, EUR, BTC, ETH
                            </div>
                        </div>

                        <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-all duration-200 cursor-pointer group">
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-green-200 transition-colors">
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Create Stablecoins</h3>
                            <p className="text-gray-600 text-sm mb-3">Generate forex-backed stablecoins</p>
                            <div className="text-xs text-green-600 font-medium">
                                USDfx, EURfx, JPYfx, GBPfx
                            </div>
                        </div>

                        <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-all duration-200 cursor-pointer group">
                            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-purple-200 transition-colors">
                                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Trade Forex Pairs</h3>
                            <p className="text-gray-600 text-sm mb-3">Create and trade crypto forex pairs</p>
                            <div className="text-xs text-purple-600 font-medium">
                                24/7 trading available
                            </div>
                        </div>

                        <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-all duration-200 cursor-pointer group">
                            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-orange-200 transition-colors">
                                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Analytics</h3>
                            <p className="text-gray-600 text-sm mb-3">View market data and analytics</p>
                            <div className="text-xs text-orange-600 font-medium">
                                Real-time insights
                            </div>
                        </div>
                    </div>

                    {/* Recent Activity & Market Overview */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Recent Transactions */}
                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
                                <button className="text-blue-600 text-sm hover:text-blue-700">View All</button>
                            </div>
                            <div className="space-y-4">
                                {[
                                    {
                                        type: 'Deposit',
                                        amount: '$10,000',
                                        currency: 'USD',
                                        status: 'Confirmed',
                                        time: '2 hours ago',
                                        icon: '💰',
                                        color: 'bg-green-100 text-green-800'
                                    },
                                    {
                                        type: 'Create Pair',
                                        amount: 'JPYGBPfx',
                                        currency: '',
                                        status: 'Completed',
                                        time: '4 hours ago',
                                        icon: '🔗',
                                        color: 'bg-blue-100 text-blue-800'
                                    },
                                    {
                                        type: 'Swap',
                                        amount: '5,000',
                                        currency: 'USDfx → EURfx',
                                        status: 'Completed',
                                        time: '1 day ago',
                                        icon: '🔄',
                                        color: 'bg-purple-100 text-purple-800'
                                    },
                                    {
                                        type: 'Withdraw',
                                        amount: '$2,500',
                                        currency: 'USD',
                                        status: 'Processing',
                                        time: '1 day ago',
                                        icon: '📤',
                                        color: 'bg-yellow-100 text-yellow-800'
                                    },
                                ].map((tx, index) => (
                                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-lg">
                                                {tx.icon}
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">{tx.type}</p>
                                                <p className="text-xs text-gray-500">{tx.amount} {tx.currency}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${tx.color}`}>
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
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-semibold text-gray-900">Live Forex Pairs</h3>
                                <div className="flex items-center space-x-2">
                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                    <span className="text-xs text-gray-500">Live</span>
                                </div>
                            </div>
                            <div className="space-y-4">
                                {[
                                    {
                                        pair: 'USD/JPYfx',
                                        price: '1.0045',
                                        change: '+0.25%',
                                        color: 'text-green-600',
                                        volume: '$2.4M',
                                        flag: '🇺🇸🇯🇵'
                                    },
                                    {
                                        pair: 'EUR/GBPfx',
                                        price: '0.8523',
                                        change: '-0.15%',
                                        color: 'text-red-600',
                                        volume: '$1.8M',
                                        flag: '🇪🇺🇬🇧'
                                    },
                                    {
                                        pair: 'USD/EURfx',
                                        price: '1.1234',
                                        change: '+0.05%',
                                        color: 'text-green-600',
                                        volume: '$3.1M',
                                        flag: '🇺🇸🇪🇺'
                                    },
                                    {
                                        pair: 'GBP/JPYfx',
                                        price: '1.4567',
                                        change: '-0.30%',
                                        color: 'text-red-600',
                                        volume: '$1.2M',
                                        flag: '🇬🇧🇯🇵'
                                    },
                                    {
                                        pair: 'AUD/USDfx',
                                        price: '0.7234',
                                        change: '+0.18%',
                                        color: 'text-green-600',
                                        volume: '$980K',
                                        flag: '🇦🇺🇺🇸'
                                    },
                                ].map((pair, index) => (
                                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                                        <div className="flex items-center space-x-3">
                                            <span className="text-lg">{pair.flag}</span>
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">{pair.pair}</p>
                                                <p className="text-xs text-gray-500">Vol: {pair.volume}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-medium text-gray-900">{pair.price}</p>
                                            <p className={`text-xs font-medium ${pair.color}`}>{pair.change}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-4 pt-4 border-t border-gray-200">
                                <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                                    View Full Market
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Additional Widgets */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Portfolio Distribution */}
                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Portfolio Distribution</h3>
                            <div className="space-y-3">
                                {[
                                    { currency: 'USDfx', percentage: 45, amount: '$56,443.73', color: 'bg-blue-500' },
                                    { currency: 'EURfx', percentage: 25, amount: '$31,357.63', color: 'bg-green-500' },
                                    { currency: 'JPYfx', percentage: 20, amount: '$25,086.10', color: 'bg-purple-500' },
                                    { currency: 'GBPfx', percentage: 10, amount: '$12,543.05', color: 'bg-orange-500' },
                                ].map((item, index) => (
                                    <div key={index} className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                                            <span className="text-sm font-medium text-gray-700">{item.currency}</span>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-medium text-gray-900">{item.amount}</p>
                                            <p className="text-xs text-gray-500">{item.percentage}%</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Trading Stats</h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">Win Rate</span>
                                    <span className="text-sm font-semibold text-green-600">73.2%</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">Total Trades</span>
                                    <span className="text-sm font-semibold text-gray-900">142</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">Best Day</span>
                                    <span className="text-sm font-semibold text-green-600">+$3,247</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">This Month</span>
                                    <span className="text-sm font-semibold text-green-600">+12.8%</span>
                                </div>
                            </div>
                        </div>

                        {/* News & Updates */}
                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Market News</h3>
                            <div className="space-y-3">
                                {[
                                    {
                                        title: "USD strengthens against major currencies",
                                        time: "30 minutes ago",
                                        impact: "high"
                                    },
                                    {
                                        title: "ECB maintains interest rates",
                                        time: "2 hours ago",
                                        impact: "medium"
                                    },
                                    {
                                        title: "JPY shows volatility in Asian markets",
                                        time: "4 hours ago",
                                        impact: "low"
                                    }
                                ].map((news, index) => (
                                    <div key={index} className="flex items-start space-x-3 p-2 hover:bg-gray-50 rounded transition-colors">
                                        <div className={`w-2 h-2 rounded-full mt-2 ${news.impact === 'high' ? 'bg-red-500' :
                                            news.impact === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                                            }`}></div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-gray-900">{news.title}</p>
                                            <p className="text-xs text-gray-500">{news.time}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </DashboardLayout>
        </ProtectedRoute>
    );
}