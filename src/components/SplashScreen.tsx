import React, { useEffect, useState, useRef } from "react"
import logoIcon from "@/assets/logo_icon.png"

interface SplashScreenProps {
  onComplete: () => void
}

const STATUS_STEPS = [
  { threshold: 0, text: "INITIALIZING ENGINE..." },
  { threshold: 25, text: "LOADING HOTKEY MANAGER..." },
  { threshold: 55, text: "CONFIGURING TARGET SHORTCUTS..." },
  { threshold: 85, text: "OPTIMIZING SYSTEM ENVIRONMENT..." },
  { threshold: 98, text: "SYSTEM READY" },
]

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [displayProgress, setDisplayProgress] = useState(0)
  const [statusText, setStatusText] = useState(STATUS_STEPS[0].text)
  const [isExiting, setIsExiting] = useState(false)
  const lastProgressRef = useRef(0)

  useEffect(() => {
    const startTime = performance.now()
    const duration = 200 // Ultra-fast 200ms launch experience

    let animationFrameId: number

    const tick = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const rawProgress = Math.min(100, Math.floor((elapsed / duration) * 100))

      // Smooth power curve for progress percentage
      const eased = Math.min(100, Math.round(100 * Math.pow(rawProgress / 100, 0.85)))

      // Throttle React state updates to integer changes to keep frame rate high
      if (eased !== lastProgressRef.current) {
        lastProgressRef.current = eased
        setDisplayProgress(eased)

        // Find matching status step text
        for (let i = STATUS_STEPS.length - 1; i >= 0; i--) {
          if (eased >= STATUS_STEPS[i].threshold) {
            setStatusText(STATUS_STEPS[i].text)
            break
          }
        }
      }

      if (elapsed < duration) {
        animationFrameId = requestAnimationFrame(tick)
      } else {
        setDisplayProgress(100)
        setStatusText("SYSTEM READY")
        
        // Instant curtain exit
        setTimeout(() => {
          setIsExiting(true)
          setTimeout(() => {
            onComplete()
          }, 150) // 150ms smooth fade exit
        }, 50)
      }
    }

    animationFrameId = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(animationFrameId)
    }
  }, [onComplete])

  return (
    <div
      className="fixed inset-0 z-[99999] flex flex-col items-center justify-center select-none overflow-hidden"
      style={{
        backgroundColor: "#121013",
        transition: "opacity 350ms cubic-bezier(0.16, 1, 0.3, 1), transform 350ms cubic-bezier(0.16, 1, 0.3, 1)",
        opacity: isExiting ? 0 : 1,
        transform: isExiting ? "scale(1.03) translate3d(0,0,0)" : "scale(1) translate3d(0,0,0)",
        pointerEvents: isExiting ? "none" : "auto",
        willChange: "opacity, transform",
      }}
    >
      {/* Dynamic Ambient Background Orbs using optimized gradients */}
      <div
        className="splash-ambient-bg absolute rounded-full pointer-events-none"
        style={{
          width: "500px",
          height: "500px",
          background: "radial-gradient(circle, rgba(166,113,101,0.25) 0%, rgba(115,78,70,0.06) 55%, transparent 75%)",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%) translate3d(0,0,0)",
        }}
      />
      <div
        className="splash-ambient-bg absolute rounded-full pointer-events-none"
        style={{
          width: "380px",
          height: "380px",
          background: "radial-gradient(circle, rgba(151,192,67,0.2) 0%, rgba(78,168,222,0.06) 60%, transparent 80%)",
          top: "46%",
          left: "50%",
          transform: "translate(-50%, -50%) translate3d(0,0,0)",
          animationDelay: "-1.5s",
        }}
      />

      {/* Subtle background tech grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-15"
        style={{
          backgroundImage: `radial-gradient(rgba(242, 216, 194, 0.18) 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
        }}
      />

      {/* Main Logo & Loader Content */}
      <div className="relative z-10 flex flex-col items-center justify-center">
        
        {/* Animated Logo Centerpiece */}
        <div className="relative flex items-center justify-center w-44 h-44 mb-8">
          
          {/* Sound Wave Ripple Arcs */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div
              className="splash-wave-1 absolute rounded-full border border-[#97C043]/50"
              style={{ width: "135px", height: "135px" }}
            />
            <div
              className="splash-wave-2 absolute rounded-full border border-[#4EA8DE]/50"
              style={{ width: "165px", height: "165px" }}
            />
            <div
              className="splash-wave-3 absolute rounded-full border border-[#E56399]/50"
              style={{ width: "195px", height: "195px" }}
            />
          </div>

          {/* SVG Animated Outer Ring */}
          <svg
            className="absolute inset-0 w-full h-full transform -rotate-90 pointer-events-none"
            viewBox="0 0 160 160"
          >
            <defs>
              <linearGradient id="splashRingGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#E56399" />
                <stop offset="25%" stopColor="#F7C548" />
                <stop offset="50%" stopColor="#97C043" />
                <stop offset="75%" stopColor="#4EA8DE" />
                <stop offset="100%" stopColor="#2B74B9" />
              </linearGradient>
            </defs>

            {/* Background track circle */}
            <circle
              cx="80"
              cy="80"
              r="68"
              fill="none"
              stroke="rgba(255, 255, 255, 0.06)"
              strokeWidth="4"
            />

            {/* Main animated dash ring */}
            <circle
              cx="80"
              cy="80"
              r="68"
              fill="none"
              stroke="url(#splashRingGradient)"
              strokeWidth="5"
              strokeLinecap="round"
              className="splash-dash-ring"
            />

            {/* Outer speed line accents matching logo */}
            <g stroke="url(#splashRingGradient)" strokeWidth="2.5" strokeLinecap="round" opacity="0.85">
              <line x1="25" y1="25" x2="15" y2="15" className="splash-dash-ring" style={{ animationDelay: "0.15s" }} />
              <line x1="135" y1="25" x2="145" y2="15" className="splash-dash-ring" style={{ animationDelay: "0.3s" }} />
              <line x1="140" y1="130" x2="152" y2="142" className="splash-dash-ring" style={{ animationDelay: "0.45s" }} />
              <line x1="20" y1="135" x2="10" y2="145" className="splash-dash-ring" style={{ animationDelay: "0.6s" }} />
            </g>
          </svg>

          {/* Center Logo Icon */}
          <div className="splash-logo-animated relative z-10 flex items-center justify-center p-2.5">
            <div
              className="relative rounded-full p-2.5 shadow-2xl flex items-center justify-center"
              style={{
                background: "radial-gradient(circle, #252326 0%, #161417 100%)",
                border: "1px solid rgba(242,216,194,0.18)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
              }}
            >
              <img
                src={logoIcon}
                alt="Custon Logo"
                className="w-16 h-16 object-contain"
              />
            </div>
          </div>
        </div>

        {/* Brand Typography Reveal */}
        <div className="text-center splash-text-reveal">
          <h1
            className="text-3xl font-extrabold tracking-[0.2em] text-[#F2D8C2] uppercase"
            style={{
              fontFamily: "'Geist', 'Inter', sans-serif",
            }}
          >
            CUSTON
          </h1>
          <p className="text-xs font-semibold tracking-[0.35em] text-[#A69281] uppercase mt-1 opacity-80">
            Shortcuts Engine
          </p>
        </div>

        {/* Progress Bar & Telemetry */}
        <div className="w-72 mt-8 flex flex-col items-center">
          {/* Hardware Accelerated Progress Track */}
          <div
            className="w-full h-1.5 rounded-full overflow-hidden relative"
            style={{
              background: "rgba(255, 255, 255, 0.08)",
              border: "1px solid rgba(255, 255, 255, 0.05)",
            }}
          >
            <div
              className="h-full rounded-full"
              style={{
                width: "100%",
                transform: `scaleX(${displayProgress / 100})`,
                transformOrigin: "left",
                transition: "transform 100ms cubic-bezier(0, 0, 0.2, 1)",
                background: "linear-gradient(90deg, #E56399 0%, #F7C548 30%, #97C043 65%, #4EA8DE 100%)",
                boxShadow: "0 0 10px rgba(151,192,67,0.5)",
                willChange: "transform",
              }}
            />
          </div>

          {/* Telemetry Status Line */}
          <div className="w-full flex items-center justify-between mt-3 text-[11px] font-mono tracking-wider text-[#A69281]">
            <span className="splash-status-text flex items-center gap-1.5 font-medium text-[#F2D8C2]/90">
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{
                  backgroundColor: displayProgress >= 100 ? "#97C043" : "#F7C548",
                  boxShadow: displayProgress >= 100 ? "0 0 6px #97C043" : "0 0 6px #F7C548",
                }}
              />
              {statusText}
            </span>
            <span className="font-bold text-[#F2D8C2]">{displayProgress}%</span>
          </div>
        </div>
      </div>

      {/* Footer Version Tag */}
      <div className="absolute bottom-6 text-[10px] tracking-[0.25em] text-[#F2D8C2]/30 uppercase font-mono">
        v0.1.0 • HIGH PERFORMANCE ARCHITECTURE
      </div>
    </div>
  )
}
