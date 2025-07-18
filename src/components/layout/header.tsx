import React from 'react';
import {Bell, Search, Menu, User, Settings, LogOut, Hand} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {signOut} from "next-auth/react";
import { usePathname } from 'next/navigation';
import Link from "next/link";

interface HeaderProps {
    onMenuClick?: () => void;
    className?: string;
}

export function Header({ onMenuClick, className }: HeaderProps) {
    const { user } = useAuth();

    const pathname = usePathname();

    // Map routes to titles
    const pathToTitle: Record<string, string> = {
        '/dashboard': 'Dashboard',
        '/deposits': 'Deposits',
        '/stablecoins': 'Stablecoins Market',
        '/forex-pairs': 'Forex Pairs',
        '/analytics': 'Analytics',
        '/profile': 'Profile',
        '/settings': 'Settings',
    };

    const title = pathToTitle[pathname] || 'Dashboard';

    return (
        <header className={`bg-white border-b border-gray-200 px-6 py-4 ${className || ''}`}>
            <div className="flex items-center justify-between">
                {/* Left side */}
                <div className="flex items-center space-x-4">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onMenuClick}
                        className="lg:hidden"
                    >
                        <Menu className="w-5 h-5" />
                    </Button>

                    <div className="hidden md:block">
                        <h1 className="text-2xl font-semibold text-gray-900">
                            {title}
                        </h1>
                    </div>
                </div>

                {/* Center - Search */}
                <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
                    <div className="relative w-full">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                            type="text"
                            placeholder="Search forex pairs, stablecoins..."
                            className="pl-10 pr-4 py-2 w-full"
                        />
                    </div>
                </div>

                {/* Right side */}
                <div className="flex items-center space-x-4">
                    {/* Market Status */}
                    <div className="hidden lg:flex items-center space-x-2">
                        <div className="flex items-center space-x-1">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-sm text-gray-600">Market Open</span>
                        </div>
                    </div>

                    {/* Notifications */}
                    <div className="relative">
                        <Button variant="ghost" size="sm" className="relative">
                            <Bell className="w-5 h-5" />
                            <Badge className="absolute -top-1 -right-1 w-5 h-5 text-xs flex items-center justify-center p-0 bg-red-500">
                                3
                            </Badge>
                        </Button>
                    </div>

                    {/* Portfolio Value */}
                    <div className="hidden sm:block text-right">
                        <p className="text-sm text-gray-500">Portfolio Value</p>
                        <p className="text-lg font-semibold text-gray-900">$125,430.50</p>
                    </div>

                    {/* User Avatar */}
                    <div className="flex items-center space-x-2">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <div className="flex items-center space-x-3 overflow-hidden w-full cursor-pointer">
                                    <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden">
                                        {/*{(user as any)?.image ? (*/}
                                        {/*    <img*/}
                                        {/*        src={(user as any).image || '/next.svg'}*/}
                                        {/*        alt={user?.name || user?.username || 'User'}*/}
                                        {/*        className="w-full h-full object-cover rounded-full"*/}
                                        {/*        onError={(e) => {*/}
                                        {/*            e.currentTarget.style.display = 'none';*/}
                                        {/*            e.currentTarget.nextElementSibling?.classList.remove('hidden');*/}
                                        {/*        }}*/}
                                        {/*    />*/}
                                        {/*) : null}*/}
                                        {/*<User className={`w-5 h-5 text-gray-600 ${(user as any)?.image ? 'hidden' : ''}`} />*/}

                                        {user?.avatar ? (
                                            <img
                                                src={user.avatar}
                                                alt={user?.name || user?.username || 'User'}
                                                className="w-full h-full object-cover rounded-full"
                                                onError={(e) => {
                                                    e.currentTarget.style.display = 'none';
                                                    const nextEl = e.currentTarget.nextElementSibling as HTMLElement | null;
                                                    if (nextEl) nextEl.classList.remove('hidden');
                                                }}
                                            />
                                        ) : null}
                                        <User className={`w-5 h-5 text-gray-600 ${user?.avatar ? 'hidden' : ''}`} />
                                    </div>
                                </div>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56">
                                <DropdownMenuItem>
                                    <Hand className={'mr-2 h-4 w-4'} />
                                    <span>Hi, {user?.name}</span>
                                </DropdownMenuItem>
                                <Link href={'/profile'}>
                                    <DropdownMenuItem className={'cursor-pointer'}>
                                        <User className={'mr-2 h-4 w-4'} />
                                        <span>Profile</span>
                                    </DropdownMenuItem>
                                </Link>
                                <Link href={'/settings'}>
                                    <DropdownMenuItem className={'cursor-pointer'}>
                                        <Settings className="mr-2 h-4 w-4" />
                                        <span>Settings</span>
                                    </DropdownMenuItem>
                                </Link>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className={'cursor-pointer'} onClick={() => signOut({ callbackUrl: '/login', redirect: true })}>
                                    <LogOut className="mr-2 h-4 w-4 text-red-500" />
                                    <span className={'text-red-500'}>Sign out</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </div>
        </header>
    );
}
