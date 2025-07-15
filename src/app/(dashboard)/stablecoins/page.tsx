'use client';

import { ProtectedRoute } from "@/components/features/auth/protected-route";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Table } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { LoadingState } from '@/components/ui/loading-state';
import { ErrorState } from '@/components/ui/error-state';
import { useState, useEffect } from 'react';

interface StablecoinData {
    id: string;
    name: string;
    symbol: string;
    current_price: number;
    market_cap: number;
    total_volume: number;
    price_change_percentage_24h: number;
    circulating_supply: number;
    max_supply: number;
    image: string;
    platforms?: Record<string, string>;
}

interface MarketStats {
    totalMarketCap: number;
    totalVolume: number;
    avgPriceChange: number;
    totalSupply: number;
}

// Custom hook for stablecoin data
const useStablecoinData = () => {
    const [stablecoins, setStablecoins] = useState<StablecoinData[]>([]);
    const [marketStats, setMarketStats] = useState<MarketStats>({
        totalMarketCap: 0,
        totalVolume: 0,
        avgPriceChange: 0,
        totalSupply: 0
    });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchStablecoinData = async () => {
        try {
            setIsLoading(true);
            setError(null);

            // Fetch major stablecoins from CoinGecko API
            const stablecoinIds = [
                'tether', 'usd-coin', 'binance-usd', 'dai', 'frax',
                'terraclassicusd', 'paxos-standard', 'gemini-dollar',
                'liquity-usd', 'magic-internet-money'
            ];

            const response = await fetch(
                `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${stablecoinIds.join(',')}&order=market_cap_desc&per_page=10&page=1&sparkline=false&price_change_percentage=24h`
            );

            if (!response.ok) {
                throw new Error('Failed to fetch stablecoin data');
            }

            const data: StablecoinData[] = await response.json();
            setStablecoins(data);

            // Calculate market stats
            const stats: MarketStats = {
                totalMarketCap: data.reduce((sum, coin) => sum + (coin.market_cap || 0), 0),
                totalVolume: data.reduce((sum, coin) => sum + (coin.total_volume || 0), 0),
                avgPriceChange: data.reduce((sum, coin) => sum + (coin.price_change_percentage_24h || 0), 0) / data.length,
                totalSupply: data.reduce((sum, coin) => sum + (coin.circulating_supply || 0), 0)
            };
            setMarketStats(stats);

        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchStablecoinData();

        // Auto-refresh every 5 minutes
        const interval = setInterval(fetchStablecoinData, 5 * 60 * 1000);
        return () => clearInterval(interval);
    }, []);

    return {
        stablecoins,
        marketStats,
        isLoading,
        error,
        refresh: fetchStablecoinData
    };
};

// Helper function to get blockchain networks from platforms
const getBlockchainNetworks = (platforms: Record<string, string> | undefined): string[] => {
    if (!platforms || typeof platforms !== 'object') {
        return ['N/A'];
    }

    const networkMap: Record<string, string> = {
        'ethereum': 'Ethereum',
        'tron': 'Tron',
        'binance-smart-chain': 'BSC',
        'solana': 'Solana',
        'polygon-pos': 'Polygon',
        'avalanche': 'Avalanche',
        'arbitrum-one': 'Arbitrum',
        'optimistic-ethereum': 'Optimism'
    };

    const networks = Object.keys(platforms)
        .map(platform => networkMap[platform] || platform)
        .filter(network => network && network !== '')
        .slice(0, 4); // Limit to 4 networks for display

    return networks.length > 0 ? networks : ['N/A'];
};

// Helper function to format large numbers
const formatLargeNumber = (num: number): string => {
    if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    if (num >= 1e3) return `$${(num / 1e3).toFixed(2)}K`;
    return `$${num.toFixed(2)}`;
};

// Helper function to get color class based on price change
const getChangeColor = (change: number): string => {
    if (change > 0) return 'text-green-600';
    if (change < 0) return 'text-red-600';
    return 'text-gray-600';
};

export default function StableCoinPage() {
    const { stablecoins, marketStats, isLoading, error, refresh } = useStablecoinData();

    // Handle loading state
    if (isLoading) {
        return (
            <ProtectedRoute>
                <DashboardLayout>
                    <LoadingState />
                </DashboardLayout>
            </ProtectedRoute>
        );
    }

    // Handle error state
    if (error) {
        return (
            <ProtectedRoute>
                <DashboardLayout>
                    <ErrorState message={error} onRetry={refresh} />
                </DashboardLayout>
            </ProtectedRoute>
        );
    }

    return (
        <ProtectedRoute>
            <DashboardLayout>
                <div className="space-y-8">
                    {/* Header */}
                    {/*<div className="flex justify-between items-center">*/}
                    {/*    <div>*/}
                    {/*        <h1 className="text-3xl font-bold text-gray-900">Stablecoins Market</h1>*/}
                    {/*        <p className="text-gray-600 mt-2">*/}
                    {/*            Track the performance and stability of major stablecoins*/}
                    {/*        </p>*/}
                    {/*    </div>*/}
                    {/*    <Button*/}
                    {/*        variant="outline"*/}
                    {/*        onClick={refresh}*/}
                    {/*        disabled={isLoading}*/}
                    {/*    >*/}
                    {/*        {isLoading ? 'Refreshing...' : 'Refresh Data'}*/}
                    {/*    </Button>*/}
                    {/*</div>*/}

                    {/* Market Overview Stats */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="ml-5">
                                    <h3 className="text-sm font-medium text-blue-700">Total Market Cap</h3>
                                    <p className="text-2xl font-bold text-blue-900">
                                        {formatLargeNumber(marketStats.totalMarketCap)}
                                    </p>
                                </div>
                            </div>
                        </Card>

                        <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="ml-5">
                                    <h3 className="text-sm font-medium text-green-700">24h Volume</h3>
                                    <p className="text-2xl font-bold text-green-900">
                                        {formatLargeNumber(marketStats.totalVolume)}
                                    </p>
                                </div>
                            </div>
                        </Card>

                        <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="ml-5">
                                    <h3 className="text-sm font-medium text-purple-700">Avg Price Change</h3>
                                    <p className={`text-2xl font-bold ${getChangeColor(marketStats.avgPriceChange)}`}>
                                        {marketStats.avgPriceChange >= 0 ? '+' : ''}
                                        {marketStats.avgPriceChange.toFixed(3)}%
                                    </p>
                                </div>
                            </div>
                        </Card>

                        <Card className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="ml-5">
                                    <h3 className="text-sm font-medium text-orange-700">Active Stablecoins</h3>
                                    <p className="text-2xl font-bold text-orange-900">
                                        {stablecoins.length}
                                    </p>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Stablecoins Table */}
                    <Card className="overflow-hidden">
                        <div className="flex items-center justify-between px-6 pb-4 border-b">
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900">Stablecoin Rankings</h2>
                                <p className="text-sm text-gray-600 mt-1">
                                    Real-time data from CoinGecko API • Last updated: {new Date().toLocaleString()}
                                </p>
                            </div>
                            <Button
                                variant="outline"
                                onClick={refresh}
                                disabled={isLoading}>
                                {isLoading ? 'Refreshing...' : 'Refresh Data'}
                            </Button>
                        </div>

                        <div className="overflow-x-auto">
                            <Table>
                                <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Rank & Name
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Price
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Market Cap
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        24h Volume
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        24h Change
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Circulating Supply
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Networks
                                    </th>
                                </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                {stablecoins.map((coin, index) => (
                                    <tr key={coin.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 w-8 h-8 mr-3">
                                                    <img
                                                        className="w-8 h-8 rounded-full"
                                                        src={coin.image}
                                                        alt={coin.name}
                                                        onError={(e) => {
                                                            e.currentTarget.src = '/api/placeholder/32/32';
                                                        }}
                                                    />
                                                </div>
                                                <div>
                                                    <div className="flex items-center">
                                                            <span className="text-sm font-medium text-gray-500 mr-2">
                                                                #{index + 1}
                                                            </span>
                                                        <span className="text-sm font-medium text-gray-900">
                                                                {coin.symbol.toUpperCase()}
                                                            </span>
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {coin.name}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">
                                                ${coin.current_price.toFixed(4)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">
                                                {coin.market_cap ? formatLargeNumber(coin.market_cap) : 'N/A'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">
                                                {coin.total_volume ? formatLargeNumber(coin.total_volume) : 'N/A'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className={`text-sm font-medium ${getChangeColor(coin.price_change_percentage_24h || 0)}`}>
                                                {coin.price_change_percentage_24h ? (
                                                    <>
                                                        {coin.price_change_percentage_24h >= 0 ? '+' : ''}
                                                        {coin.price_change_percentage_24h.toFixed(3)}%
                                                    </>
                                                ) : 'N/A'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">
                                                {coin.circulating_supply ? formatLargeNumber(coin.circulating_supply) : 'N/A'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex flex-wrap gap-1">
                                                {getBlockchainNetworks(coin.platforms).map((network, idx) => (
                                                    <Badge key={`${coin.id}-${network}-${idx}`} variant="secondary" className="text-xs">
                                                        {network}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </Table>
                        </div>
                    </Card>

                    {/* Market Insights */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
                            <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                                Market Dominance
                            </h3>
                            <div className="space-y-3">
                                {stablecoins.slice(0, 3).map((coin, index) => {
                                    const dominancePercentage = (coin.market_cap / marketStats.totalMarketCap) * 100;
                                    return (
                                        <div key={coin.id} className="flex items-center justify-between">
                                            <div className="flex items-center">
                                                <img
                                                    src={coin.image}
                                                    alt={coin.name}
                                                    className="w-6 h-6 rounded-full mr-2"
                                                />
                                                <span className="text-blue-700 font-medium">
                                                    {coin.symbol.toUpperCase()}
                                                </span>
                                            </div>
                                            <span className="font-semibold text-blue-900">
                                                {dominancePercentage.toFixed(1)}%
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </Card>

                        <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                            <h3 className="text-lg font-semibold text-green-900 mb-4 flex items-center">
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                                Key Insights
                            </h3>
                            <div className="space-y-3">
                                <div className="flex items-center text-green-700 text-sm">
                                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                                    <span>
                                        Most stable: {stablecoins.reduce((prev, current) =>
                                        Math.abs(prev.price_change_percentage_24h) < Math.abs(current.price_change_percentage_24h) ? prev : current
                                    ).symbol.toUpperCase()}
                                    </span>
                                </div>
                                <div className="flex items-center text-green-700 text-sm">
                                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                                    <span>
                                        Highest volume: {stablecoins.reduce((prev, current) =>
                                        prev.total_volume > current.total_volume ? prev : current
                                    ).symbol.toUpperCase()}
                                    </span>
                                </div>
                                <div className="flex items-center text-green-700 text-sm">
                                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                                    <span>
                                        Data refreshed: {new Date().toLocaleTimeString()}
                                    </span>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </DashboardLayout>
        </ProtectedRoute>
    );
}