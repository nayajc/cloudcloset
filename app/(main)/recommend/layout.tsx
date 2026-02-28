import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'AI Recommendations',
    description: 'Get daily weather-based, AI-powered outfit recommendations from your wardrobe.',
}

export default function RecommendLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <>{children}</>
}
