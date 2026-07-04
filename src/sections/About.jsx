import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Sparkles, Brain, Palette, Zap } from 'lucide-react'
import './About.css'

const skills = [
  {
    icon: Sparkles,
    title: 'AI 视觉生成',
    desc: '运用 Midjourney、Stable Diffusion 等工具，将抽象概念转化为惊艳视觉。',
  },
  {
    icon: Brain,
    title: '智能设计系统',
    desc: '构建可扩展的设计语言，让品牌在不同媒介中保持一致的视觉表达。',
  },
  {
    icon: Palette,
    title: '品牌视觉塑造',
    desc: '从色彩心理学到排版节奏，打造具有辨识度和情感共鸣的品牌形象。',
  },
  {
    icon: Zap,
    title: '动态交互设计',
    desc: '将静态设计注入生命力，通过动效与交互创造沉浸式的用户体验。',
  },
]

export default function About() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section className="about" id="about">
      <div className="section-container">
        <div className="about__header" ref={ref}>
          <motion.span
            className="about__label"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            关于我
          </motion.span>
          <motion.h2
            className="about__title"
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            用算法写诗，<br />让代码有温度
          </motion.h2>
          <motion.p
            className="about__desc"
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            我是 kiki，一名专注于 AI 辅助创作的视觉设计师。我相信技术不是冰冷的工具，
            而是延伸想象力的画笔。在数字与艺术的边界，我探索着人机协作的无限可能——
            让每一帧画面都承载情感，让每一个像素都有故事。
          </motion.p>
        </div>

        <div className="about__skills">
          {skills.map((skill, i) => (
            <SkillCard key={skill.title} {...skill} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}

function SkillCard({ icon: Icon, title, desc, index }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <motion.div
      ref={ref}
      className="skill-card glass"
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.12 }}
      whileHover={{ y: -6, transition: { duration: 0.3 } }}
    >
      <div className="skill-card__icon">
        <Icon size={24} strokeWidth={1.5} />
      </div>
      <h3 className="skill-card__title">{title}</h3>
      <p className="skill-card__desc">{desc}</p>
    </motion.div>
  )
}
