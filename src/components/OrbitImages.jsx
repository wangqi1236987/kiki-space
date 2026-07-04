import { useMemo, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { motion, useMotionValue, animate } from 'framer-motion'
import './OrbitImages.css'

function generateEllipsePath(cx, cy, rx, ry) {
  return `M ${cx - rx} ${cy} A ${rx} ${ry} 0 1 0 ${cx + rx} ${cy} A ${rx} ${ry} 0 1 0 ${cx - rx} ${cy}`
}

function generateCirclePath(cx, cy, r) {
  return generateEllipsePath(cx, cy, r, r)
}

function generateSquarePath(cx, cy, size) {
  const h = size / 2
  return `M ${cx - h} ${cy - h} L ${cx + h} ${cy - h} L ${cx + h} ${cy + h} L ${cx - h} ${cy + h} Z`
}

function generateRectanglePath(cx, cy, w, h) {
  const hw = w / 2
  const hh = h / 2
  return `M ${cx - hw} ${cy - hh} L ${cx + hw} ${cy - hh} L ${cx + hw} ${cy + hh} L ${cx - hw} ${cy + hh} Z`
}

function generateTrianglePath(cx, cy, size) {
  const height = (size * Math.sqrt(3)) / 2
  const hs = size / 2
  return `M ${cx} ${cy - height / 1.5} L ${cx + hs} ${cy + height / 3} L ${cx - hs} ${cy + height / 3} Z`
}

function generateStarPath(cx, cy, outerR, innerR, points) {
  const step = Math.PI / points
  let path = ''
  for (let i = 0; i < 2 * points; i++) {
    const r = i % 2 === 0 ? outerR : innerR
    const angle = i * step - Math.PI / 2
    const x = cx + r * Math.cos(angle)
    const y = cy + r * Math.sin(angle)
    path += i === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`
  }
  return path + ' Z'
}

function generateHeartPath(cx, cy, size) {
  const s = size / 30
  return `M ${cx} ${cy + 12 * s} C ${cx - 20 * s} ${cy - 5 * s}, ${cx - 12 * s} ${cy - 18 * s}, ${cx} ${cy - 8 * s} C ${cx + 12 * s} ${cy - 18 * s}, ${cx + 20 * s} ${cy - 5 * s}, ${cx} ${cy + 12 * s}`
}

function generateInfinityPath(cx, cy, w, h) {
  const hw = w / 2
  const hh = h / 2
  return `M ${cx - hw} ${cy} C ${cx - hw} ${cy - hh} ${cx} ${cy - hh} ${cx} ${cy} C ${cx} ${cy + hh} ${cx + hw} ${cy + hh} ${cx + hw} ${cy} C ${cx + hw} ${cy - hh} ${cx} ${cy - hh} ${cx} ${cy} C ${cx} ${cy + hh} ${cx - hw} ${cy + hh} ${cx - hw} ${cy}`
}

function generateWavePath(cx, cy, w, h, cycles) {
  const hw = w / 2
  const points = []
  const steps = 100
  for (let i = 0; i <= steps; i++) {
    const t = i / steps
    const x = cx - hw + t * w
    const y = cy + Math.sin(t * Math.PI * 2 * cycles) * h
    points.push(`${x} ${y}`)
  }
  return `M ${points.join(' L ')}`
}

function getPathPoint(pathElement, progress) {
  const len = pathElement.getTotalLength()
  return pathElement.getPointAtLength((progress % 1) * len)
}

function OrbitItem({ item, index, totalItems, path, itemSize, rotation, progress, fill, onClick }) {
  const itemRef = useRef(null)
  const pathRef = useRef(null)
  const [pos, setPos] = useState({ x: 0, y: 0 })

  const offset = fill ? index / totalItems : 0

  useEffect(() => {
    if (!pathRef.current) {
      const svgNS = 'http://www.w3.org/2000/svg'
      const svg = document.createElementNS(svgNS, 'svg')
      const pathEl = document.createElementNS(svgNS, 'path')
      pathEl.setAttribute('d', path)
      svg.appendChild(pathEl)
      document.body.appendChild(svg)
      pathRef.current = pathEl
      return () => svg.remove()
    }
  }, [path])

  useEffect(() => {
    return progress.on('change', (latest) => {
      if (!pathRef.current) return
      const currentProgress = ((latest / 100 + offset) % 1 + 1) % 1
      const point = getPathPoint(pathRef.current, currentProgress)
      setPos({ x: point.x, y: point.y })
    })
  }, [progress, offset])

  return (
    <div
      ref={itemRef}
      className="orbit-item"
      style={{
        width: itemSize,
        height: itemSize,
        left: pos.x - itemSize / 2,
        top: pos.y - itemSize / 2,
        transform: `rotate(${-rotation}deg)`,
      }}
      onClick={(e) => {
        e.stopPropagation()
        onClick && onClick(index)
      }}
    >
      {item}
    </div>
  )
}

export default function OrbitImages({
  images = [],
  altPrefix = 'Orbiting image',
  shape = 'ellipse',
  customPath = undefined,
  baseWidth = 1400,
  radiusX = 700,
  radiusY = 170,
  radius = 300,
  starPoints = 5,
  starInnerRatio = 0.5,
  rotation = -8,
  duration = 40,
  itemSize = 64,
  direction = 'normal',
  fill = true,
  width = '100%',
  height = 'auto',
  className = '',
  showPath = false,
  pathColor = 'rgba(0,0,0,0.1)',
  pathWidth = 2,
  easing = 'linear',
  paused = false,
  centerContent = undefined,
  responsive = false,
  onImageClick = undefined,
}) {
  const containerRef = useRef(null)
  const [scale, setScale] = useState(null)

  const designCenterX = baseWidth / 2
  const designCenterY = baseWidth / 2

  const path = useMemo(() => {
    switch (shape) {
      case 'ellipse':
        return generateEllipsePath(designCenterX, designCenterY, radiusX, radiusY)
      case 'circle':
        return generateCirclePath(designCenterX, designCenterY, radius)
      case 'square':
        return generateSquarePath(designCenterX, designCenterY, radius * 2)
      case 'rectangle':
        return generateRectanglePath(designCenterX, designCenterY, radiusX * 2, radiusY * 2)
      case 'triangle':
        return generateTrianglePath(designCenterX, designCenterY, radius * 2)
      case 'star':
        return generateStarPath(designCenterX, designCenterY, radius, radius * starInnerRatio, starPoints)
      case 'heart':
        return generateHeartPath(designCenterX, designCenterY, radius * 2)
      case 'infinity':
        return generateInfinityPath(designCenterX, designCenterY, radiusX * 2, radiusY * 2)
      case 'wave':
        return generateWavePath(designCenterX, designCenterY, radiusX * 2, radiusY, 3)
      case 'custom':
        return customPath || generateCirclePath(designCenterX, designCenterY, radius)
      default:
        return generateEllipsePath(designCenterX, designCenterY, radiusX, radiusY)
    }
  }, [shape, customPath, designCenterX, designCenterY, radiusX, radiusY, radius, starPoints, starInnerRatio])

  useLayoutEffect(() => {
    if (!responsive || !containerRef.current) return
    const updateScale = () => {
      if (!containerRef.current) return
      setScale(containerRef.current.clientWidth / baseWidth)
    }
    updateScale()
    const observer = new ResizeObserver(updateScale)
    observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [responsive, baseWidth])

  const progress = useMotionValue(0)

  useEffect(() => {
    if (paused) return
    const controls = animate(progress, direction === 'reverse' ? -100 : 100, {
      duration,
      ease: easing,
      repeat: Infinity,
      repeatType: 'loop',
    })
    return () => controls.stop()
  }, [progress, duration, easing, direction, paused])

  const containerWidth = responsive ? '100%' : (typeof width === 'number' ? width : '100%')
  const containerHeight = responsive ? 'auto' : (typeof height === 'number' ? height : (typeof width === 'number' ? width : 'auto'))

  const items = images.map((src, index) => (
    <img
      key={src}
      src={src}
      alt={`${altPrefix} ${index + 1}`}
      draggable={false}
      className="orbit-image"
    />
  ))

  return (
    <div
      ref={containerRef}
      className={`orbit-container ${className}`}
      style={{
        width: containerWidth,
        height: containerHeight,
        aspectRatio: responsive ? '1 / 1' : undefined,
      }}
      aria-hidden="true"
    >
      <div
        className={responsive ? 'orbit-scaling-container orbit-scaling-container--responsive' : 'orbit-scaling-container'}
        style={{
          width: responsive ? baseWidth : '100%',
          height: responsive ? baseWidth : '100%',
          transform: responsive && scale !== null ? `translate(-50%, -50%) scale(${scale})` : undefined,
          visibility: responsive && scale === null ? 'hidden' : undefined,
        }}
      >
        <div
          className="orbit-rotation-wrapper"
          style={{ transform: `rotate(${rotation}deg)` }}
        >
          {showPath && (
            <svg
              width="100%"
              height="100%"
              viewBox={`0 0 ${baseWidth} ${baseWidth}`}
              className="orbit-path-svg"
            >
              <path d={path} fill="none" stroke={pathColor} strokeWidth={pathWidth / (scale ?? 1)} />
            </svg>
          )}

          {items.map((item, index) => (
            <OrbitItem
              key={index}
              item={item}
              index={index}
              totalItems={items.length}
              path={path}
              itemSize={itemSize}
              rotation={rotation}
              progress={progress}
              fill={fill}
              onClick={onImageClick}
            />
          ))}
        </div>
      </div>

      {centerContent && (
        <div className="orbit-center-content">
          {centerContent}
        </div>
      )}
    </div>
  )
}
