import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
    try {
        const { email, method } = await req.json()

        if (!email) {
            return NextResponse.json({ error: '이메일 주소가 필요합니다.' }, { status: 400 })
        }

        if (!process.env.RESEND_API_KEY) {
            console.error('[notify-signup] RESEND_API_KEY가 설정되지 않았습니다.')
            return NextResponse.json({ error: '서버 설정 오류입니다.' }, { status: 500 })
        }

        const signupMethod = method === 'google-oauth' ? '🔵 Google OAuth' : '📧 Email/Password'

        const { data, error } = await resend.emails.send({
            from: 'CloudCloset <onboarding@resend.dev>',
            to: ['nayajcsong@gmail.com'],
            subject: '새로운 사용자가 CloudCloset에 가입했습니다! 🎉',
            html: `
        <h2>신규 회원 가입 알림</h2>
        <p>방금 새로운 사용자가 가입했습니다.</p>
        <p><strong>가입 이메일:</strong> ${email}</p>
        <p><strong>가입 방법:</strong> ${signupMethod}</p>
        <hr />
        <p>CloudCloset 앱 발송</p>
      `,
        })

        if (error) {
            console.error('[notify-signup] Resend 발송 에러:', error)
            return NextResponse.json({ error: '이메일 발송에 실패했습니다.' }, { status: 500 })
        }

        return NextResponse.json({ success: true, data })
    } catch (error) {
        console.error('[notify-signup] 오류:', error)
        return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 })
    }
}
