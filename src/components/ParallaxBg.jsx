import { useEffect, useRef } from 'react'
import './ParallaxBg.css'

export default function ParallaxBg() {
  const bgRef = useRef(null)
  const rafRef = useRef(null)
  const scrollRef = useRef(0)
  const targetScrollRef = useRef(0)

  useEffect(() => {
    const handleScroll = () => {
      targetScrollRef.current = window.scrollY
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    const animate = () => {
      const ease = 0.08
      scrollRef.current += (targetScrollRef.current - scrollRef.current) * ease

      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrollProgress = docHeight > 0 ? scrollRef.current / docHeight : 0

      const moveY = scrollProgress * 30

      if (bgRef.current) {
        bgRef.current.style.transform = `translateY(${moveY}%) scale(1.15)`
      }

      rafRef.current = requestAnimationFrame(animate)
    }

    rafRef.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return (
    <div className="parallax-bg">
      <div
        ref={bgRef}
        className="parallax-bg__layer"
        style={{
          backgroundImage: 'url(/images/bg-mountain.png)',
        }}
      />
    </div>
  )
}
