'use client'

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { FIAT_CURRENCIES, STABLECOIN_SUFFIX } from '@/constants';
import { Coins, ArrowRight, TrendingUp, Shield, DollarSign } from 'lucide-react';
import { formatCurrency } from '@/utils';

export default function StablecoinsPage() {
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [amount, setAmount] = useState('');
  const [stablecoins, setStablecoins] = useState([
    { symbol: 'USDfx', baseCurrency: 'USD', totalSupply: 1000000, price: 1.00, holders: 245 },
    { symbol: 'EURfx', baseCurrency: 'EUR', totalSupply: 850000, price: 1.09, holders: 189 },
    { symbol: 'JPYfx', baseCurrency: 'JPY', totalSupply: 120000000, price: 0.0067, holders: 156 },
  ]);

  const handleCreateStablecoin = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newStablecoin = {
      symbol: `${selectedCurrency}${STABLECOIN_SUFFIX}`,
      baseCurrency: selectedCurrency,
      totalSupply: parseFloat(amount),
      price: 1.0, // Mock price
      holders: 1,
    };

    alert(`Creating ${newStablecoin.symbol} with ${formatCurrency(parseFloat(amount), selectedCurrency)}`);
    
    // Update list (mock)
    const existing = stablecoins.find(s => s.symbol === newStablecoin.symbol);
    if (existing) {
      existing.totalSupply += newStablecoin.totalSupply;
    } else {
      setStablecoins([...stablecoins, newStablecoin]);
    }
    
    setAmount('');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Forex Stablecoins</h1>
          <p className="text-gray-600 mt-2">Create blockchain-based stablecoins backed by fiat currencies</p>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Value Locked</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$2.97M</div>
              <p className="text-xs text-muted-foreground">Across all stablecoins</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Stablecoins</CardTitle>
              <Coins className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stablecoins.length}</div>
              <p className="text-xs text-muted-foreground">Forex-backed tokens</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Holders</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">590</div>
              <p className="text-xs text-muted-foreground">Unique addresses</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">24h Volume</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$486K</div>
              <p className="text-xs text-muted-foreground text-green-600">+12.5%</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Create Stablecoin Form */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Create Stablecoin</CardTitle>
              <CardDescription>
                Generate forex-backed stablecoins from your deposits
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateStablecoin} className="space-y-4">
                <div className="space-y-2">
                  <Label>Select Currency</Label>
                  <Select value={selectedCurrency} onValueChange={setSelectedCurrency}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(FIAT_CURRENCIES).map((currency) => (
                        <SelectItem key={currency.symbol} value={currency.symbol}>
                          <div className="flex items-center space-x-2">
                            <span>{currency.flag}</span>
                            <span>{currency.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Amount</Label>
                  <Input
                    type="number"
                    placeholder="Enter amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    min="100"
                    step="0.01"
                    required
                  />
                  <p className="text-xs text-gray-500">
                    Minimum: {formatCurrency(100, selectedCurrency)}
                  </p>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>You deposit:</span>
                    <span className="font-medium">
                      {amount ? formatCurrency(parseFloat(amount), selectedCurrency) : '0'}
                    </span>
                  </div>
                  <div className="flex items-center justify-center py-2">
                    <ArrowRight className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>You receive:</span>
                    <span className="font-medium text-blue-600">
                      {amount ? `${amount} ${selectedCurrency}${STABLECOIN_SUFFIX}` : '0'}
                    </span>
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={!amount || parseFloat(amount) < 100}>
                  Create {selectedCurrency}{STABLECOIN_SUFFIX}
                </Button>

                <p className="text-xs text-gray-500 text-center">
                  Stablecoins are 1:1 backed by deposited fiat currency
                </p>
              </form>
            </CardContent>
          </Card>

          {/* Active Stablecoins List */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Active Stablecoins</CardTitle>
              <CardDescription>
                Forex-backed stablecoins available on the platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stablecoins.map((coin) => {
                  const currency = FIAT_CURRENCIES[coin.baseCurrency as keyof typeof FIAT_CURRENCIES];
                  return (
                    <div key={coin.symbol} className="p-4 border rounded-lg hover:bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                            {currency?.flag}
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <h3 className="font-semibold text-lg">{coin.symbol}</h3>
                              <Badge variant="secondary">Stable</Badge>
                            </div>
                            <p className="text-sm text-gray-500">
                              Backed by {currency?.name}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">
                            {formatCurrency(coin.totalSupply, coin.baseCurrency)}
                          </p>
                          <p className="text-sm text-gray-500">
                            {coin.holders} holders
                          </p>
                        </div>
                      </div>
                      
                      <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500">Price</p>
                          <p className="font-medium">${coin.price.toFixed(4)}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Market Cap</p>
                          <p className="font-medium">
                            ${(coin.totalSupply * coin.price).toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500">24h Change</p>
                          <p className="font-medium text-green-600">+0.00%</p>
                        </div>
                      </div>

                      <div className="mt-4 flex space-x-2">
                        <Button size="sm" variant="outline" className="flex-1">
                          Mint More
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1">
                          Redeem
                        </Button>
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
