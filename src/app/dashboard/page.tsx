'use client'

import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, Wallet, ArrowUpRight, ArrowDownRight, DollarSign, Activity } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const { user, isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>Please sign in to access the dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              You need to be logged in to view your trading dashboard.
            </p>
            <Button className="w-full">Sign In to Continue</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.firstName || user?.username || 'Trader'}!</h1>
          <p className="text-gray-600 mt-2">Here's your trading overview for today</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Portfolio Value</CardTitle>
              <DollarSign className="h-4 w-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$25,432.50</div>
              <div className="flex items-center text-sm text-green-600 mt-1">
                <ArrowUpRight className="h-4 w-4 mr-1" />
                <span>12.5% from last month</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Trades</CardTitle>
              <Activity className="h-4 w-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,284</div>
              <div className="flex items-center text-sm text-green-600 mt-1">
                <ArrowUpRight className="h-4 w-4 mr-1" />
                <span>8% from last week</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Profit/Loss</CardTitle>
              <TrendingUp className="h-4 w-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">+$3,241.00</div>
              <div className="flex items-center text-sm text-gray-600 mt-1">
                <span>This month</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Active Pairs</CardTitle>
              <Wallet className="h-4 w-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <div className="flex items-center text-sm text-gray-600 mt-1">
                <span>USD/EUR, GBP/JPY...</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Market Overview</CardTitle>
              <CardDescription>Top performing forex pairs today</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold">USD</span>
                    </div>
                    <div>
                      <p className="font-semibold">USD/EUR</p>
                      <p className="text-sm text-gray-600">1.0852</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-600">+0.32%</p>
                    <p className="text-sm text-gray-600">24h change</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold">GBP</span>
                    </div>
                    <div>
                      <p className="font-semibold">GBP/JPY</p>
                      <p className="text-sm text-gray-600">187.432</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-600">+1.24%</p>
                    <p className="text-sm text-gray-600">24h change</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold">EUR</span>
                    </div>
                    <div>
                      <p className="font-semibold">EUR/JPY</p>
                      <p className="text-sm text-gray-600">161.234</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-red-600">-0.18%</p>
                    <p className="text-sm text-gray-600">24h change</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Start trading now</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Link href="/trade">
                <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  New Trade
                </Button>
              </Link>
              <Link href="/deposit">
                <Button variant="outline" className="w-full">
                  Deposit Funds
                </Button>
              </Link>
              <Link href="/wallet">
                <Button variant="outline" className="w-full">
                  Connect Wallet
                </Button>
              </Link>
              <Link href="/markets">
                <Button variant="outline" className="w-full">
                  View Markets
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest trading activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Bought USD/EUR</p>
                  <p className="text-sm text-gray-600">2 hours ago</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">$1,000.00</p>
                  <p className="text-sm text-green-600">+2.3%</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Sold GBP/JPY</p>
                  <p className="text-sm text-gray-600">5 hours ago</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">$2,500.00</p>
                  <p className="text-sm text-green-600">+5.1%</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Deposited USDC</p>
                  <p className="text-sm text-gray-600">Yesterday</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">$5,000.00</p>
                  <p className="text-sm text-gray-600">Completed</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
