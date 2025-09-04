'use client'

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CryptoBubbles } from '@/components/features/crypto-bubbles/crypto-bubbles';
import { TrendingUp, TrendingDown, Activity, DollarSign, BarChart3, PieChart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function AnalyticsPage() {
  const [timeframe, setTimeframe] = useState('24h');
  const [marketStats, setMarketStats] = useState({
    totalMarketCap: 7.85e6,
    totalVolume24h: 1.23e6,
    dominance: { USDfx: 35, EURfx: 28, JPYfx: 15, Others: 22 },
    activeTraders: 1245,
    totalTransactions: 8932
  });

  // Mock market data for bubbles
  const bubbleData = [
    {
      id: '1',
      symbol: 'USDfx',
      name: 'USD Stablecoin',
      marketCap: 2747500,
      priceChange24h: 0.05,
      volume24h: 450000,
      category: 'stablecoin' as const,
      color: '#3b82f6',
      size: 80
    },
    {
      id: '2',
      symbol: 'EURfx',
      name: 'EUR Stablecoin',
      marketCap: 2196000,
      priceChange24h: -0.12,
      volume24h: 380000,
      category: 'stablecoin' as const,
      color: '#3b82f6',
      size: 70
    },
    {
      id: '3',
      symbol: 'JPYGBPfx',
      name: 'JPY/GBP Forex Pair',
      marketCap: 1500000,
      priceChange24h: 2.35,
      volume24h: 125000,
      category: 'forex-pair' as const,
      color: '#8b5cf6',
      size: 60
    },
    {
      id: '4',
      symbol: 'USDEURfx',
      name: 'USD/EUR Forex Pair',
      marketCap: 2100000,
      priceChange24h: -0.45,
      volume24h: 450000,
      category: 'forex-pair' as const,
      color: '#8b5cf6',
      size: 65
    },
    {
      id: '5',
      symbol: 'JPYfx',
      name: 'JPY Stablecoin',
      marketCap: 1180000,
      priceChange24h: 0.67,
      volume24h: 89000,
      category: 'stablecoin' as const,
      color: '#3b82f6',
      size: 50
    }
  ];

  const topGainers = [
    { symbol: 'JPYGBPfx', change: 2.35, price: 0.0055, volume: 125000 },
    { symbol: 'CHFUSDfx', change: 1.82, price: 1.12, volume: 67000 },
    { symbol: 'AUDNZDfx', change: 1.45, price: 1.08, volume: 45000 }
  ];

  const topLosers = [
    { symbol: 'EURGBPfx', change: -1.23, price: 0.86, volume: 230000 },
    { symbol: 'USDCADfx', change: -0.89, price: 1.35, volume: 180000 },
    { symbol: 'USDEURfx', change: -0.45, price: 0.92, volume: 450000 }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Market Analytics</h1>
          <p className="text-gray-600 mt-2">Real-time market data and visualizations</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Market Cap</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$7.85M</div>
              <p className="text-xs text-muted-foreground text-green-600">+5.2%</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">24h Volume</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$1.23M</div>
              <p className="text-xs text-muted-foreground text-green-600">+12.8%</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Traders</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,245</div>
              <p className="text-xs text-muted-foreground">24h active</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Transactions</CardTitle>
              <PieChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8,932</div>
              <p className="text-xs text-muted-foreground">Today</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Dominance</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">USDfx</div>
              <p className="text-xs text-muted-foreground">35% market</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="bubbles" className="space-y-6">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-3">
            <TabsTrigger value="bubbles">Bubbles</TabsTrigger>
            <TabsTrigger value="gainers">Top Movers</TabsTrigger>
            <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
          </TabsList>

          <TabsContent value="bubbles" className="space-y-6">
            {/* Crypto Bubbles Visualization */}
            <Card>
              <CardHeader>
                <CardTitle>Market Visualization</CardTitle>
                <CardDescription>
                  Interactive bubble chart showing market cap and performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[500px] bg-gray-900 rounded-lg p-4">
                  <CryptoBubbles data={bubbleData} />
                </div>
                <div className="mt-4 flex items-center justify-center space-x-6 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span>Stablecoins</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                    <span>Forex Pairs</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span>Positive</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span>Negative</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="gainers" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Top Gainers */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    <span>Top Gainers</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {topGainers.map((item, index) => (
                      <div key={item.symbol} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <span className="text-lg font-bold text-gray-400">#{index + 1}</span>
                          <div>
                            <p className="font-semibold">{item.symbol}</p>
                            <p className="text-sm text-gray-500">${item.price.toFixed(4)}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge className="bg-green-100 text-green-800">
                            +{item.change.toFixed(2)}%
                          </Badge>
                          <p className="text-xs text-gray-500 mt-1">
                            Vol: ${(item.volume / 1000).toFixed(0)}K
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Top Losers */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingDown className="h-5 w-5 text-red-600" />
                    <span>Top Losers</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {topLosers.map((item, index) => (
                      <div key={item.symbol} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <span className="text-lg font-bold text-gray-400">#{index + 1}</span>
                          <div>
                            <p className="font-semibold">{item.symbol}</p>
                            <p className="text-sm text-gray-500">${item.price.toFixed(4)}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge className="bg-red-100 text-red-800">
                            {item.change.toFixed(2)}%
                          </Badge>
                          <p className="text-xs text-gray-500 mt-1">
                            Vol: ${(item.volume / 1000).toFixed(0)}K
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="portfolio" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Portfolio Analytics</CardTitle>
                <CardDescription>
                  Track your portfolio performance and allocation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <p className="text-gray-500">Connect your wallet to view portfolio analytics</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
