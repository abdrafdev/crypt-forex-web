'use client'

import React from 'react'
import { CornerDecorations } from './corner-decorations'
import { Logo } from '@/components/ui/logo'
import { PageHeader } from './page-header'
import { SignupForm } from './signup-form'


interface SignupFormData {
    firstName: string
    lastName: string
    email: string
    password: string
    confirmPassword: string
}

export const SignupPage: React.FC = () => {
    const [loading, setLoading] = React.useState(false)

    const handleSignup = async (formData: SignupFormData) => {
        setLoading(true)
        try {
            // Handle signup logic here
            console.log('Signup attempt:', formData)

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000))

            // Handle success - redirect or show success message
        } catch (error) {
            console.error('Signup error:', error)
            // Handle error
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex relative overflow-hidden">
            {/* Corner Decorations */}
            <CornerDecorations />

            {/* Left Side - Form */}
            <div className="flex-1 flex items-center justify-center p-6 bg-white lg:p-8">
                <div className="w-full max-w-md space-y-8">
                    {/* Logo */}
                    <Logo />

                    {/* Header */}
                    <PageHeader
                        title="Create Account"
                        subtitle="Please fill in the details to get started"
                    />

                    {/* Form */}
                    <SignupForm />
                </div>
            </div>
        </div>
    )
}