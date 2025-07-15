'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { FIAT_CURRENCIES, CRYPTO_CURRENCIES, PLATFORM_SETTINGS } from '@/constants';
import { formatCurrency } from '@/utils';
import { Wallet, CreditCard, Bitcoin } from 'lucide-react';

interface DepositFormProps {
    onSubmit: (data: any) => void;
    loading?: boolean;
}

export function DepositForm({ onSubmit, loading = false }: DepositFormProps) {
    const [depositType, setDepositType] = useState<'fiat' | 'crypto'>('fiat');
    const [currency, setCurrency] = useState('USD');
    const [amount, setAmount] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('');

    const availableCurrencies = depositType === 'fiat'
        ? Object.values(FIAT_CURRENCIES)
        : Object.values(CRYPTO_CURRENCIES);

    const minAmount = PLATFORM_SETTINGS.MIN_DEPOSIT_AMOUNT[currency as keyof typeof PLATFORM_SETTINGS.MIN_DEPOSIT_AMOUNT] || 100;
    const maxAmount = PLATFORM_SETTINGS.MAX_DEPOSIT_AMOUNT[currency as keyof typeof PLATFORM_SETTINGS.MAX_DEPOSIT_AMOUNT] || 1000000;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({
            type: depositType,
            currency,
            amount: parseFloat(amount),
            paymentMethod: depositType === 'fiat' ? paymentMethod : undefined,
        });
    };

    return (
        <Card className="max-w-full mx-auto">
            <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                    <Wallet className="w-5 h-5" />
                    <span>Deposit Funds</span>
                </CardTitle>
                <CardDescription>
                    Add fiat currency or cryptocurrency to your wallet
                </CardDescription>
            </CardHeader>

            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Deposit Type */}
                    <div className="space-y-2">
                        <Label>Deposit Type</Label>
                        <div className="flex space-x-2">
                            <Button
                                type="button"
                                variant={depositType === 'fiat' ? 'default' : 'outline'}
                                onClick={() => {
                                    setDepositType('fiat');
                                    setCurrency('USD');
                                    setPaymentMethod('');
                                }}
                                className="flex-1"
                            >
                                <CreditCard className="w-4 h-4 mr-2" />
                                Fiat
                            </Button>
                            <Button
                                type="button"
                                variant={depositType === 'crypto' ? 'default' : 'outline'}
                                onClick={() => {
                                    setDepositType('crypto');
                                    setCurrency('USDC');
                                    setPaymentMethod('');
                                }}
                                className="flex-1"
                            >
                                <Bitcoin className="w-4 h-4 mr-2" />
                                Crypto
                            </Button>
                        </div>
                    </div>

                    {/* Currency Selection */}
                    <div className="space-y-2">
                        <Label htmlFor="currency">Currency</Label>
                        <Select value={currency} onValueChange={setCurrency}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select currency" />
                            </SelectTrigger>
                            <SelectContent>
                                {availableCurrencies.map((curr) => (
                                    <SelectItem key={curr.symbol} value={curr.symbol}>
                                        <div className="flex items-center space-x-2">
                                            {'flag' in curr && <span>{curr.flag}</span>}
                                            <span>{curr.name} ({curr.symbol})</span>
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Payment Method (for fiat only) */}
                    {depositType === 'fiat' && (
                        <div className="space-y-2">
                            <Label htmlFor="paymentMethod">Payment Method</Label>
                            <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select payment method" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                                    <SelectItem value="credit_card">Credit Card</SelectItem>
                                    <SelectItem value="debit_card">Debit Card</SelectItem>
                                    <SelectItem value="wire_transfer">Wire Transfer</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    )}

                    {/* Amount */}
                    <div className="space-y-2">
                        <Label htmlFor="amount">Amount</Label>
                        <Input
                            id="amount"
                            type="number"
                            placeholder="0.00"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            min={minAmount}
                            max={maxAmount}
                            step="0.01"
                            required
                        />
                        <div className="flex justify-between text-sm text-gray-500">
                            <span>Min: {formatCurrency(minAmount, currency)}</span>
                            <span>Max: {formatCurrency(maxAmount, currency)}</span>
                        </div>
                    </div>

                    {/* Fee Information */}
                    <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                        <div className="flex justify-between text-sm">
                            <span>Deposit Amount:</span>
                            <span>{amount ? formatCurrency(parseFloat(amount), currency) : formatCurrency(0, currency)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span>Processing Fee:</span>
                            <span>Free</span>
                        </div>
                        <div className="border-t pt-2 flex justify-between font-medium">
                            <span>Total:</span>
                            <span>{amount ? formatCurrency(parseFloat(amount), currency) : formatCurrency(0, currency)}</span>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        className="w-full"
                        disabled={loading || !amount || parseFloat(amount) < minAmount}
                    >
                        {loading ? 'Processing...' : `Deposit ${currency}`}
                    </Button>

                    {/* Disclaimer */}
                    <p className="text-xs text-gray-500 text-center">
                        {depositType === 'fiat'
                            ? 'Bank transfers may take 1-3 business days to process'
                            : 'Crypto deposits require network confirmations'
                        }
                    </p>
                </form>
            </CardContent>
        </Card>
    );
}

interface DepositHistoryProps {
    deposits: any[];
    loading?: boolean;
}

export function DepositHistory({ deposits, loading = false }: DepositHistoryProps) {
    if (loading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Deposit History</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="animate-pulse">
                                <div className="h-16 bg-gray-200 rounded-lg"></div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className={'max-w-full mx-auto'}>
            <CardHeader>
                <CardTitle>Deposit History</CardTitle>
                <CardDescription>
                    Track your recent deposits and their status
                </CardDescription>
            </CardHeader>

            <CardContent>
                {deposits.length === 0 ? (
                    <div className="text-center py-8">
                        <Wallet className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">No deposits yet</p>
                        <p className="text-sm text-gray-400">Your deposit history will appear here</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {deposits.map((deposit, index) => (
                            <div key={deposit.id || index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                        {deposit.type === 'fiat' ? (
                                            <CreditCard className="w-5 h-5 text-blue-600" />
                                        ) : (
                                            <Bitcoin className="w-5 h-5 text-blue-600" />
                                        )}
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">
                                            {formatCurrency(deposit.amount, deposit.currency)}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {deposit.type === 'fiat' ? 'Bank Transfer' : 'Crypto Deposit'}
                                        </p>
                                    </div>
                                </div>

                                <div className="text-right">
                                    <Badge
                                        variant={
                                            deposit.status === 'confirmed' ? 'default' :
                                                deposit.status === 'pending' ? 'secondary' : 'destructive'
                                        }
                                    >
                                        {deposit.status.charAt(0).toUpperCase() + deposit.status.slice(1)}
                                    </Badge>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {new Date(deposit.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
