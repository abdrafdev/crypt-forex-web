'use client'

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FIAT_CURRENCIES, STABLECOIN_SUFFIX } from '@/constants';
import { ArrowRight } from 'lucide-react';
import { formatCurrency } from '@/utils';

interface StablecoinFormProps {
  onSubmit: (data: any) => void;
  loading?: boolean;
}

export function StablecoinForm({ onSubmit, loading = false }: StablecoinFormProps) {
  const [selectedCurrency, setSelectedCurrency] = React.useState('USD');
  const [amount, setAmount] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      currency: selectedCurrency,
      amount: parseFloat(amount),
      stablecoin: `${selectedCurrency}${STABLECOIN_SUFFIX}`
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Stablecoin</CardTitle>
        <CardDescription>
          Generate forex-backed stablecoins from your deposits
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
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

          <Button 
            type="submit" 
            className="w-full" 
            disabled={loading || !amount || parseFloat(amount) < 100}
          >
            {loading ? 'Processing...' : `Create ${selectedCurrency}${STABLECOIN_SUFFIX}`}
          </Button>

          <p className="text-xs text-gray-500 text-center">
            Stablecoins are 1:1 backed by deposited fiat currency
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
