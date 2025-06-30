import React from 'react'
import { Label } from './label'

interface FormFieldProps {
    label: string
    htmlFor: string
    required?: boolean
    error?: string
    children: React.ReactNode
    className?: string
}

export const FormField: React.FC<FormFieldProps> = ({
    label,
    htmlFor,
    required = false,
    error,
    children,
    className = ''
}) => {
    return (
        <div className={`space-y-2 ${className}`}>
            <Label htmlFor={htmlFor} className="text-sm font-medium text-gray-700">
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            {children}
            {error && (
                <p className="text-sm text-red-600 mt-1">{error}</p>
            )}
        </div>
    )
}