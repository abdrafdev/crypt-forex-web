'use client';

import React, { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatNumber, formatPercentage, getBubbleSize, getPriceChangeColor } from '@/utils';
import { CryptoBubbleData } from '@/types';

interface CryptoBubblesProps {
    data: CryptoBubbleData[];
    width?: number;
    height?: number;
}

export function CryptoBubbles({ data, width = 800, height = 600 }: CryptoBubblesProps) {
    const bubbles = useMemo(() => {
        if (!data.length) return [];

        const maxMarketCap = Math.max(...data.map(item => item.marketCap));

        return data.map((item, index) => {
            const size = getBubbleSize(item.marketCap, maxMarketCap, 30, 120);
            const color = getPriceChangeColor(item.priceChange24h);

            // Simple positioning algorithm - in production you'd want a more sophisticated layout
            const angle = (index / data.length) * 2 * Math.PI;
            const radius = Math.min(width, height) * 0.3;
            const centerX = width / 2;
            const centerY = height / 2;

            const x = centerX + Math.cos(angle) * radius * Math.random() * 0.8;
            const y = centerY + Math.sin(angle) * radius * Math.random() * 0.8;

            return {
                ...item,
                x: Math.max(size / 2, Math.min(width - size / 2, x)),
                y: Math.max(size / 2, Math.min(height - size / 2, y)),
                size,
                color,
            };
        });
    }, [data, width, height]);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Crypto Market Bubbles</CardTitle>
                <CardDescription>
                    Visualize stablecoins and forex pairs by market cap and performance
                </CardDescription>
            </CardHeader>

            <CardContent>
                <div className="relative" style={{ width, height }}>
                    <svg width={width} height={height} className="border rounded-lg bg-gray-50">
                        {bubbles.map((bubble) => (
                            <g key={bubble.id}>
                                {/* Bubble circle */}
                                <circle
                                    cx={bubble.x}
                                    cy={bubble.y}
                                    r={bubble.size / 2}
                                    fill={bubble.color}
                                    opacity={0.7}
                                    stroke={bubble.color}
                                    strokeWidth={2}
                                    className="cursor-pointer hover:opacity-90 transition-opacity"
                                >
                                    <title>
                                        {bubble.name} ({bubble.symbol})
                                        {'\n'}Market Cap: ${formatNumber(bubble.marketCap, { notation: 'compact' })}
                                        {'\n'}24h Change: {formatPercentage(bubble.priceChange24h)}
                                        {'\n'}Volume: ${formatNumber(bubble.volume24h, { notation: 'compact' })}
                                    </title>
                                </circle>

                                {/* Symbol text */}
                                {bubble.size > 40 && (
                                    <text
                                        x={bubble.x}
                                        y={bubble.y - 5}
                                        textAnchor="middle"
                                        className="text-xs font-bold fill-white pointer-events-none"
                                    >
                                        {bubble.symbol}
                                    </text>
                                )}

                                {/* Price change text */}
                                {bubble.size > 60 && (
                                    <text
                                        x={bubble.x}
                                        y={bubble.y + 8}
                                        textAnchor="middle"
                                        className="text-xs fill-white pointer-events-none"
                                    >
                                        {formatPercentage(bubble.priceChange24h)}
                                    </text>
                                )}
                            </g>
                        ))}
                    </svg>

                    {/* Legend */}
                    <div className="absolute top-4 right-4 bg-white rounded-lg shadow-md p-3 space-y-2">
                        <h4 className="text-sm font-semibold text-gray-900">Legend</h4>
                        <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                <span className="text-xs text-gray-600">Positive change</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                <span className="text-xs text-gray-600">Negative change</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <div className="w-3 h-3 rounded-full bg-gray-500"></div>
                                <span className="text-xs text-gray-600">No change</span>
                            </div>
                        </div>
                        <div className="border-t pt-2">
                            <p className="text-xs text-gray-500">
                                Size = Market Cap
                            </p>
                        </div>
                    </div>
                </div>

                {/* Market Summary */}
                <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                        <p className="text-2xl font-bold text-gray-900">{data.length}</p>
                        <p className="text-sm text-gray-600">Total Assets</p>
                    </div>
                    <div className="text-center">
                        <p className="text-2xl font-bold text-green-600">
                            {data.filter(item => item.priceChange24h > 0).length}
                        </p>
                        <p className="text-sm text-gray-600">Gainers</p>
                    </div>
                    <div className="text-center">
                        <p className="text-2xl font-bold text-red-600">
                            {data.filter(item => item.priceChange24h < 0).length}
                        </p>
                        <p className="text-sm text-gray-600">Losers</p>
                    </div>
                    <div className="text-center">
                        <p className="text-2xl font-bold text-blue-600">
                            ${formatNumber(data.reduce((sum, item) => sum + item.volume24h, 0), { notation: 'compact' })}
                        </p>
                        <p className="text-sm text-gray-600">24h Volume</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

interface MarketListProps {
    data: CryptoBubbleData[];
}

export function MarketList({ data }: MarketListProps) {
    const sortedData = useMemo(() => {
        return [...data].sort((a, b) => b.marketCap - a.marketCap);
    }, [data]);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Market Data</CardTitle>
                <CardDescription>
                    Complete list of stablecoins and forex pairs
                </CardDescription>
            </CardHeader>

            <CardContent>
                <div className="space-y-3">
                    {sortedData.map((item) => (
                        <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                            <div className="flex items-center space-x-3">
                                <div
                                    className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold"
                                    style={{ backgroundColor: item.color }}
                                >
                                    {item.symbol.slice(0, 2).toUpperCase()}
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">{item.name}</p>
                                    <p className="text-sm text-gray-500">{item.symbol}</p>
                                </div>
                                <Badge variant="outline" className="ml-2">
                                    {item.category}
                                </Badge>
                            </div>

                            <div className="text-right">
                                <p className="font-medium text-gray-900">
                                    ${formatNumber(item.marketCap, { notation: 'compact' })}
                                </p>
                                <p className={`text-sm ${getPriceChangeColor(item.priceChange24h) === '#10b981' ? 'text-green-600' : 'text-red-600'}`}>
                                    {formatPercentage(item.priceChange24h)}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
