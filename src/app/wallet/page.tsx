'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Wallet, ArrowUpRight, ArrowDownRight, DollarSign, Bitcoin, CreditCard, Send } from "lucide-react";
import { useState } from "react";

export default function WalletPage() {
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Wallet</h1>
          <p className="text-gray-600 mt-2">Manage your funds and transactions</p>
        </div>

        {/* Balance Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Total Balance</CardTitle>
              <CardDescription>Your available funds across all currencies</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold mb-4">$45,231.89</div>
              <div className="grid grid-cols-3 gap-4">
                <div className="p-3 bg-gray-100 rounded-lg">
                  <p className="text-sm text-gray-600">USD</p>
                  <p className="font-semibold">$12,458.00</p>
                </div>
                <div className="p-3 bg-gray-100 rounded-lg">
                  <p className="text-sm text-gray-600">EUR</p>
                  <p className="font-semibold">€15,234.50</p>
                </div>
                <div className="p-3 bg-gray-100 rounded-lg">
                  <p className="text-sm text-gray-600">GBP</p>
                  <p className="font-semibold">£10,892.30</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Available</span>
                <span className="font-semibold">$12,458.00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">In Trades</span>
                <span className="font-semibold">$32,773.89</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Profit</span>
                <span className="font-semibold text-green-600">+$5,231.45</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Deposit */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ArrowDownRight className="mr-2 h-5 w-5 text-green-600" />
                Deposit Funds
              </CardTitle>
              <CardDescription>Add money to your wallet</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Amount (USD)</label>
                  <Input
                    type="number"
                    placeholder="Enter amount"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" className="w-full">
                    <CreditCard className="mr-2 h-4 w-4" />
                    Card
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Bitcoin className="mr-2 h-4 w-4" />
                    Crypto
                  </Button>
                </div>
                <Button className="w-full bg-green-600 hover:bg-green-700">
                  Deposit
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Withdraw */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ArrowUpRight className="mr-2 h-5 w-5 text-blue-600" />
                Withdraw Funds
              </CardTitle>
              <CardDescription>Transfer money from your wallet</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Amount (USD)</label>
                  <Input
                    type="number"
                    placeholder="Enter amount"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Destination</label>
                  <select className="w-full p-2 border rounded-lg">
                    <option>Bank Account ****1234</option>
                    <option>Bank Account ****5678</option>
                    <option>PayPal</option>
                  </select>
                </div>
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  Withdraw
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Transaction History */}
        <Card>
          <CardHeader>
            <CardTitle>Transaction History</CardTitle>
            <CardDescription>Your recent wallet transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { type: "deposit", amount: 5000, date: "2024-01-15", method: "Credit Card", status: "completed" },
                { type: "withdraw", amount: 2000, date: "2024-01-14", method: "Bank Transfer", status: "completed" },
                { type: "deposit", amount: 10000, date: "2024-01-12", method: "Wire Transfer", status: "completed" },
                { type: "withdraw", amount: 3500, date: "2024-01-10", method: "PayPal", status: "pending" },
                { type: "deposit", amount: 7500, date: "2024-01-08", method: "Crypto (BTC)", status: "completed" },
              ].map((transaction, index) => (
                <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-full ${transaction.type === 'deposit' ? 'bg-green-100' : 'bg-blue-100'}`}>
                      {transaction.type === 'deposit' ? (
                        <ArrowDownRight className="h-4 w-4 text-green-600" />
                      ) : (
                        <ArrowUpRight className="h-4 w-4 text-blue-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium capitalize">{transaction.type}</p>
                      <p className="text-sm text-gray-500">{transaction.method}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold ${transaction.type === 'deposit' ? 'text-green-600' : 'text-gray-900'}`}>
                      {transaction.type === 'deposit' ? '+' : '-'}${transaction.amount.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-500">{transaction.date}</p>
                  </div>
                  <div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      transaction.status === 'completed' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {transaction.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
