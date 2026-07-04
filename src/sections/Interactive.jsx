import { useRef, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import OrbitImages from '../components/OrbitImages'
import './Interactive.css'

const images = [
  { src: '/images/微信图片_20260704165629_143_2.jpg', type: 'image', title: '梦境重构' },
  { src: '/images/微信图片_20260704165630_144_2.jpg', type: 'image', title: '光之语' },
  { src: '/images/微信图片_20260704165631_145_2.jpg', type: 'image', title: '城市呼吸' },
  { src: '/images/微信图片_20260704165632_146_2.jpg', type: 'image', title: '时间切片' },
  { src: '/images/微信图片_20260704165633_147_2.jpg', type: 'image', title: '星云漫步' },
  { src: '/images/微信图片_20260704165635_148_2.jpg', type: 'image', title: '情绪色谱' },
  { src: '/images/微信图片_20260704165635_149_2.jpg', type: 'image', title: '光影交织' },
  { src: '/images/微信图片_20260704165637_150_2.jpg', type: 'image', title: '数字花园' },
]

export default function Interactive() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const [lightbox, setLightbox] = useState(null)

  const imageUrls = images.map((img) => img.src)

  const handleImageClick = (index) => {
    setLightbox(images[index])
  }

  return (
    <section className="interactive" id="interactive">
      <div className="section-container">
        <div className="interactive__header" ref={ref}>
          <motion.span
            className="interactive__label"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            互动体验
          </motion.span>
          <motion.h2
            className="interactive__title"
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            触碰灵感，<span className="interactive__title-accent">感受创造</span>
          </motion.h2>
          <motion.p
            className="interactive__desc"
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            点击轨道上的作品，探索每一个细节
          </motion.p>
        </div>

        <motion.div
          className="interactive__orbit-wrap"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.35 }}
        >
          <OrbitImages
            images={imageUrls}
            shape="ellipse"
            radiusX={380}
            radiusY={100}
            rotation={-6}
            duration={35}
            itemSize={90}
            responsive={true}
            onImageClick={handleImageClick}
            centerContent={
              <div className="interactive__center">
                <span className="interactive__center-text">kiki&apos;s</span>
                <span className="interactive__center-sub">space</span>
              </div>
            }
          />
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
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
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
              <img
                src={lightbox.src}
                alt={lightbox.title}
                className="lightbox__media"
              />
              <div className="lightbox__info">
                <h3 className="lightbox__title">{lightbox.title}</h3>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
