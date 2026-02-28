'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useTranslation } from '@/lib/i18n'
import { Send, CheckCircle, Code2 } from 'lucide-react'
import { BrandLogo } from '@/components/ui/BrandLogo'

export default function ContactPage() {
    const { t } = useTranslation()
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(false)
    const [sent, setSent] = useState(false)
    const [error, setError] = useState<string | null>(null)

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)
        setError(null)
        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, message }),
            })
            if (!res.ok) {
                const data = await res.json()
                throw new Error(data.error || 'Failed to send.')
            }
            setSent(true)
        } catch (e) {
            setError(e instanceof Error ? e.message : 'An error occurred.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 px-4 py-8">
            <div className="max-w-sm mx-auto space-y-6">
                <Link href="/login" className="text-sm text-blue-600 hover:underline">&larr; Back</Link>

                {/* Developer Info */}
                <div className="bg-white rounded-2xl shadow-sm border p-6 text-center">
                    <div className="w-14 h-14 bg-gradient-to-br from-sky-400 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
                        <Code2 className="w-7 h-7 text-white" />
                    </div>
                    <BrandLogo size="md" />
                    <p className="text-sm text-gray-500 mt-1">{t('contact.developedBy')}</p>
                    <p className="text-base font-semibold text-gray-700 mt-0.5">C.Threads</p>
                    <p className="text-xs text-gray-400 mt-3">{t('contact.tagline')}</p>
                </div>

                {/* Contact Form */}
                <div className="bg-white rounded-2xl shadow-sm border p-6">
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                        <Send className="w-4 h-4" />
                        {t('contact.title')}
                    </h3>

                    {sent ? (
                        <div className="text-center py-8 space-y-3">
                            <CheckCircle className="w-12 h-12 text-green-500 mx-auto" />
                            <p className="font-medium text-green-700">{t('contact.sent')}</p>
                            <p className="text-sm text-gray-500">{t('contact.sentDesc')}</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="contact-name">{t('contact.name')}</Label>
                                <Input
                                    id="contact-name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Your name"
                                    required
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="contact-email">{t('contact.email')}</Label>
                                <Input
                                    id="contact-email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="your@email.com"
                                    required
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="contact-message">{t('contact.message')}</Label>
                                <textarea
                                    id="contact-message"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder={t('contact.messagePlaceholder')}
                                    required
                                    rows={4}
                                    className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                />
                            </div>

                            {error && (
                                <p className="text-red-500 text-sm bg-red-50 rounded-lg px-3 py-2">{error}</p>
                            )}

                            <Button type="submit" className="w-full gap-2" disabled={loading}>
                                <Send className="w-4 h-4" />
                                {loading ? t('auth.processing') : t('contact.send')}
                            </Button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    )
}
