'use client'

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FIAT_CURRENCIES, STABLECOIN_SUFFIX } from '@/constants';
import { Plus } from 'lucide-react';

interface ForexPairFormProps {
  onSubmit: (data: any) => void;
  loading?: boolean;
}

export function ForexPairForm({ onSubmit, loading = false }: ForexPairFormProps) {
  const [baseCurrency, setBaseCurrency] = React.useState('JPY');
  const [quoteCurrency, setQuoteCurrency] = React.useState('GBP');
  const [amount, setAmount] = React.useState('');
  const [allocation, setAllocation] = React.useState('50');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      baseCurrency,
      quoteCurrency,
      amount: parseFloat(amount),
      allocation: parseFloat(allocation),
      pairSymbol: `${baseCurrency}${quoteCurrency}${STABLECOIN_SUFFIX}`
    });
  };

  return (
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
        <form onSubmit={handleSubmit} className="space-y-4">
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
            )}
          </div>

          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            disabled={loading || !amount || parseFloat(amount) < 1000}
          >
            {loading ? 'Creating...' : 'Create Forex Pair'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
