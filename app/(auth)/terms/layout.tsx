import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Terms & Privacy',
    description: 'Read the Terms of Service and Privacy Policy for CloudCloset.',
}

export default function TermsLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <>{children}</>
}
