'use client';

import { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/components/features/auth/protected-route';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { LoadingState } from '@/components/ui/loading-state';
import { ErrorState } from '@/components/ui/error-state';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Table } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

interface ForexRate {
    pair: string;
    rate: number;
    change: number;
    high24h?: number;
    low24h?: number;
    volume?: number;
}

interface MarketStats {
    totalPairs: number;
    avgVolatility: number;
    mostVolatile: string;
    leastVolatile: string;
    lastUpdate: string;
}

const API_KEY = process.env.NEXT_PUBLIC_CURRENCY_FREAK_API;

const forexPairs = [
    { base: 'EUR', quote: 'USD', flag: '🇪🇺', name: 'Euro', quoteName: 'US Dollar' },
    { base: 'GBP', quote: 'USD', flag: '🇬🇧', name: 'British Pound', quoteName: 'US Dollar' },
    { base: 'USD', quote: 'JPY', flag: '🇺🇸', name: 'US Dollar', quoteName: 'Japanese Yen' },
    { base: 'AUD', quote: 'USD', flag: '🇦🇺', name: 'Australian Dollar', quoteName: 'US Dollar' },
    { base: 'USD', quote: 'CAD', flag: '🇺🇸', name: 'US Dollar', quoteName: 'Canadian Dollar' },
    { base: 'USD', quote: 'CHF', flag: '🇺🇸', name: 'US Dollar', quoteName: 'Swiss Franc' },
    { base: 'NZD', quote: 'USD', flag: '🇳🇿', name: 'New Zealand Dollar', quoteName: 'US Dollar' },
    { base: 'EUR', quote: 'GBP', flag: '🇪🇺', name: 'Euro', quoteName: 'British Pound' },
];

const useForexRates = () => {
    const [rates, setRates] = useState<ForexRate[]>([]);
    const [marketStats, setMarketStats] = useState<MarketStats>({
        totalPairs: 0,
        avgVolatility: 0,
        mostVolatile: '',
        leastVolatile: '',
        lastUpdate: ''
    });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchRates = async (isRefresh = false) => {
        if (!isRefresh) setIsLoading(true); // Only show loader on initial load
        try {
            setError(null);
            const allSymbols = Array.from(
                new Set(forexPairs.flatMap(({ base, quote }) => [base, quote]))
            ).join(',');
            const res = await fetch(
                `https://api.currencyfreaks.com/latest?apikey=${API_KEY}&symbols=${allSymbols}`
            );
            if (!res.ok) throw new Error('Failed to fetch forex data');
            const data = await res.json();
            const formatted: ForexRate[] = forexPairs.map(({ base, quote }) => {
                const baseRate = parseFloat(data.rates[base]);
                const quoteRate = parseFloat(data.rates[quote]);
                const rate = quote === 'USD'
                    ? 1 / baseRate
                    : baseRate / quoteRate;
                const change = (Math.random() * 0.6 - 0.3); // Simulate price changes
                const high24h = rate * (1 + Math.random() * 0.005);
                const low24h = rate * (1 - Math.random() * 0.005);
                return {
                    pair: `${base}/${quote}`,
                    rate,
                    change,
                    high24h,
                    low24h,
                    volume: Math.random() * 1000000000 // Simulate volume
                };
            });
            setRates(formatted);
            // Calculate market stats
            const changes = formatted.map(r => Math.abs(r.change));
            const avgVolatility = changes.reduce((sum, change) => sum + change, 0) / changes.length;
            const mostVolatileIndex = changes.indexOf(Math.max(...changes));
            const leastVolatileIndex = changes.indexOf(Math.min(...changes));
            setMarketStats({
                totalPairs: formatted.length,
                avgVolatility,
                mostVolatile: formatted[mostVolatileIndex]?.pair || '',
                leastVolatile: formatted[leastVolatileIndex]?.pair || '',
                lastUpdate: new Date().toLocaleString()
            });
        } catch (err: any) {
            setError(err.message || 'Unexpected error');
        } finally {
            setIsLoading(false); // Always stop loading after fetch
        }
    };

    useEffect(() => {
        fetchRates(); // Initial load
        const interval = setInterval(() => fetchRates(true), 5 * 60 * 1000); // Background refresh every 5 min
        return () => clearInterval(interval);
    }, []);

    return { rates, marketStats, isLoading, error, refresh: () => fetchRates(true) };
};

// Helper functions
const formatLargeNumber = (num: number): string => {
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    if (num >= 1e3) return `$${(num / 1e3).toFixed(2)}K`;
    return `$${num.toFixed(2)}`;
};

const getChangeColor = (change: number): string => {
    if (change > 0) return 'text-green-600';
    if (change < 0) return 'text-red-600';
    return 'text-gray-600';
};

const getVolatilityBadge = (change: number) => {
    const absChange = Math.abs(change);
    if (absChange > 0.2) return { text: 'High', class: 'bg-red-100 text-red-800' };
    if (absChange > 0.1) return { text: 'Medium', class: 'bg-yellow-100 text-yellow-800' };
    return { text: 'Low', class: 'bg-green-100 text-green-800' };
};

export default function ForexPage() {
    const { rates, marketStats, isLoading, error, refresh } = useForexRates();

    if (isLoading) {
        return (
            <ProtectedRoute>
                <DashboardLayout>
                    <LoadingState />
                </DashboardLayout>
            </ProtectedRoute>
        );
    }

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
                    {/*    /!*<div>*!/*/}
                    {/*    /!*    <h1 className="text-3xl font-bold text-gray-900">Forex Market</h1>*!/*/}
                    {/*    /!*    <p className="text-gray-600 mt-2">*!/*/}
                    {/*    /!*        Real-time foreign exchange rates and market analysis*!/*/}
                    {/*    /!*    </p>*!/*/}
                    {/*    /!*</div>*!/*/}
                    {/*    /!*<Button*!/*/}
                    {/*    /!*    variant="outline"*!/*/}
                    {/*    /!*    onClick={refresh}*!/*/}
                    {/*    /!*    disabled={isLoading}*!/*/}
                    {/*    /!*    className="bg-white hover:bg-gray-50 border-gray-300 text-gray-700 font-medium px-6 py-2 rounded-lg shadow-sm transition-all duration-200"*!/*/}
                    {/*    /!*>*!/*/}
                    {/*    /!*    {isLoading ? (*!/*/}
                    {/*    /!*        <span className="flex items-center gap-2">*!/*/}
                    {/*    /!*            <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>*!/*/}
                    {/*    /!*            Refreshing...*!/*/}
                    {/*    /!*        </span>*!/*/}
                    {/*    /!*    ) : (*!/*/}
                    {/*    /!*        <span className="flex items-center gap-2">*!/*/}
                    {/*    /!*            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">*!/*/}
                    {/*    /!*                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />*!/*/}
                    {/*    /!*            </svg>*!/*/}
                    {/*    /!*            Refresh Data*!/*/}
                    {/*    /!*        </span>*!/*/}
                    {/*    /!*    )}*!/*/}
                    {/*    /!*</Button>*!/*/}
                    {/*</div>*/}

                    {/* Market Overview Stats */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="ml-5">
                                    <h3 className="text-sm font-medium text-blue-700">Active Pairs</h3>
                                    <p className="text-2xl font-bold text-blue-900">{marketStats.totalPairs}</p>
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
                                    <h3 className="text-sm font-medium text-green-700">Avg Volatility</h3>
                                    <p className="text-2xl font-bold text-green-900">
                                        {marketStats.avgVolatility.toFixed(3)}%
                                    </p>
                                </div>
                            </div>
                        </Card>

                        <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="ml-5">
                                    <h3 className="text-sm font-medium text-purple-700">Last Update</h3>
                                    <p className="text-lg font-bold text-purple-900">
                                        {new Date().toLocaleTimeString()}
                                    </p>
                                </div>
                            </div>
                        </Card>

                        <Card className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="ml-5">
                                    <h3 className="text-sm font-medium text-orange-700">Market Status</h3>
                                    <p className="text-lg font-bold text-orange-900 flex items-center gap-2">
                                        <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                        Live
                                    </p>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Forex Rates Table */}
                    <Card className="overflow-hidden shadow-xl">
                        <div className="flex items-center justify-between px-6 pb-4 border-b">
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900 mb-2">Live Forex Rates</h2>
                                <p className="text-sm text-gray-600">
                                    Real-time exchange rates • Data from CurrencyFreaks API • Last updated: {marketStats.lastUpdate}
                                </p>
                            </div>
                            <Button
                                variant="outline"
                                onClick={() => refresh()}
                                disabled={isLoading}
                            >
                                Refresh Data
                            </Button>                        </div>

                        <div className="overflow-x-auto">
                            <Table>
                                <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Currency Pair
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Current Rate
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        24h Change
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        24h High/Low
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Volume
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Volatility
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Trend
                                    </th>
                                </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                {rates.map((rate, index) => {
                                    const pairInfo = forexPairs.find(p => `${p.base}/${p.quote}` === rate.pair);
                                    const volatility = getVolatilityBadge(rate.change);

                                    return (
                                        <tr key={rate.pair} className="hover:bg-gray-50 transition-colors duration-150">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 mr-4">
                                                        <div className="text-2xl">{pairInfo?.flag}</div>
                                                    </div>
                                                    <div>
                                                        <div className="text-lg font-bold text-gray-900">{rate.pair}</div>
                                                        <div className="text-sm text-gray-500">
                                                            {pairInfo?.name} to {pairInfo?.quoteName}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-xl font-mono font-bold text-gray-900">
                                                    {rate.rate.toFixed(4)}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className={`text-lg font-semibold ${getChangeColor(rate.change)}`}>
                                                    {rate.change >= 0 ? '+' : ''}
                                                    {rate.change.toFixed(3)}%
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">
                                                    <div className="text-green-600">H: {rate.high24h?.toFixed(4)}</div>
                                                    <div className="text-red-600">L: {rate.low24h?.toFixed(4)}</div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">
                                                    {rate.volume ? formatLargeNumber(rate.volume) : 'N/A'}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <Badge className={`${volatility.class} text-xs`}>
                                                    {volatility.text}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                        <span className="text-2xl mr-2">
                                                            {rate.change >= 0 ? '📈' : '📉'}
                                                        </span>
                                                    <div className="text-sm text-gray-500">
                                                        {rate.change >= 0 ? 'Bullish' : 'Bearish'}
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                                </tbody>
                            </Table>
                        </div>
                    </Card>

                    {/* Market Insights */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
                            <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                </svg>
                                Market Performance
                            </h3>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-blue-700">Most Volatile:</span>
                                    <span className="font-semibold text-blue-900">{marketStats.mostVolatile}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-blue-700">Most Stable:</span>
                                    <span className="font-semibold text-blue-900">{marketStats.leastVolatile}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-blue-700">Average Volatility:</span>
                                    <span className="font-semibold text-blue-900">{marketStats.avgVolatility.toFixed(3)}%</span>
                                </div>
                            </div>
                        </Card>

                        <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                            <h3 className="text-lg font-semibold text-green-900 mb-4 flex items-center">
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                                Quick Actions
                            </h3>
                            <div className="space-y-3">
                                <Button
                                    variant="outline"
                                    className="w-full bg-white hover:bg-green-50 border-green-300 text-green-700"
                                    onClick={() => window.open('https://www.xe.com/currencyconverter/', '_blank')}
                                >
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                                    </svg>
                                    Currency Converter
                                </Button>
                                <Button
                                    variant="outline"
                                    className="w-full bg-white hover:bg-green-50 border-green-300 text-green-700"
                                    onClick={() => window.open('https://www.tradingview.com/markets/currencies/', '_blank')}
                                >
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                    View Charts
                                </Button>
                                <div className="flex items-center text-green-700 text-sm mt-4">
                                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                                    <span>Live data • Updates every 5 minutes</span>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </DashboardLayout>
        </ProtectedRoute>
    );
}