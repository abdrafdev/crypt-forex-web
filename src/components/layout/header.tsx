import React from 'react';
import { Bell, Search, Menu, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';

interface HeaderProps {
    onMenuClick?: () => void;
    className?: string;
}

export function Header({ onMenuClick, className }: HeaderProps) {
    const { user } = useAuth();

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
                            Dashboard
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
                        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden">
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
                            <User className={`w-4 h-4 text-gray-600 ${(user as any)?.image ? 'hidden' : ''}`} />
                        </div>
                        <div className="hidden md:block">
                            <p className="text-sm font-medium text-gray-900">
                                {user?.name || user?.username || 'User'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
