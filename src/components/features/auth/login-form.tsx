'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { FormField } from '@/components/ui/form-field'
import { PasswordInput } from '@/components/ui/password-input'
import { Divider } from '@/components/ui/divider'
import { GoogleButton } from './google-button'
import { SignUpLink } from './signup-link'
import { ForgotPasswordLink } from './forgot-password-link'
import { LoginFormData, LoginFormErrors } from '@/types/login'
import { useAuth } from '@/hooks/useAuth'

interface LoginFormProps {
    onSuccess?: (user: any, token?: string) => void
    redirectOnSuccess?: boolean
}

export const LoginForm: React.FC<LoginFormProps> = ({
    onSuccess,
    redirectOnSuccess = true
}) => {
    const [formData, setFormData] = useState<LoginFormData>({
        email: '',
        password: ''
    })

    const [errors, setErrors] = useState<LoginFormErrors>({})
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState('')
    const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error', message: string } | null>(null)

    // Use the auth hook and router
    const { login } = useAuth()
    const router = useRouter()
    const searchParams = useSearchParams()

    // Check for query parameters
    useEffect(() => {
        const verified = searchParams.get('verified')
        const reset = searchParams.get('reset')

        if (verified === 'true') {
            setStatusMessage({
                type: 'success',
                message: 'Your email has been verified successfully! You can now log in.'
            })
        } else if (reset === 'true') {
            setStatusMessage({
                type: 'success',
                message: 'Your password has been reset successfully! You can now log in with your new password.'
            })
        }
    }, [searchParams])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))

        // Clear field error when user starts typing
        if (errors[name as keyof LoginFormErrors]) {
            setErrors(prev => ({
                ...prev,
                [name]: undefined
            }))
        }

        // Clear general error
        if (errors.general) {
            setErrors(prev => ({ ...prev, general: undefined }))
        }
    }

    const validateForm = (): boolean => {
        const newErrors: LoginFormErrors = {}

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required'
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Invalid email format'
        }

        if (!formData.password) {
            newErrors.password = 'Password is required'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleRedirect = () => {
        if (redirectOnSuccess) {
            router.push('/dashboard')
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateForm()) {
            return
        }

        setLoading(true)
        setErrors({})

        try {
            // Use the login function from useAuth hook
            const success = await login(formData.email, formData.password)

            if (success) {
                setSuccess('Login successful! Redirecting...')

                // Clear form
                setFormData({
                    email: '',
                    password: ''
                })

                // Call success callback if provided
                if (onSuccess) {
                    // Get user data from localStorage since useAuth stores it there
                    const userData = localStorage.getItem('auth_user')
                    const token = localStorage.getItem('auth_token')

                    if (userData && token) {
                        onSuccess(JSON.parse(userData), token)
                    }
                }

                // Redirect after 1 second
                setTimeout(() => {
                    handleRedirect()
                }, 1000)
            } else {
                setErrors({ general: 'Invalid email or password' })
            }
        } catch (error) {
            console.error('Login error:', error)
            setErrors({ general: 'Network error. Please check your connection and try again.' })
        } finally {
            setLoading(false)
        }
    }

    const handleGoogleLogin = () => {
        // TODO: Implement Google OAuth login
        console.log('Google login clicked')
        setErrors({ general: 'Google login will be implemented soon!' })
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Status Message */}
            {statusMessage && (
                <div className={`p-4 ${statusMessage.type === 'success' ? 'bg-green-50 border-l-4 border-green-400 text-green-700' : 'bg-red-50 border-l-4 border-red-400 text-red-700'} rounded-r-lg`}>
                    <div className="flex">
                        <div className="flex-shrink-0">
                            {statusMessage.type === 'success' ? (
                                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                            ) : (
                                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            )}
                        </div>
                        <div className="ml-3">
                            <p className="text-sm">{statusMessage.message}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Success Message */}
            {success && (
                <div className="p-4 bg-green-50 border-l-4 border-green-400 text-green-700 rounded-r-lg">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm">{success}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Error Message */}
            {errors.general && (
                <div className="p-4 bg-red-50 border-l-4 border-red-400 text-red-700 rounded-r-lg">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm">{errors.general}</p>
                        </div>
                    </div>
                </div>
            )}

            <div className="space-y-4">
                {/* Email Field */}
                <FormField
                    label="Email"
                    htmlFor="email"
                    required
                    error={errors.email}
                >
                    <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Enter your email"
                        required
                        disabled={loading}
                    />
                </FormField>

                {/* Password Field */}
                <FormField
                    label="Password"
                    htmlFor="password"
                    required
                    error={errors.password}
                >
                    <PasswordInput
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="Enter your password"
                        required
                        disabled={loading}
                    />
                </FormField>
            </div>

            {/* Forgot Password Link */}
            <div className="text-right">
                <ForgotPasswordLink />
            </div>

            {/* Sign In Button */}
            <Button
                type="submit"
                className="w-full py-3"
                disabled={loading}
            >
                {loading ? (
                    <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Signing in...
                    </>
                ) : (
                    'Sign in'
                )}
            </Button>

            {/* Divider */}
            <Divider text="or continue" />

            {/* Google Sign In */}
            <GoogleButton callbackUrl="/dashboard" />

            {/* Sign Up Link */}
            <SignUpLink />
        </form>
    )
}
