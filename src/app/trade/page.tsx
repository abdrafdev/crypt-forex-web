'use client'

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowUpDown, TrendingUp, TrendingDown } from "lucide-react";

export default function TradePage() {
  const [orderType, setOrderType] = useState<'buy' | 'sell'>('buy');
  const [amount, setAmount] = useState("");
  const [pair, setPair] = useState("USD/EUR");

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Trade</h1>
          <p className="text-gray-600 mt-2">Execute forex trades instantly</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Trading Panel */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>New Trade</CardTitle>
              <CardDescription>Place a market order</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Pair Selection */}
                <div>
                  <label className="block text-sm font-medium mb-2">Trading Pair</label>
                  <select 
                    className="w-full p-3 border rounded-lg"
                    value={pair}
                    onChange={(e) => setPair(e.target.value)}
                  >
                    <option value="USD/EUR">USD/EUR</option>
                    <option value="GBP/JPY">GBP/JPY</option>
                    <option value="EUR/JPY">EUR/JPY</option>
                    <option value="USD/JPY">USD/JPY</option>
                  </select>
                </div>

                {/* Order Type */}
                <div className="flex gap-2">
                  <Button
                    className={`flex-1 ${orderType === 'buy' ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-200 text-gray-700'}`}
                    onClick={() => setOrderType('buy')}
                  >
                    Buy
                  </Button>
                  <Button
                    className={`flex-1 ${orderType === 'sell' ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-200 text-gray-700'}`}
                    onClick={() => setOrderType('sell')}
                  >
                    Sell
                  </Button>
                </div>

                {/* Amount */}
                <div>
                  <label className="block text-sm font-medium mb-2">Amount</label>
                  <Input
                    type="number"
                    placeholder="Enter amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full"
                  />
                </div>

                {/* Price Display */}
                <div className="p-4 bg-gray-100 rounded-lg">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Current Price:</span>
                    <span className="font-bold">1.0852</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total:</span>
                    <span className="font-bold">${amount ? (parseFloat(amount) * 1.0852).toFixed(2) : '0.00'}</span>
                  </div>
                </div>

                {/* Submit Button */}
                <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  Place {orderType === 'buy' ? 'Buy' : 'Sell'} Order
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Market Info */}
          <Card>
            <CardHeader>
              <CardTitle>Market Info</CardTitle>
              <CardDescription>{pair}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">24h High</span>
                  <span className="font-semibold">1.0895</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">24h Low</span>
                  <span className="font-semibold">1.0812</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">24h Volume</span>
                  <span className="font-semibold">5.2B</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">24h Change</span>
                  <span className="font-semibold text-green-600">+0.32%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
