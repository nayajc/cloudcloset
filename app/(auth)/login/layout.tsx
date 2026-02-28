import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Login',
    description: 'Sign in to your CloudCloset account or create a new one to get AI-powered weather-based outfit recommendations.',
}

export default function LoginLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <>{children}</>
}
