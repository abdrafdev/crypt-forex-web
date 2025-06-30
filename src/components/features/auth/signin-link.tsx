import React from 'react'
import Link from 'next/link'

interface SignInLinkProps {
    text?: string
    linkText?: string
    href?: string
}

export const SignInLink: React.FC<SignInLinkProps> = ({
    text = 'Already have an account?',
    linkText = 'Sign In',
    href = '/login'
}) => {
    return (
        <div className="text-center">
            <span className="text-sm text-gray-600">
                {text}{' '}
                <Link
                    href={href}
                    className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
                >
                    {linkText}
                </Link>
            </span>
        </div>
    )
}