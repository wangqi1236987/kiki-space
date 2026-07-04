import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import './Hero.css'

export default function Hero() {
  const videoRef = useRef(null)
  const [videoLoaded, setVideoLoaded] = useState(false)

  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    const onLoaded = () => setVideoLoaded(true)
    v.addEventListener('loadeddata', onLoaded)
    if (v.readyState >= 3) setVideoLoaded(true)
    return () => v.removeEventListener('loadeddata', onLoaded)
  }, [])

  const scrollToAbout = () => {
    const el = document.querySelector('#about')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="hero" id="hero">
      <div className="hero__video-wrap">
        <video
          ref={videoRef}
          className={`hero__video ${videoLoaded ? 'hero__video--loaded' : ''}`}
          autoPlay
          muted
          loop
          playsInline
          poster="/images/微信图片_20260704165635_149_2.jpg"
        >
          <source src="/videos/微信视频2026-07-04_164753_242.mp4" type="video/mp4" />
        </video>
        <div className="hero__video-overlay" />
      </div>

      <div className="hero__content">
        <motion.div
          className="hero__tag"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <span className="hero__tag-dot" />
          AI 设计师
        </motion.div>

        <motion.h1
          className="hero__title"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="hero__title-line">kiki's</span>
          <span className="hero__title-line hero__title-line--accent">space</span>
        </motion.h1>

        <motion.p
          className="hero__subtitle"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.8 }}
        >
          在算法与直觉的交汇处，创造有温度的视觉语言
        </motion.p>

        <motion.div
          className="hero__cta"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.1 }}
        >
          <a href="#works" className="hero__btn hero__btn--primary" onClick={(e) => {
            e.preventDefault()
            document.querySelector('#works')?.scrollIntoView({ behavior: 'smooth' })
          }}>
            探索作品
          </a>
          <a href="#about" className="hero__btn hero__btn--ghost" onClick={(e) => {
            e.preventDefault()
            document.querySelector('#about')?.scrollIntoView({ behavior: 'smooth' })
          }}>
            了解更多
          </a>
        </motion.div>
      </div>

      <motion.button
        className="hero__scroll"
        onClick={scrollToAbout}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
        aria-label="向下滚动"
      >
        <ChevronDown size={20} />
      </motion.button>
    </section>
  )
}
