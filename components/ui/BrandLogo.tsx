'use client'

/**
 * BrandLogo - Global brand component for CloudCloset
 * 
 * Branding Rules:
 * - "Cloud" is rendered in bold blue (#000DFF) with font-extrabold
 * - "Closet" is rendered in black with font-bold
 * - Logo image has no border
 * - Developer: C.Threads
 */

interface Props {
    size?: 'sm' | 'md' | 'lg'
    showIcon?: boolean
}

export function BrandLogo({ size = 'md', showIcon = false }: Props) {
    const textClass = size === 'sm'
        ? 'text-base'
        : size === 'lg'
            ? 'text-3xl'
            : 'text-xl'

    const iconSize = size === 'sm'
        ? 'w-6 h-6'
        : size === 'lg'
            ? 'w-16 h-16'
            : 'w-8 h-8'

    return (
        <span className={`inline-flex items-center gap-2 ${textClass} tracking-tight`}>
            {showIcon && (
                <img src="/logo.png" alt="CloudCloset" className={`${iconSize} rounded-2xl shadow-sm`} />
            )}
            <span>
                <span className="font-extrabold" style={{ color: '#000DFF' }}>Cloud</span>
                <span className="font-bold">Closet</span>
            </span>
        </span>
    )
}
