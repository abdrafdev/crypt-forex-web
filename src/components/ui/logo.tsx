import React from 'react'

interface LogoProps {
    className?: string
    size?: 'sm' | 'md' | 'lg'
}

export const Logo: React.FC<LogoProps> = ({ className = '', size = 'md' }) => {
    const sizes = {
        sm: 'w-6 h-6',
        md: 'w-8 h-8',
        lg: 'w-10 h-10'
    }

    const textSizes = {
        sm: 'text-lg',
        md: 'text-xl',
        lg: 'text-2xl'
    }

    return (
        <div className={`flex items-center space-x-2 ${className}`}>
            <div className={`${sizes[size]} bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center`}>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-trending-up w-5 h-5 text-white"
                    aria-hidden="true"
                >
                    <path d="M16 7h6v6"></path>
                    <path d="m22 7-8.5 8.5-5-5L2 17"></path>
                </svg>
            </div>
            <span className={`${textSizes[size]} font-semibold text-gray-900`}>ForexFX</span>
        </div>
    )
}