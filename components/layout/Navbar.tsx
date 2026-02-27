'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Shirt, Sparkles, Clock, LogOut } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { href: '/', label: '홈', icon: Home },
  { href: '/wardrobe', label: '옷장', icon: Shirt },
  { href: '/recommend', label: '추천', icon: Sparkles },
  { href: '/history', label: '히스토리', icon: Clock },
]

export function Navbar() {
  const pathname = usePathname()
  const { user, signOut } = useAuth()

  return (
    <>
      {/* 상단 헤더 */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm border-b">
        <div className="max-w-md mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="font-bold text-lg tracking-tight flex items-center gap-2">
            <img src="/logo.png" alt="CloudCloset" className="w-6 h-6 rounded border" />
            CloudCloset
          </Link>
          {user && (
            <button
              onClick={signOut}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              title="로그아웃"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </header>

      {/* 하단 탭 네비게이션 */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm border-t">
        <div className="max-w-md mx-auto flex">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const active = pathname === href
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'flex-1 flex flex-col items-center gap-1 py-3 text-xs transition-colors',
                  active ? 'text-black' : 'text-gray-400 hover:text-gray-600'
                )}
              >
                <Icon className={cn('w-5 h-5', active && 'fill-current')} />
                {label}
              </Link>
            )
          })}
        </div>
      </nav>
    </>
  )
}
