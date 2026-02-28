'use client'

import { useState, useCallback, useRef } from 'react'

interface UseSwipeOptions {
    onSwipeLeft?: () => void
    onSwipeRight?: () => void
    minDistance?: number
}

/**
 * Hook for swipe gesture detection with visual slide offset.
 * Returns touch handlers and a CSS translateX value for animation.
 */
export function useSwipe({ onSwipeLeft, onSwipeRight, minDistance = 50 }: UseSwipeOptions) {
    const [offsetX, setOffsetX] = useState(0)
    const startX = useRef<number | null>(null)
    const [swiping, setSwiping] = useState(false)

    const onTouchStart = useCallback((e: React.TouchEvent) => {
        startX.current = e.targetTouches[0].clientX
        setSwiping(true)
    }, [])

    const onTouchMove = useCallback((e: React.TouchEvent) => {
        if (startX.current === null) return
        const diff = e.targetTouches[0].clientX - startX.current
        // Dampen the drag to 40% for a rubberband feel
        setOffsetX(diff * 0.4)
    }, [])

    const onTouchEnd = useCallback(() => {
        if (startX.current === null) return
        const finalOffset = offsetX

        if (finalOffset < -minDistance / 2 && onSwipeLeft) {
            // Animate off-screen to the left, then snap back
            setOffsetX(-300)
            setTimeout(() => {
                onSwipeLeft()
                setOffsetX(0)
            }, 200)
        } else if (finalOffset > minDistance / 2 && onSwipeRight) {
            // Animate off-screen to the right, then snap back
            setOffsetX(300)
            setTimeout(() => {
                onSwipeRight()
                setOffsetX(0)
            }, 200)
        } else {
            setOffsetX(0)
        }

        startX.current = null
        setTimeout(() => setSwiping(false), 250)
    }, [offsetX, minDistance, onSwipeLeft, onSwipeRight])

    const style: React.CSSProperties = {
        transform: `translateX(${offsetX}px)`,
        transition: swiping && offsetX !== 0 && Math.abs(offsetX) < 200 ? 'none' : 'transform 0.25s ease-out',
        willChange: 'transform',
    }

    return { onTouchStart, onTouchMove, onTouchEnd, style }
}
