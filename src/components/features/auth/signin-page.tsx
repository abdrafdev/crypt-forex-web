import Head from 'next/head'
import { Logo } from '@/components/ui/logo'
import { PageHeader } from '@/components/features/auth/page-header'
import { LoginForm } from '@/components/features/auth/login-form'
import { CornerDecorations } from './corner-decorations'

export default function LoginPage() {
    return (
        <>
            <Head>
                <title>Sign In - ForexFX</title>
                <meta name="description" content="Sign in to your ForexFX trading account" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

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
                            title="Welcome Back!"
                            subtitle="Please enter log in details below"
                        />

                        {/* Form */}
                        <LoginForm />
                    </div>
                </div>
            </div>
        </>
    )
}