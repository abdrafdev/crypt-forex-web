'use client'

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { FIAT_CURRENCIES, STABLECOIN_SUFFIX } from '@/constants';
import { GitBranch, Plus, TrendingUp, TrendingDown, Activity, DollarSign } from 'lucide-react';
import { formatCurrency } from '@/utils';

export default function ForexPairsPage() {
  const [baseCurrency, setBaseCurrency] = useState('JPY');
  const [quoteCurrency, setQuoteCurrency] = useState('GBP');
  const [amount, setAmount] = useState('');
  const [allocation, setAllocation] = useState('50');
  
  const [forexPairs, setForexPairs] = useState([
    { 
      symbol: 'JPYGBPfx',
      baseCurrency: 'JPY',
      quoteCurrency: 'GBP',
      totalValue: 1500000,
      holders: 89,
      price: 0.0055,
      change24h: 2.35,
      volume24h: 125000
    },
    {
      symbol: 'USDEURfx',
      baseCurrency: 'USD',
      quoteCurrency: 'EUR',
      totalValue: 2100000,
      holders: 156,
      price: 0.92,
      change24h: -0.45,
      volume24h: 450000
    },
    {
      symbol: 'EURCHFfx',
      baseCurrency: 'EUR',
      quoteCurrency: 'CHF',
      totalValue: 890000,
      holders: 67,
      price: 0.98,
      change24h: 0.15,
      volume24h: 78000
    }
  ]);

  const handleCreatePair = (e: React.FormEvent) => {
    e.preventDefault();
    
    const pairSymbol = `${baseCurrency}${quoteCurrency}${STABLECOIN_SUFFIX}`;
    const depositAmount = parseFloat(amount);
    const baseAllocation = parseFloat(allocation) / 100;
    const quoteAllocation = 1 - baseAllocation;

    alert(`Creating ${pairSymbol} with ${formatCurrency(depositAmount * baseAllocation, baseCurrency)} and ${formatCurrency(depositAmount * quoteAllocation, quoteCurrency)}`);
    
    // Add to list (mock)
    const newPair = {
      symbol: pairSymbol,
      baseCurrency,
      quoteCurrency,
      totalValue: depositAmount,
      holders: 1,
      price: 1.0,
      change24h: 0,
      volume24h: 0
    };
    
    setForexPairs([...forexPairs, newPair]);
    setAmount('');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Crypto Forex Pairs</h1>
          <p className="text-gray-600 mt-2">Create unique forex trading pairs combining stablecoins</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Pairs</CardTitle>
              <GitBranch className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{forexPairs.length}</div>
              <p className="text-xs text-muted-foreground">Trading pairs</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Liquidity</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$4.49M</div>
              <p className="text-xs text-muted-foreground">Locked value</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">24h Volume</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$653K</div>
              <p className="text-xs text-muted-foreground text-green-600">+18.2%</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Unique Traders</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">312</div>
              <p className="text-xs text-muted-foreground">Active users</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Create Pair Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Plus className="h-5 w-5" />
                <span>Create Forex Pair</span>
              </CardTitle>
              <CardDescription>
                Combine two stablecoins to create a tradeable forex pair
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreatePair} className="space-y-4">
                {/* Currency Selection */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Base Currency</Label>
                    <Select value={baseCurrency} onValueChange={setBaseCurrency}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(FIAT_CURRENCIES).map((currency) => (
                          <SelectItem key={currency.symbol} value={currency.symbol}>
                            <div className="flex items-center space-x-2">
                              <span>{currency.flag}</span>
                              <span>{currency.symbol}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Quote Currency</Label>
                    <Select value={quoteCurrency} onValueChange={setQuoteCurrency}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(FIAT_CURRENCIES)
                          .filter(c => c.symbol !== baseCurrency)
                          .map((currency) => (
                            <SelectItem key={currency.symbol} value={currency.symbol}>
                              <div className="flex items-center space-x-2">
                                <span>{currency.flag}</span>
                                <span>{currency.symbol}</span>
                              </div>
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Amount Input */}
                <div className="space-y-2">
                  <Label>Initial Investment (USD)</Label>
                  <Input
                    type="number"
                    placeholder="Enter amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    min="1000"
                    step="100"
                    required
                  />
                  <p className="text-xs text-gray-500">Minimum: $1,000</p>
                </div>

                {/* Allocation Slider */}
                <div className="space-y-2">
                  <Label>Allocation Ratio</Label>
                  <div className="space-y-3">
                    <Input
                      type="range"
                      min="10"
                      max="90"
                      value={allocation}
                      onChange={(e) => setAllocation(e.target.value)}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm">
                      <span className="text-blue-600 font-medium">
                        {baseCurrency}: {allocation}%
                      </span>
                      <span className="text-purple-600 font-medium">
                        {quoteCurrency}: {100 - parseInt(allocation)}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Preview */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg space-y-2">
                  <p className="text-sm font-medium">You will create:</p>
                  <p className="text-lg font-bold text-center py-2">
                    {baseCurrency}{quoteCurrency}{STABLECOIN_SUFFIX}
                  </p>
                  {amount && (
                    <>
                      <div className="text-xs space-y-1">
                        <div className="flex justify-between">
                          <span>{baseCurrency}fx allocation:</span>
                          <span>${(parseFloat(amount) * parseFloat(allocation) / 100).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>{quoteCurrency}fx allocation:</span>
                          <span>${(parseFloat(amount) * (100 - parseFloat(allocation)) / 100).toFixed(2)}</span>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  disabled={!amount || parseFloat(amount) < 1000}
                >
                  Create Forex Pair
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Active Pairs List */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Active Forex Pairs</CardTitle>
              <CardDescription>
                Trade unique cryptocurrency forex pairs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {forexPairs.map((pair) => {
                  const base = FIAT_CURRENCIES[pair.baseCurrency as keyof typeof FIAT_CURRENCIES];
                  const quote = FIAT_CURRENCIES[pair.quoteCurrency as keyof typeof FIAT_CURRENCIES];
                  const isPositive = pair.change24h > 0;

                  return (
                    <div key={pair.symbol} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-4">
                          <div className="flex -space-x-2">
                            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white text-lg border-2 border-white">
                              {base?.flag}
                            </div>
                            <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center text-white text-lg border-2 border-white">
                              {quote?.flag}
                            </div>
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">{pair.symbol}</h3>
                            <p className="text-sm text-gray-500">
                              {base?.name} / {quote?.name}
                            </p>
                          </div>
                        </div>
                        <Badge variant={isPositive ? "default" : "secondary"}>
                          {isPositive ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                          {isPositive ? '+' : ''}{pair.change24h.toFixed(2)}%
                        </Badge>
                      </div>

                      <div className="grid grid-cols-4 gap-4 text-sm mb-4">
                        <div>
                          <p className="text-gray-500">Price</p>
                          <p className="font-medium">{pair.price.toFixed(4)}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">24h Volume</p>
                          <p className="font-medium">${pair.volume24h.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Liquidity</p>
                          <p className="font-medium">${pair.totalValue.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Holders</p>
                          <p className="font-medium">{pair.holders}</p>
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <Button size="sm" className="flex-1">Trade</Button>
                        <Button size="sm" variant="outline" className="flex-1">Add Liquidity</Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
