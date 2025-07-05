'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { FormField } from '@/components/ui/form-field'
import { PasswordInput } from '@/components/ui/password-input'
import { TermsCheckbox } from './terms-checkbox'
import { Divider } from '@/components/ui/divider'
import { GoogleButton } from './google-button'
import { SignInLink } from './signin-link'
import { generateUsername } from '@/lib/username'
import { SignupApiRequest, SignupApiResponse, SignupFormData, SignupFormErrors } from '@/types/signup'

interface SignupFormProps {
    onSuccess?: (user: any) => void
    redirectOnSuccess?: boolean
}

export const SignupForm: React.FC<SignupFormProps> = ({
    onSuccess,
    redirectOnSuccess = true
}) => {
    const [formData, setFormData] = useState<SignupFormData>({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: ''
    })

    const [errors, setErrors] = useState<SignupFormErrors>({})
    const [termsAccepted, setTermsAccepted] = useState(false)
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState('')

    // Use router conditionally
    let router: any = null
    try {
        router = useRouter()
    } catch (error) {
        // Router not available, will handle redirect differently
        console.log('Router not available, redirect will be handled via window.location')
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))

        // Clear field error when user starts typing
        if (errors[name as keyof SignupFormErrors]) {
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
        const newErrors: SignupFormErrors = {}

        if (!formData.firstName.trim()) {
            newErrors.firstName = 'First name is required'
        }

        if (!formData.lastName.trim()) {
            newErrors.lastName = 'Last name is required'
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required'
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Invalid email format'
        }

        if (!formData.password) {
            newErrors.password = 'Password is required'
        } else if (formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters'
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
            newErrors.password = 'Password must contain uppercase, lowercase, and number'
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password'
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleRedirect = () => {
        if (redirectOnSuccess) {
            if (router) {
                // Use Next.js router if available
                router.push('/login')
            } else {
                // Fallback to window.location
                if (typeof window !== 'undefined') {
                    window.location.href = '/login'
                }
            }
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateForm() || !termsAccepted) {
            if (!termsAccepted) {
                setErrors(prev => ({
                    ...prev,
                    general: 'You must accept the terms and conditions'
                }))
            }
            return
        }

        setLoading(true)
        setErrors({})

        try {
            // Prepare API request data
            const username = generateUsername(formData.firstName, formData.lastName, formData.email)
            const fullName = `${formData.firstName.trim()} ${formData.lastName.trim()}`

            const apiData: SignupApiRequest = {
                email: formData.email,
                username: username,
                password: formData.password,
                name: fullName,
                firstName: formData.firstName,
                lastName: formData.lastName
            }

            // Make API call
            const response = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(apiData)
            })

            const data: SignupApiResponse = await response.json()

            if (data.success) {
                setSuccess('Account created successfully! Redirecting to login...')

                // Clear form
                setFormData({
                    firstName: '',
                    lastName: '',
                    email: '',
                    password: '',
                    confirmPassword: ''
                })
                setTermsAccepted(false)

                // Call success callback if provided
                if (onSuccess && data.user) {
                    onSuccess(data.user)
                }

                // Redirect after 2 seconds
                setTimeout(() => {
                    handleRedirect()
                }, 2000)
            } else {
                // Handle API errors
                if (data.errors && Array.isArray(data.errors)) {
                    setErrors({ general: data.errors.join(', ') })
                } else {
                    setErrors({ general: data.message || 'An error occurred during signup' })
                }
            }
        } catch (error) {
            console.error('Signup error:', error)
            setErrors({ general: 'Network error. Please check your connection and try again.' })
        } finally {
            setLoading(false)
        }
    }

    const handleGoogleSignup = () => {
        // TODO: Implement Google OAuth signup
        console.log('Google signup clicked')
        setErrors({ general: 'Google signup will be implemented soon!' })
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
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
                {/* Name Fields */}
                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        label="First Name"
                        htmlFor="firstName"
                        required
                        error={errors.firstName}
                    >
                        <Input
                            id="firstName"
                            name="firstName"
                            type="text"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            placeholder="First name"
                            required
                            disabled={loading}
                        />
                    </FormField>

                    <FormField
                        label="Last Name"
                        htmlFor="lastName"
                        required
                        error={errors.lastName}
                    >
                        <Input
                            id="lastName"
                            name="lastName"
                            type="text"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            placeholder="Last name"
                            required
                            disabled={loading}
                        />
                    </FormField>
                </div>

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
                        placeholder="Create a password"
                        required
                        disabled={loading}
                    />
                    <p className="mt-1 text-xs text-gray-500">
                        Must contain uppercase, lowercase, and number (8+ characters)
                    </p>
                </FormField>

                {/* Confirm Password Field */}
                <FormField
                    label="Confirm Password"
                    htmlFor="confirmPassword"
                    required
                    error={errors.confirmPassword}
                >
                    <PasswordInput
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        placeholder="Confirm your password"
                        required
                        disabled={loading}
                    />
                </FormField>
            </div>

            {/* Terms and Conditions */}
            <TermsCheckbox
                checked={termsAccepted}
                onChange={setTermsAccepted}
                required
            />

            {/* Sign Up Button */}
            <Button
                type="submit"
                className="w-full py-3"
                disabled={loading || !termsAccepted}
            >
                {loading ? (
                    <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Creating Account...
                    </>
                ) : (
                    'Create Account'
                )}
            </Button>

            {/* Divider */}
            <Divider text="or continue" />

            {/* Google Sign Up */}
            <GoogleButton onClick={handleGoogleSignup} disabled={loading} />

            {/* Sign In Link */}
            <SignInLink />
        </form>
    )
}