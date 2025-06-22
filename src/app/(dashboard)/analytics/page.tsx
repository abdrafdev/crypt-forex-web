'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { CryptoBubbles, MarketList } from '@/components/features/crypto-bubbles/CryptoBubbles';
import { CryptoBubbleData } from '@/types';

// Mock data for the crypto bubbles
const mockBubbleData: CryptoBubbleData[] = [
    {
        id: '1',
        symbol: 'USDfx',
        name: 'USD Stablecoin',
        marketCap: 50000000,
        priceChange24h: 0.05,
        volume24h: 2500000,
        category: 'stablecoin',
        color: '#3b82f6',
        size: 80,
    },
    {
        id: '2',
        symbol: 'EURfx',
        name: 'EUR Stablecoin',
        marketCap: 35000000,
        priceChange24h: -0.12,
        volume24h: 1800000,
        category: 'stablecoin',
        color: '#3b82f6',
        size: 65,
    },
    {
        id: '3',
        symbol: 'USDEURfx',
        name: 'USD-EUR Forex Pair',
        marketCap: 25000000,
        priceChange24h: 0.25,
        volume24h: 3200000,
        category: 'forex-pair',
        color: '#8b5cf6',
        size: 55,
    },
    {
        id: '4',
        symbol: 'JPYfx',
        name: 'JPY Stablecoin',
        marketCap: 20000000,
        priceChange24h: -0.08,
        volume24h: 1200000,
        category: 'stablecoin',
        color: '#3b82f6',
        size: 45,
    },
    {
        id: '5',
        symbol: 'GBPfx',
        name: 'GBP Stablecoin',
        marketCap: 18000000,
        priceChange24h: 0.15,
        volume24h: 950000,
        category: 'stablecoin',
        color: '#3b82f6',
        size: 42,
    },
    {
        id: '6',
        symbol: 'JPYGBPfx',
        name: 'JPY-GBP Forex Pair',
        marketCap: 15000000,
        priceChange24h: -0.32,
        volume24h: 1800000,
        category: 'forex-pair',
        color: '#8b5cf6',
        size: 38,
    },
    {
        id: '7',
        symbol: 'CHFfx',
        name: 'CHF Stablecoin',
        marketCap: 12000000,
        priceChange24h: 0.08,
        volume24h: 650000,
        category: 'stablecoin',
        color: '#3b82f6',
        size: 35,
    },
    {
        id: '8',
        symbol: 'USDJPYfx',
        name: 'USD-JPY Forex Pair',
        marketCap: 22000000,
        priceChange24h: 0.18,
        volume24h: 2800000,
        category: 'forex-pair',
        color: '#8b5cf6',
        size: 50,
    },
    {
        id: '9',
        symbol: 'EURGBPfx',
        name: 'EUR-GBP Forex Pair',
        marketCap: 18000000,
        priceChange24h: -0.15,
        volume24h: 2100000,
        category: 'forex-pair',
        color: '#8b5cf6',
        size: 42,
    },
    {
        id: '10',
        symbol: 'CADfx',
        name: 'CAD Stablecoin',
        marketCap: 8000000,
        priceChange24h: 0.22,
        volume24h: 420000,
        category: 'stablecoin',
        color: '#3b82f6',
        size: 28,
    },
];

export default function AnalyticsPage() {
    const totalMarketCap = mockBubbleData.reduce((sum, item) => sum + item.marketCap, 0);
    const totalVolume = mockBubbleData.reduce((sum, item) => sum + item.volume24h, 0);
    const gainers = mockBubbleData.filter(item => item.priceChange24h > 0).length;
    const losers = mockBubbleData.filter(item => item.priceChange24h < 0).length;

    return (
        <DashboardLayout>
            <div className="space-y-8">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Market Analytics</h1>
                    <p className="text-gray-600 mt-2">
                        Visualize and analyze the performance of your stablecoins and forex pairs
                    </p>
                </div>

                {/* Market Overview Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="w-8 h-8 bg-blue-100 rounded-md flex items-center justify-center">
                                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                    </svg>
                                </div>
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">Total Market Cap</dt>
                                    <dd className="text-lg font-medium text-gray-900">
                                        ${(totalMarketCap / 1000000).toFixed(1)}M
                                    </dd>
                                </dl>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="w-8 h-8 bg-green-100 rounded-md flex items-center justify-center">
                                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                    </svg>
                                </div>
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">24h Volume</dt>
                                    <dd className="text-lg font-medium text-gray-900">
                                        ${(totalVolume / 1000000).toFixed(1)}M
                                    </dd>
                                </dl>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="w-8 h-8 bg-green-100 rounded-md flex items-center justify-center">
                                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                                    </svg>
                                </div>
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">Gainers</dt>
                                    <dd className="text-lg font-medium text-green-600">{gainers}</dd>
                                </dl>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="w-8 h-8 bg-red-100 rounded-md flex items-center justify-center">
                                    <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
                                    </svg>
                                </div>
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">Losers</dt>
                                    <dd className="text-lg font-medium text-red-600">{losers}</dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Crypto Bubbles Visualization */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                    <div className="xl:col-span-2">
                        <CryptoBubbles data={mockBubbleData} width={800} height={500} />
                    </div>
                    <div className="xl:col-span-1">
                        <MarketList data={mockBubbleData} />
                    </div>
                </div>

                {/* Market Insights */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-blue-900 mb-4">Market Trends</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-blue-700">Stablecoins:</span>
                                <span className="font-medium text-blue-900">
                                    {mockBubbleData.filter(item => item.category === 'stablecoin').length} active
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-blue-700">Forex Pairs:</span>
                                <span className="font-medium text-blue-900">
                                    {mockBubbleData.filter(item => item.category === 'forex-pair').length} active
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-blue-700">Avg. Performance:</span>
                                <span className="font-medium text-blue-900">
                                    {(mockBubbleData.reduce((sum, item) => sum + item.priceChange24h, 0) / mockBubbleData.length).toFixed(2)}%
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-purple-900 mb-4">Platform Insights</h3>
                        <div className="space-y-3">
                            <p className="text-purple-700 text-sm">
                                • Forex pairs are showing higher volatility than traditional stablecoins
                            </p>
                            <p className="text-purple-700 text-sm">
                                • USD-based pairs dominate trading volume
                            </p>
                            <p className="text-purple-700 text-sm">
                                • Market correlation with traditional forex markets is strong
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
