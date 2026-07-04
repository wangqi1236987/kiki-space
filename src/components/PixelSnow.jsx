import { useCallback, useEffect, useMemo, useRef } from 'react'
import {
  Color,
  Mesh,
  OrthographicCamera,
  PlaneGeometry,
  Scene,
  ShaderMaterial,
  Vector2,
  Vector3,
  WebGLRenderer
} from 'three'
import './PixelSnow.css'

const vertexShader = `
void main() {
  gl_Position = vec4(position, 1.0);
}
`

const fragmentShader = `
precision mediump float;

uniform float uTime;
uniform vec2 uResolution;
uniform float uFlakeSize;
uniform float uMinFlakeSize;
uniform float uPixelResolution;
uniform float uSpeed;
uniform float uDepthFade;
uniform float uFarPlane;
uniform vec3 uColor;
uniform float uBrightness;
uniform float uGamma;
uniform float uDensity;
uniform float uVariant;
uniform float uDirection;

#define PI 3.14159265
#define PI_OVER_6 0.5235988
#define PI_OVER_3 1.0471976
#define INV_SQRT3 0.57735027
#define M1 1597334677U
#define M2 3812015801U
#define M3 3299493293U
#define F0 2.3283064e-10

#define hash(n) (n * (n ^ (n >> 15)))
#define coord3(p) (uvec3(p).x * M1 ^ uvec3(p).y * M2 ^ uvec3(p).z * M3)

const vec3 camK = vec3(0.57735027, 0.57735027, 0.57735027);
const vec3 camI = vec3(0.70710678, 0.0, -0.70710678);
const vec3 camJ = vec3(-0.40824829, 0.81649658, -0.40824829);

const vec2 b1d = vec2(0.574, 0.819);

vec3 hash3(uint n) {
  uvec3 hashed = hash(n) * uvec3(1U, 511U, 262143U);
  return vec3(hashed) * F0;
}

float snowflakeDist(vec2 p) {
  float r = length(p);
  float a = atan(p.y, p.x);
  a = abs(mod(a + PI_OVER_6, PI_OVER_3) - PI_OVER_6);
  vec2 q = r * vec2(cos(a), sin(a));
  float dMain = max(abs(q.y), max(-q.x, q.x - 1.0));
  float b1t = clamp(dot(q - vec2(0.4, 0.0), b1d), 0.0, 0.4);
  float dB1 = length(q - vec2(0.4, 0.0) - b1t * b1d);
  float b2t = clamp(dot(q - vec2(0.7, 0.0), b1d), 0.0, 0.25);
  float dB2 = length(q - vec2(0.7, 0.0) - b2t * b1d);
  return min(dMain, min(dB1, dB2)) * 10.0;
}

void main() {
  float invPixelRes = 1.0 / uPixelResolution;
  float pixelSize = max(1.0, floor(0.5 + uResolution.x * invPixelRes));
  float invPixelSize = 1.0 / pixelSize;

  vec2 fragCoord = floor(gl_FragCoord.xy * invPixelSize);
  vec2 res = uResolution * invPixelSize;
  float invResX = 1.0 / res.x;

  vec3 ray = normalize(vec3((fragCoord - res * 0.5) * invResX, 1.0));
  ray = ray.x * camI + ray.y * camJ + ray.z * camK;

  float timeSpeed = uTime * uSpeed;
  float windX = cos(uDirection) * 0.4;
  float windY = sin(uDirection) * 0.4;
  vec3 camPos = (windX * camI + windY * camJ + 0.1 * camK) * timeSpeed;
  vec3 pos = camPos;

  vec3 absRay = max(abs(ray), vec3(0.001));
  vec3 strides = 1.0 / absRay;
  vec3 raySign = step(ray, vec3(0.0));
  vec3 phase = fract(pos) * strides;
  phase = mix(strides - phase, phase, raySign);

  float rayK = dot(ray, camK);
  float invRayK = 1.0 / max(abs(rayK), 0.001);
  float depthFadeScale = -uDepthFade * rayK;

  vec3 color = vec3(0.0);
  float transmittance = 1.0;
  float t = 0.0;
  float d = 0.0;

  for (int i = 0; i < 400; i++) {
    if (transmittance < 0.01 || t > uFarPlane) break;

    vec3 ip = floor(pos);
    vec3 fp = fract(pos);

    uint h = coord3(uvec3(ip));
    vec3 h1 = hash3(h);
    vec3 h2 = hash3(h + 1000000U);

    if (h1.z < uDensity) {
      float flakeScale = mix(0.3, 1.0, h2.z);
      float size = uFlakeSize * flakeScale;
      float minSize = uMinFlakeSize;

      vec3 localPos = pos - ip - h1;
      float planeDist = dot(localPos, camK);
      vec3 proj = localPos - planeDist * camK;
      float projX = dot(proj, camI);
      float projY = dot(proj, camJ);
      vec2 p = vec2(projX, projY);

      float dist;
      if (uVariant < 0.5) {
        dist = max(abs(p.x), abs(p.y));
      } else if (uVariant < 1.5) {
        dist = length(p);
      } else {
        dist = snowflakeDist(p);
      }

      float screenSize = size * uResolution.x * invPixelSize;
      float actualSize = max(screenSize, minSize * invPixelSize);
      float coverage = 1.0 - smoothstep(0.0, actualSize, dist);

      if (coverage > 0.001) {
        float depth = t * rayK;
        float fade = exp2(depth * depthFadeScale);
        float alpha = coverage * fade;
        vec3 flakeColor = uColor * (0.7 + 0.3 * h2.x) * uBrightness;
        color += flakeColor * alpha * transmittance;
        transmittance *= (1.0 - alpha);
      }
    }

    vec3 nextT = phase + t * strides;
    vec3 deltas = (floor(nextT) + 1.0 - phase) * (1.0 / strides) - t;
    float dt = min(deltas.x, min(deltas.y, deltas.z));
    t += max(dt, 0.001);
    d = t * invRayK;
    pos = camPos + d * ray;
  }

  color = max(color, vec3(0.0));
  color = pow(color, vec3(uGamma));
  gl_FragColor = vec4(color, 1.0 - transmittance);
}
`

export default function PixelSnow({
  color = '#ffffff',
  flakeSize = 0.01,
  minFlakeSize = 1.25,
  pixelResolution = 200,
  speed = 1.25,
  depthFade = 8,
  farPlane = 20,
  brightness = 1,
  gamma = 0.4545,
  density = 0.3,
  variant = 'square',
  direction = 125,
  className = '',
  style = {}
}) {
  const containerRef = useRef(null)
  const rendererRef = useRef(null)
  const materialRef = useRef(null)
  const animationRef = useRef(null)
  const resizeTimeoutRef = useRef(null)
  const isVisibleRef = useRef(true)

  const variantValue = useMemo(() => {
    switch (variant) {
      case 'round': return 1
      case 'snowflake': return 2
      default: return 0
    }
  }, [variant])

  const colorVector = useMemo(() => {
    const c = new Color(color)
    return new Vector3(c.r, c.g, c.b)
  }, [color])

  const handleResize = useCallback(() => {
    if (resizeTimeoutRef.current) {
      clearTimeout(resizeTimeoutRef.current)
    }
    resizeTimeoutRef.current = setTimeout(() => {
      const container = containerRef.current
      const renderer = rendererRef.current
      const material = materialRef.current
      if (!container || !renderer || !material) return

      const width = container.offsetWidth
      const height = container.offsetHeight
      renderer.setSize(width, height)
      material.uniforms.uResolution.value.set(width, height)
    }, 100)
  }, [])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting
      },
      { threshold: 0 }
    )
    observer.observe(container)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const scene = new Scene()
    const camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1)
    const renderer = new WebGLRenderer({
      antialias: false,
      alpha: true,
      premultipliedAlpha: false,
      powerPreference: 'high-performance',
      stencil: false,
      depth: false
    })

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(container.offsetWidth, container.offsetHeight)
    renderer.setClearColor(0x000000, 0)
    container.appendChild(renderer.domElement)
    rendererRef.current = renderer

    const material = new ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: new Vector2(container.offsetWidth, container.offsetHeight) },
        uFlakeSize: { value: flakeSize },
        uMinFlakeSize: { value: minFlakeSize },
        uPixelResolution: { value: pixelResolution },
        uSpeed: { value: speed },
        uDepthFade: { value: depthFade },
        uFarPlane: { value: farPlane },
        uColor: { value: colorVector.clone() },
        uBrightness: { value: brightness },
        uGamma: { value: gamma },
        uDensity: { value: density },
        uVariant: { value: variantValue },
        uDirection: { value: (direction * Math.PI) / 180 }
      },
      transparent: true
    })
    materialRef.current = material

    const geometry = new PlaneGeometry(2, 2)
    scene.add(new Mesh(geometry, material))

    window.addEventListener('resize', handleResize)

    const startTime = performance.now()
    const animate = () => {
      animationRef.current = requestAnimationFrame(animate)
      if (isVisibleRef.current) {
        material.uniforms.uTime.value = (performance.now() - startTime) * 0.001
        renderer.render(scene, camera)
      }
    }
    animate()

    return () => {
      cancelAnimationFrame(animationRef.current)
      window.removeEventListener('resize', handleResize)
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current)
      }
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
      renderer.dispose()
      renderer.forceContextLoss()
      geometry.dispose()
      material.dispose()
      rendererRef.current = null
      materialRef.current = null
    }
  }, [handleResize])

  useEffect(() => {
    const material = materialRef.current
    if (!material) return

    material.uniforms.uFlakeSize.value = flakeSize
    material.uniforms.uMinFlakeSize.value = minFlakeSize
    material.uniforms.uPixelResolution.value = pixelResolution
    material.uniforms.uSpeed.value = speed
    material.uniforms.uDepthFade.value = depthFade
    material.uniforms.uFarPlane.value = farPlane
    material.uniforms.uBrightness.value = brightness
    material.uniforms.uGamma.value = gamma
    material.uniforms.uDensity.value = density
    material.uniforms.uVariant.value = variantValue
    material.uniforms.uDirection.value = (direction * Math.PI) / 180
    material.uniforms.uColor.value.copy(colorVector)
  }, [
    flakeSize, minFlakeSize, pixelResolution, speed, depthFade, farPlane,
    brightness, gamma, density, variantValue, direction, colorVector
  ])

  return <div ref={containerRef} className={`pixel-snow-container ${className}`} style={style} />
}
