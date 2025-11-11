'use client'

import { useState, useRef, useEffect } from 'react'
import { SessionCard, SessionCardProps } from './SessionCard'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface SessionCarouselProps {
  sessions: SessionCardProps[]
  variant?: 'default' | 'clean'
}

export function SessionCarousel({ sessions, variant = 'default' }: SessionCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
    }
  }

  useEffect(() => {
    checkScroll()
    window.addEventListener('resize', checkScroll)
    return () => window.removeEventListener('resize', checkScroll)
  }, [sessions])

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 350
      const newScrollLeft =
        direction === 'left'
          ? scrollRef.current.scrollLeft - scrollAmount
          : scrollRef.current.scrollLeft + scrollAmount

      scrollRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth',
      })

      setTimeout(checkScroll, 300)
    }
  }

  if (sessions.length === 0) {
    return null
  }

  return (
    <div className="relative">
      {/* Navigation Buttons - Desktop only */}
      {canScrollLeft && (
        <button
          onClick={() => scroll('left')}
          className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-16 z-10 w-10 h-10 items-center justify-center rounded-full bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:shadow-md transition-all duration-300"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      )}

      {canScrollRight && (
        <button
          onClick={() => scroll('right')}
          className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-16 z-10 w-10 h-10 items-center justify-center rounded-full bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:shadow-md transition-all duration-300"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      )}

      {/* Carousel */}
      <div
        ref={scrollRef}
        onScroll={checkScroll}
        className="flex gap-6 overflow-x-auto scrollbar-hide pb-4 scroll-smooth"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {sessions.map((session) => (
          <div key={session._id} className="flex-shrink-0 w-80">
            <SessionCard {...session} />
          </div>
        ))}
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  )
}
