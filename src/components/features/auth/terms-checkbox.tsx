import React from 'react'
import Link from 'next/link'

interface TermsCheckboxProps {
    checked: boolean
    onChange: (checked: boolean) => void
    required?: boolean
}

export const TermsCheckbox: React.FC<TermsCheckboxProps> = ({
    checked,
    onChange,
    required = false
}) => {
    return (
        <div className="flex items-start space-x-2">
            <input
                type="checkbox"
                id="terms"
                checked={checked}
                onChange={(e) => onChange(e.target.checked)}
                className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                required={required}
            />
            <label htmlFor="terms" className="text-sm text-gray-600">
                I agree to the{' '}
                <Link href="/terms" className="text-blue-600 hover:text-blue-700 underline">
                    Terms of Service
                </Link>
                {' '}and{' '}
                <Link href="/privacy" className="text-blue-600 hover:text-blue-700 underline">
                    Privacy Policy
                </Link>
            </label>
        </div>
    )
}