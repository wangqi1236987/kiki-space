import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Phone, Mail, MapPin, Send, ArrowUpRight } from 'lucide-react'
import './Contact.css'

const contacts = [
  {
    icon: Phone,
    label: '电话',
    value: '+86 138 0000 0000',
    href: 'tel:+8613800000000',
  },
  {
    icon: Mail,
    label: '邮箱',
    value: 'hello@kikispace.design',
    href: 'mailto:hello@kikispace.design',
  },
  {
    icon: MapPin,
    label: '坐标',
    value: '中国 · 上海',
    href: null,
  },
]

export default function Contact() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section className="contact" id="contact">
      <div className="section-container">
        <div className="contact__header" ref={ref}>
          <motion.span
            className="contact__label"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            联系方式
          </motion.span>
          <motion.h2
            className="contact__title"
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            开启合作，<span className="contact__title-accent">共创未来</span>
          </motion.h2>
          <motion.p
            className="contact__desc"
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            无论是品牌视觉、AI 艺术创作还是动态设计，期待与你碰撞出新的火花
          </motion.p>
        </div>

        <div className="contact__grid">
          {contacts.map((item, i) => (
            <ContactCard key={item.label} {...item} index={i} inView={inView} />
          ))}
        </div>

        <motion.div
          className="contact__cta"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.5 }}
        >
          <a href="mailto:hello@kikispace.design" className="contact__cta-btn">
            <Send size={18} />
            发送邮件
            <ArrowUpRight size={16} />
          </a>
        </motion.div>
      </div>

      <footer className="footer">
        <div className="section-container">
          <div className="footer__inner">
            <div className="footer__brand">
              <span className="footer__logo">kiki's space</span>
              <span className="footer__dot" />
            </div>
            <p className="footer__copy">
              © 2026 kiki's space. 用热爱浇灌每一个像素。
            </p>
          </div>
        </div>
      </footer>
    </section>
  )
}

function ContactCard({ icon: Icon, label, value, href, index, inView }) {
  const Wrapper = href ? 'a' : 'div'
  const props = href ? { href } : {}

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
    >
      <Wrapper {...props} className={`contact-card glass ${href ? 'contact-card--link' : ''}`}>
        <div className="contact-card__icon">
          <Icon size={22} strokeWidth={1.5} />
        </div>
        <span className="contact-card__label">{label}</span>
        <span className="contact-card__value">{value}</span>
        {href && (
          <span className="contact-card__arrow">
            <ArrowUpRight size={16} />
          </span>
        )}
      </Wrapper>
    </motion.div>
  )
}
