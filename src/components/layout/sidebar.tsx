'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/utils';
import { Button } from '@/components/ui/button';
import {
    LayoutDashboard,
    Wallet,
    Coins,
    TrendingUp,
    BarChart3,
    ChevronsRightLeft,
    ChevronsLeftRight,
} from 'lucide-react';

interface SidebarProps {
    className?: string;
    collapsed: boolean;
    setCollapsed: (value: boolean) => void;
}

const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Deposits', href: '/deposits', icon: Wallet },
    { name: 'Stablecoins', href: '/stablecoins', icon: Coins },
    { name: 'Forex Pairs', href: '/forex-pairs', icon: TrendingUp },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 },
];

export function Sidebar({ className, collapsed, setCollapsed }: SidebarProps) {
    const pathname = usePathname();

    return (
        <div
            className={cn(
                'relative flex flex-col h-screen bg-white border-r border-gray-200 transition-all duration-300 ease-in-out',
                collapsed ? 'w-20' : 'w-64',
                className
            )}
        >
            {/* Logo */}
            <div className="flex items-center h-20 px-4 border-b border-gray-200">
                <Link href="/dashboard" className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                        <TrendingUp className="w-5 h-5 text-white" />
                    </div>
                    {!collapsed && (
                        <span className="text-xl font-bold text-gray-900 transition-opacity duration-200">
                            ForexFX
                        </span>
                    )}
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-2 py-6 space-y-2">
                {navigation.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;
                    return (
                        <Link key={item.name} href={item.href}>
                            <Button
                                variant={isActive ? 'default' : 'ghost'}
                                className={cn(
                                    'w-full flex items-center font-normal transition-all duration-200',
                                    isActive && 'bg-blue-50 text-blue-700 hover:bg-blue-100',
                                    collapsed ? 'justify-center' : 'justify-start px-3'
                                )}
                            >
                                <Icon className="w-5 h-5" />
                                {!collapsed && (
                                    <span className="ml-3 truncate transition-opacity duration-200">
                                        {item.name}
                                    </span>
                                )}
                            </Button>
                        </Link>
                    );
                })}
            </nav>

            {/* Collapse/Expand Toggle */}
            <div className="p-4 border-t border-gray-200">
                <Button
                    onClick={() => setCollapsed(!collapsed)}
                    variant="ghost"
                    className="w-full flex justify-center"
                >
                    {collapsed ? (
                        <ChevronsLeftRight className="w-5 h-5" />
                    ) : (
                        <div className="flex items-center">
                            <ChevronsRightLeft className="w-5 h-5 mr-2" />
                            {/* Optional label: <span className="text-sm">Collapse</span> */}
                        </div>
                    )}
                </Button>
            </div>
        </div>
    );
}
