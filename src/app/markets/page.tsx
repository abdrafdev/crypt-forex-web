'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Activity } from "lucide-react";

export default function MarketsPage() {
  const markets = [
    { pair: "USD/EUR", price: "1.0852", change: 0.32, volume: "5.2B" },
    { pair: "GBP/JPY", price: "187.43", change: 1.24, volume: "2.8B" },
    { pair: "EUR/JPY", price: "161.23", change: -0.18, volume: "3.1B" },
    { pair: "USD/JPY", price: "149.85", change: -0.45, volume: "8.7B" },
    { pair: "GBP/USD", price: "1.2634", change: 0.76, volume: "4.2B" },
    { pair: "AUD/USD", price: "0.6421", change: -0.92, volume: "1.9B" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Forex Markets</h1>
          <p className="text-gray-600 mt-2">Live market data and trading pairs</p>
        </div>

        <div className="grid gap-4">
          {markets.map((market) => (
            <Card key={market.pair} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Activity className="h-8 w-8 text-blue-600" />
                    <div>
                      <h3 className="font-semibold text-lg">{market.pair}</h3>
                      <p className="text-2xl font-bold">{market.price}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`flex items-center gap-1 ${market.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {market.change > 0 ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />}
                      <span className="font-semibold text-lg">{Math.abs(market.change)}%</span>
                    </div>
                    <p className="text-gray-600">Volume: {market.volume}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
