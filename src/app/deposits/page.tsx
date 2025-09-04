'use client'

import { useState } from 'react';
import { DepositForm, DepositHistory } from '@/components/features/deposits/deposit-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DollarSign, History, TrendingUp } from 'lucide-react';

export default function DepositsPage() {
  const [deposits, setDeposits] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleDepositSubmit = async (data: any) => {
    setLoading(true);
    try {
      // Simulate API call
      console.log('Processing deposit:', data);
      
      // Add to history (mock)
      const newDeposit = {
        id: Date.now().toString(),
        ...data,
        status: 'pending',
        createdAt: new Date().toISOString(),
      };
      
      setDeposits([newDeposit, ...deposits]);
      
      // Show success message
      alert('Deposit request submitted successfully!');
    } catch (error) {
      console.error('Deposit error:', error);
      alert('Failed to process deposit. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const totalDeposited = deposits.reduce((sum, dep) => sum + (dep.amount || 0), 0);
  const pendingDeposits = deposits.filter(d => d.status === 'pending').length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Deposits</h1>
          <p className="text-gray-600 mt-2">Fund your account with fiat or cryptocurrency</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Deposited</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalDeposited.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">All time deposits</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <History className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingDeposits}</div>
              <p className="text-xs text-muted-foreground">Awaiting confirmation</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Month</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$0</div>
              <p className="text-xs text-muted-foreground">Monthly deposits</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <DepositForm onSubmit={handleDepositSubmit} loading={loading} />
          </div>
          <div>
            <DepositHistory deposits={deposits} loading={loading} />
          </div>
        </div>
      </div>
    </div>
  );
}
