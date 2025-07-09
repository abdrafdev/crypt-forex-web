'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/utils';
import { Button } from '@/components/ui/button';
import { signOut } from 'next-auth/react';
import {
    LayoutDashboard,
    Wallet,
    Coins,
    TrendingUp,
    BarChart3,
    User,
    Settings,
    LogOut
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface SidebarProps {
    className?: string;
}

const navigation = [
    {
        name: 'Dashboard',
        href: '/dashboard',
        icon: LayoutDashboard,
    },
    {
        name: 'Deposits',
        href: '/deposits',
        icon: Wallet,
    },
    {
        name: 'Stablecoins',
        href: '/stablecoins',
        icon: Coins,
    },
    {
        name: 'Forex Pairs',
        href: '/forex-pairs',
        icon: TrendingUp,
    },
    {
        name: 'Analytics',
        href: '/analytics',
        icon: BarChart3,
    },
];

export function Sidebar({ className }: SidebarProps) {
    const { user } = useAuth();
    const pathname = usePathname();

    return (
        <div className={cn('flex flex-col w-64 h-screen bg-white border-r border-gray-200', className)}>
            {/* Logo */}
            <div className="flex items-center h-16 px-6 border-b border-gray-200">
                <Link href="/dashboard" className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                        <TrendingUp className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xl font-bold text-gray-900">ForexFX</span>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-2">
                {navigation.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;
                    return (
                        <Link key={item.name} href={item.href}>
                            <Button
                                variant={isActive ? 'default' : 'ghost'}
                                className={cn(
                                    'w-full justify-start text-left font-normal',
                                    isActive && 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                                )}
                            >
                                <Icon className="w-5 h-5 mr-3" />
                                {item.name}
                            </Button>
                        </Link>
                    );
                })}
            </nav>

            {/* User section */}
            <div className="p-4 border-t border-gray-200">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="w-full justify-start">
                            <div className="flex items-center space-x-3 overflow-hidden">
                                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden">
                                    {(user as any)?.image ? (
                                        <img
                                            src={(user as any).image}
                                            alt={user?.name || user?.username || 'User'}
                                            className="w-full h-full object-cover rounded-full"
                                            onError={(e) => {
                                                // Fallback to default icon if image fails to load
                                                e.currentTarget.style.display = 'none';
                                                e.currentTarget.nextElementSibling?.classList.remove('hidden');
                                            }}
                                        />
                                    ) : null}
                                    <User className={`w-5 h-5 text-gray-600 ${(user as any)?.image ? 'hidden' : ''}`} />
                                </div>
                                <div className="flex-1 min-w-0 text-left max-w-[150px] overflow-hidden">
                                    <p className="text-sm font-medium text-gray-900 truncate">
                                        {user?.name || user?.username || 'Hamza'}
                                    </p>
                                    <p className="text-xs text-gray-500 truncate">
                                        {user?.email || 'abc@gmail.com'}
                                    </p>
                                </div>
                            </div>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                        <DropdownMenuItem>
                            <Settings className="mr-2 h-4 w-4" />
                            <span>Settings</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => signOut({ callbackUrl: '/login', redirect: true })}>
                            <LogOut className="mr-2 h-4 w-4" />
                            <span>Sign out</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    );
}
