import Link from 'next/link'

export const ForgotPasswordLink: React.FC = () => {
    return (
        <Link
            href="/forgot-password"
            className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
        >
            Forget password?
        </Link>
    )
}