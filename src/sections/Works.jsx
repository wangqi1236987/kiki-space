import { useRef, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import ScrollStack, { ScrollStackItem } from '../components/ScrollStack'
import './Works.css'

const allWorks = [
  {
    id: 1,
    type: 'video',
    title: '梦境重构',
    subtitle: 'AI 概念视频',
    color: 'linear-gradient(180deg, #e85d5d 0%, #c73e3e 100%)',
    image: '/images/微信图片_20260704165629_143_2.jpg',
    src: '/videos/微信视频2026-07-04_164753_242.mp4',
  },
  {
    id: 2,
    type: 'image',
    title: '光之语',
    subtitle: '品牌视觉海报',
    color: 'linear-gradient(180deg, #4a6fa5 0%, #2e4a6f 100%)',
    image: '/images/微信图片_20260704165630_144_2.jpg',
    src: '/images/微信图片_20260704165630_144_2.jpg',
  },
  {
    id: 3,
    type: 'image',
    title: '城市呼吸',
    subtitle: 'AI 艺术海报',
    color: 'linear-gradient(180deg, #5a9e5a 0%, #3d7a3d 100%)',
    image: '/images/微信图片_20260704165631_145_2.jpg',
    src: '/images/微信图片_20260704165631_145_2.jpg',
  },
  {
    id: 4,
    type: 'video',
    title: '时间切片',
    subtitle: '动态视觉设计',
    color: 'linear-gradient(180deg, #6b5b95 0%, #4a3f6b 100%)',
    image: '/images/微信图片_20260704165632_146_2.jpg',
    src: '/videos/微信视频2026-07-04_164753_242.mp4',
  },
  {
    id: 5,
    type: 'image',
    title: '星云漫步',
    subtitle: '概念艺术',
    color: 'linear-gradient(180deg, #d4a574 0%, #b08050 100%)',
    image: '/images/微信图片_20260704165633_147_2.jpg',
    src: '/images/微信图片_20260704165633_147_2.jpg',
  },
  {
    id: 6,
    type: 'image',
    title: '情绪色谱',
    subtitle: '实验性海报',
    color: 'linear-gradient(180deg, #5a8fa8 0%, #3d6b82 100%)',
    image: '/images/微信图片_20260704165635_148_2.jpg',
    src: '/images/微信图片_20260704165635_148_2.jpg',
  },
]

export default function Works() {
  const [lightbox, setLightbox] = useState(null)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section className="works" id="works">
      <div className="works__inner">
        <div className="works__header" ref={ref}>
          <motion.span
            className="works__label"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            作品案例
          </motion.span>
          <motion.h2
            className="works__title"
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            创意无界，<span className="works__title-accent">想象有形</span>
          </motion.h2>
        </div>

        <motion.div
          className="works__stack-wrap"
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <ScrollStack
            itemDistance={80}
            itemScale={0.04}
            itemStackDistance={40}
            stackPosition="25%"
            scaleEndPosition="15%"
            baseScale={0.82}
            rotationAmount={2}
            blurAmount={1}
          >
            {allWorks.map((work) => (
              <ScrollStackItem key={work.id}>
                <div
                  className="stack-card"
                  style={{ background: work.color }}
                  onClick={() => setLightbox(work)}
                >
                  <div className="stack-card__image-wrap">
                    <img
                      src={work.image}
                      alt={work.title}
                      className="stack-card__image"
                    />
                  </div>
                  <div className="stack-card__text">
                    <h3 className="stack-card__title">{work.title}</h3>
                    <span className="stack-card__subtitle">{work.subtitle}</span>
                  </div>
                </div>
              </ScrollStackItem>
            ))}
          </ScrollStack>
        </motion.div>
      </div>

      <AnimatePresence>
        {lightbox && (
          <motion.div
            className="lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightbox(null)}
          >
            <motion.div
              className="lightbox__content"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="lightbox__close"
                onClick={() => setLightbox(null)}
                aria-label="关闭"
              >
                ×
              </button>
              {lightbox.type === 'video' ? (
                <video src={lightbox.src} controls autoPlay className="lightbox__media" />
              ) : (
                <img src={lightbox.src} alt={lightbox.title} className="lightbox__media" />
              )}
              <div className="lightbox__info">
                <h3 className="lightbox__title">{lightbox.title}</h3>
                <span className="lightbox__subtitle">{lightbox.subtitle}</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
