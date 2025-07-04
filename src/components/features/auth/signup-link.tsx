import Link from 'next/link'

export const SignUpLink: React.FC = () => {
    return (
        <div className="text-center">
            <span className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link
                    href="/signup"
                    className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
                >
                    Sign Up
                </Link>
            </span>
        </div>
    )
}