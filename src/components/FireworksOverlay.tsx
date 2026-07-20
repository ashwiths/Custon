import { useEffect, useRef, useImperativeHandle, forwardRef, useCallback } from "react"

export interface FireworksOverlayRef {
  triggerBurst: (x?: number, y?: number, count?: number) => void
  triggerRocket: (originX?: number, targetX?: number, targetY?: number) => void
  triggerFinale: () => void
}

interface Particle {
  x: number
  y: number
  px: number
  py: number
  vx: number
  vy: number
  alpha: number
  decay: number
  color: string
  size: number
  gravity: number
  friction: number
}

interface Rocket {
  x: number
  y: number
  px: number
  py: number
  vx: number
  vy: number
  targetY: number
  color: string
}

// App Theme Matched Color Palettes (Copper, Terracotta, Rose Gold, Warm Gold, Warm White)
const THEME_PALETTES = [
  ["#A67165", "#C98D74", "#F2D8C2", "#FFD700", "#FFFFFF"], // Rose Gold & Copper Signature
  ["#E09F67", "#D97757", "#B85B42", "#FFC107", "#FFF8F0"], // Terracotta & Warm Amber
  ["#C98D74", "#A67165", "#734E46", "#F2D8C2", "#FFFFFF"], // Warm Metallic Copper
]

const MAX_PARTICLES = 180 // Particle cap for smooth 60fps quad bursts

export const FireworksOverlay = forwardRef<FireworksOverlayRef, { className?: string }>(
  ({ className = "" }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null)
    const particlesRef = useRef<Particle[]>([])
    const rocketsRef = useRef<Rocket[]>([])
    const animFrameRef = useRef<number | null>(null)

    const createBurst = useCallback((centerX: number, centerY: number, count = 35) => {
      const palette = THEME_PALETTES[Math.floor(Math.random() * THEME_PALETTES.length)]
      const isRing = Math.random() < 0.2
      const isWillow = Math.random() < 0.25

      const newParticles: Particle[] = []
      const particleCount = Math.min(count, 45)

      for (let i = 0; i < particleCount; i++) {
        let angle: number
        let speed: number

        if (isRing) {
          angle = (i / particleCount) * Math.PI * 2
          speed = 3.5 + Math.random() * 1.2
        } else {
          angle = Math.random() * Math.PI * 2
          speed = Math.random() * 5.5 + 1.2
        }

        const color = palette[Math.floor(Math.random() * palette.length)]
        const size = Math.random() * 2 + 1.2

        newParticles.push({
          x: centerX,
          y: centerY,
          px: centerX,
          py: centerY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          alpha: 1,
          decay: isWillow ? Math.random() * 0.009 + 0.006 : Math.random() * 0.02 + 0.015,
          color,
          size,
          gravity: isWillow ? 0.04 : 0.07,
          friction: isWillow ? 0.98 : 0.96,
        })
      }

      // Append new particles and enforce hard particle cap to prevent any lag
      particlesRef.current.push(...newParticles)
      if (particlesRef.current.length > MAX_PARTICLES) {
        particlesRef.current = particlesRef.current.slice(-MAX_PARTICLES)
      }
    }, [])

    const launchRocket = useCallback(
      (originX?: number, targetX?: number, targetY?: number) => {
        const width = window.innerWidth
        const height = window.innerHeight

        const startX = originX ?? Math.random() * (width * 0.8) + width * 0.1
        const endX = targetX ?? startX + (Math.random() - 0.5) * 100
        const endY = targetY ?? Math.random() * (height * 0.35) + height * 0.15

        const distanceY = height - endY
        const vy = -Math.sqrt(2 * 0.1 * distanceY) * (0.95 + Math.random() * 0.1)
        const timeToApex = Math.abs(vy / 0.1)
        const vx = (endX - startX) / (timeToApex || 1)

        rocketsRef.current.push({
          x: startX,
          y: height,
          px: startX,
          py: height,
          vx,
          vy,
          targetY: endY,
          color: "#F2D8C2",
        })
      },
      []
    )

    const triggerFinale = useCallback(() => {
      const width = window.innerWidth
      const height = window.innerHeight

      for (let i = 0; i < 5; i++) {
        setTimeout(() => {
          const rx = Math.random() * (width * 0.7) + width * 0.15
          const ry = Math.random() * (height * 0.4) + height * 0.15
          createBurst(rx, ry, 35)
        }, i * 200)
      }
    }, [createBurst])

    useImperativeHandle(ref, () => ({
      triggerBurst: (x, y, count) => {
        const targetX = x ?? window.innerWidth / 2
        const targetY = y ?? window.innerHeight * 0.35
        createBurst(targetX, targetY, count)
      },
      triggerRocket: (originX, targetX, targetY) => {
        launchRocket(originX, targetX, targetY)
      },
      triggerFinale: () => {
        triggerFinale()
      },
    }))

    // Global Event Listener for loose triggers across the application
    useEffect(() => {
      const handleGlobalTrigger = (e: Event) => {
        const customEvt = e as CustomEvent<{ x?: number; y?: number; targetX?: number; targetY?: number; count?: number; rocket?: boolean }>
        const detail = customEvt.detail || {}
        if (detail.rocket) {
          launchRocket(detail.x, detail.targetX ?? detail.x, detail.targetY ?? detail.y)
        } else {
          const x = detail.x ?? Math.random() * (window.innerWidth * 0.7) + window.innerWidth * 0.15
          const y = detail.y ?? Math.random() * (window.innerHeight * 0.4) + window.innerHeight * 0.15
          createBurst(x, y, detail.count ?? 35)
        }
      }

      window.addEventListener("fireworks-burst", handleGlobalTrigger)
      return () => {
        window.removeEventListener("fireworks-burst", handleGlobalTrigger)
      }
    }, [createBurst, launchRocket])

    // High performance 60fps Canvas render loop
    useEffect(() => {
      const canvas = canvasRef.current
      if (!canvas) return
      const ctx = canvas.getContext("2d", { alpha: true })
      if (!ctx) return

      const handleResize = () => {
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
      }

      handleResize()
      window.addEventListener("resize", handleResize)

      const loop = () => {
        // Fast alpha clear without laggy shadow filters
        ctx.globalCompositeOperation = "destination-out"
        ctx.fillStyle = "rgba(0, 0, 0, 0.22)"
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.globalCompositeOperation = "lighter"

        // Render Rockets
        for (let i = rocketsRef.current.length - 1; i >= 0; i--) {
          const r = rocketsRef.current[i]
          r.px = r.x
          r.py = r.y

          r.x += r.vx
          r.y += r.vy
          r.vy += 0.09

          ctx.beginPath()
          ctx.moveTo(r.px, r.py)
          ctx.lineTo(r.x, r.y)
          ctx.strokeStyle = "rgba(242, 216, 194, 0.75)"
          ctx.lineWidth = 2
          ctx.stroke()

          if (r.vy >= -0.5 || r.y <= r.targetY) {
            createBurst(r.x, r.y, 35)
            rocketsRef.current.splice(i, 1)
          }
        }

        // Render Particles (High-speed single line segment trail per frame)
        const particles = particlesRef.current
        for (let i = particles.length - 1; i >= 0; i--) {
          const p = particles[i]

          p.px = p.x
          p.py = p.y

          p.vx *= p.friction
          p.vy *= p.friction
          p.vy += p.gravity
          p.x += p.vx
          p.y += p.vy
          p.alpha -= p.decay

          if (p.alpha <= 0) {
            particles.splice(i, 1)
            continue
          }

          // Draw trail line from previous to current position (butter smooth & zero allocation)
          ctx.beginPath()
          ctx.moveTo(p.px, p.py)
          ctx.lineTo(p.x, p.y)
          ctx.strokeStyle = p.color
          ctx.globalAlpha = Math.max(0, p.alpha)
          ctx.lineWidth = p.size
          ctx.stroke()
        }

        ctx.globalAlpha = 1
        animFrameRef.current = requestAnimationFrame(loop)
      }

      animFrameRef.current = requestAnimationFrame(loop)

      return () => {
        window.removeEventListener("resize", handleResize)
        if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
      }
    }, [createBurst])

    return (
      <canvas
        ref={canvasRef}
        className={`fixed inset-0 pointer-events-none z-50 ${className}`}
        style={{ width: "100vw", height: "100vh" }}
      />
    )
  }
)

FireworksOverlay.displayName = "FireworksOverlay"

/**
 * Utility function to dispatch a firework explosion from anywhere in the application
 */
export function fireworkBurst(options?: { x?: number; y?: number; targetX?: number; targetY?: number; count?: number; rocket?: boolean }) {
  window.dispatchEvent(new CustomEvent("fireworks-burst", { detail: options }))
}
