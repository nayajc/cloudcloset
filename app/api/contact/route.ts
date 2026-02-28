import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY || 're_dummy')

// The recipient email is kept server-side only - never exposed to the client
const ADMIN_EMAIL = 'nayajcsong@gmail.com'

export async function POST(req: NextRequest) {
    try {
        const { name, email, message } = await req.json()

        if (!name || !email || !message) {
            return NextResponse.json({ error: 'All fields are required.' }, { status: 400 })
        }

        if (!process.env.RESEND_API_KEY) {
            console.error('[contact] RESEND_API_KEY is not set.')
            return NextResponse.json({ error: 'Email service not configured.' }, { status: 500 })
        }

        await resend.emails.send({
            from: 'CloudCloset Contact <onboarding@resend.dev>',
            to: ADMIN_EMAIL,
            subject: `[CloudCloset Contact] Message from ${name}`,
            html: `
        <h2>New Contact Message</h2>
        <p><strong>From:</strong> ${name} (${email})</p>
        <hr />
        <p>${message.replace(/\n/g, '<br />')}</p>
        <hr />
        <p style="color: #999; font-size: 12px;">Sent via CloudCloset contact form</p>
      `,
            replyTo: email,
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('[contact] Error:', error)
        return NextResponse.json({ error: 'Failed to send message.' }, { status: 500 })
    }
}
