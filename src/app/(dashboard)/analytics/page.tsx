'use client';

import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { CryptoBubbles, MarketList } from '@/components/features/crypto-bubbles/crypto-bubbles';
import { LoadingState } from '@/components/ui/loading-state';
import { ErrorState } from '@/components/ui/error-state';
import { useCryptoData } from '@/hooks/useCryptoData';

export default function AnalyticsPage() {
    // Use the custom hook to fetch data
    const {
        bubbleData,
        totalMarketCap,
        totalVolume,
        gainers,
        losers,
        isLoading,
        error,
        refresh
    } = useCryptoData(10); // Fetch top 10 cryptos

    // Handle loading state
    if (isLoading) {
        return (
            <DashboardLayout>
                <LoadingState />
            </DashboardLayout>
        );
    }

    // Handle error state
    if (error) {
        return (
            <DashboardLayout>
                <ErrorState message={error} onRetry={refresh} />
            </DashboardLayout>
        );
    }

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
                                        ${(totalMarketCap / 1000000000).toFixed(1)}B
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
                                        ${(totalVolume / 1000000000).toFixed(1)}B
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
                        <CryptoBubbles data={bubbleData} width={800} height={500} />
                    </div>
                    <div className="xl:col-span-1">
                        <MarketList data={bubbleData} />
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
                                    {bubbleData.filter(item => item.category === 'stablecoin').length} active
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-blue-700">Forex Pairs:</span>
                                <span className="font-medium text-blue-900">
                                    {bubbleData.filter(item => item.category === 'forex-pair').length} active
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-blue-700">Avg. Performance:</span>
                                <span className={`font-medium ${getColorClass(bubbleData.reduce((sum, item) => sum + item.priceChange24h, 0) / bubbleData.length)}`}>
                                    {(bubbleData.reduce((sum, item) => sum + item.priceChange24h, 0) / bubbleData.length).toFixed(2)}%
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-purple-900 mb-4">Market Insights</h3>
                        <div className="space-y-3">
                            <p className="text-purple-700 text-sm">
                                • {getMostVolatileCoin(bubbleData)} has the highest 24h volatility ({getHighestVolatility(bubbleData)}%)
                            </p>
                            <p className="text-purple-700 text-sm">
                                • Highest trading volume: {getHighestVolumeToken(bubbleData)} (${(getHighestVolume(bubbleData) / 1000000).toFixed(1)}M)
                            </p>
                            <p className="text-purple-700 text-sm">
                                • Data refreshed at: {new Date().toLocaleTimeString()}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}

// Helper functions for displaying insights
function getColorClass(value: number): string {
    return value > 0 ? 'text-green-600' : value < 0 ? 'text-red-600' : 'text-blue-900';
}

function getMostVolatileCoin(data: any[]): string {
    if (!data.length) return 'N/A';
    return data.reduce((prev, current) =>
        Math.abs(prev.priceChange24h) > Math.abs(current.priceChange24h) ? prev : current
    ).symbol;
}

function getHighestVolatility(data: any[]): number {
    if (!data.length) return 0;
    return Math.abs(data.reduce((prev, current) =>
        Math.abs(prev.priceChange24h) > Math.abs(current.priceChange24h) ? prev : current
    ).priceChange24h);
}

function getHighestVolumeToken(data: any[]): string {
    if (!data.length) return 'N/A';
    return data.reduce((prev, current) =>
        prev.volume24h > current.volume24h ? prev : current
    ).symbol;
}

function getHighestVolume(data: any[]): number {
    if (!data.length) return 0;
    return data.reduce((prev, current) =>
        prev.volume24h > current.volume24h ? prev : current
    ).volume24h;
}