import React, { useState, useRef } from "react"
import { Sparkles } from "lucide-react"
import { fireworkBurst } from "./FireworksOverlay"

interface BurstButtonProps {
  initialCount?: number
  variant?: "floating" | "inline"
  className?: string
}

// Handcrafted Celebration Burst SVG Icon
export const FirecrackerBurstIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M12 2L13.8 8.2L20 10L13.8 11.8L12 18L10.2 11.8L4 10L10.2 8.2L12 2Z"
      fill="currentColor"
    />
    <path
      d="M19 3L19.8 5.2L22 6L19.8 6.8L19 9L18.2 6.8L16 6L18.2 5.2L19 3Z"
      fill="currentColor"
      opacity="0.9"
    />
    <path
      d="M5 15L5.8 17.2L8 18L5.8 18.8L5 21L4.2 18.8L2 18L4.2 17.2L5 15Z"
      fill="currentColor"
      opacity="0.9"
    />
    <circle cx="18.5" cy="17.5" r="1.5" fill="currentColor" />
    <circle cx="5.5" cy="5.5" r="1.5" fill="currentColor" />
  </svg>
)

export const BurstButton: React.FC<BurstButtonProps> = ({
  initialCount = 109500000,
  variant = "floating",
  className = "",
}) => {
  const [count, setCount] = useState(initialCount)
  const [isPressed, setIsPressed] = useState(false)
  const audioCtxRef = useRef<AudioContext | null>(null)

  // Web Audio API Firecracker Sound Synthesizer
  const playCrackerSound = () => {
    try {
      if (!audioCtxRef.current) {
        const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
        audioCtxRef.current = new AudioContextClass()
      }

      const ctx = audioCtxRef.current
      if (ctx.state === "suspended") {
        ctx.resume()
      }

      const bufferSize = ctx.sampleRate * 0.08
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
      const data = buffer.getChannelData(0)

      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.2))
      }

      const noise = ctx.createBufferSource()
      noise.buffer = buffer

      const filter = ctx.createBiquadFilter()
      filter.type = "lowpass"
      filter.frequency.setValueAtTime(750 + Math.random() * 350, ctx.currentTime)

      const gain = ctx.createGain()
      gain.gain.setValueAtTime(0.5, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08)

      noise.connect(filter)
      filter.connect(gain)
      gain.connect(ctx.destination)

      noise.start()
    } catch {
      // Audio context guard
    }
  }

  const handleBurstClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setCount((prev) => prev + 1)
    setIsPressed(true)
    setTimeout(() => setIsPressed(false), 150)

    playCrackerSound()

    const buttonRect = e.currentTarget.getBoundingClientRect()
    const buttonCenterX = buttonRect ? buttonRect.left + buttonRect.width / 2 : window.innerWidth * 0.85

    const width = window.innerWidth
    const height = window.innerHeight

    // 4 Rockets launch from bottom, fly up to the TOP of the screen, and burst at the TOP!
    const targets = [
      { x: buttonCenterX - 40, targetX: width * 0.15, targetY: height * 0.15, delay: 0 },   // 1. Top Left
      { x: buttonCenterX - 20, targetX: width * 0.38, targetY: height * 0.11, delay: 70 },  // 2. Top Mid-Left
      { x: buttonCenterX + 20, targetX: width * 0.62, targetY: height * 0.13, delay: 140 }, // 3. Top Mid-Right
      { x: buttonCenterX + 40, targetX: width * 0.85, targetY: height * 0.17, delay: 210 }, // 4. Top Right
    ]

    targets.forEach((t) => {
      setTimeout(() => {
        fireworkBurst({
          x: t.x,
          targetX: t.targetX,
          targetY: t.targetY,
          rocket: true, // Launch rocket upward to burst high up at the TOP!
        })
      }, t.delay)
    })
  }

  const formatCount = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "m"
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "k"
    }
    return num.toLocaleString()
  }

  if (variant === "inline") {
    return (
      <button
        onClick={handleBurstClick}
        className={`relative group flex items-center justify-center gap-2.5 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#A67165] via-[#C98D74] to-[#E09F67] hover:from-[#734E46] hover:to-[#A67165] text-white font-bold shadow-md hover:shadow-lg hover:shadow-[#A67165]/30 active:scale-95 transition-all duration-200 cursor-pointer overflow-hidden ${className} ${
          isPressed ? "scale-95 ring-4 ring-[#C98D74]/40" : ""
        }`}
      >
        <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-full" />
        <FirecrackerBurstIcon className="w-5 h-5 text-[#FFD700] animate-pulse flex-shrink-0" />
        <span className="tracking-wide text-xs">Burst Fireworks</span>
        <span className="ml-1 text-[11px] px-2 py-0.5 rounded-full bg-black/25 font-bold backdrop-blur-sm">
          {formatCount(count)}
        </span>
      </button>
    )
  }

  return (
    <div
      className={`fixed bottom-8 right-8 z-40 flex flex-col items-end gap-2 select-none pointer-events-auto ${className}`}
    >
      {/* Floating Counter Badge Pill */}
      <div className="px-3.5 py-1.5 rounded-full bg-[#1E1C1F]/90 border border-[#A67165]/40 text-[#F2D8C2] text-xs font-semibold shadow-lg backdrop-blur-md flex items-center gap-1.5 animate-bounce-subtle">
        <Sparkles className="w-3.5 h-3.5 text-[#FFD700]" />
        <span>{formatCount(count)} bursts</span>
      </div>

      {/* Standalone Circular Burst Button (Only Burst Button, No Extra Options) */}
      <button
        onClick={handleBurstClick}
        aria-label="Celebrate Fireworks Burst"
        title="Burst Fireworks Crackers"
        className={`relative group flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-tr from-[#A67165] via-[#C98D74] to-[#E09F67] hover:from-[#734E46] hover:to-[#A67165] text-white shadow-2xl shadow-[#A67165]/50 border-2 border-[#F2D8C2]/30 active:scale-90 transition-all duration-200 cursor-pointer flex-shrink-0 ${
          isPressed ? "scale-90 ring-4 ring-[#C98D74]/60" : ""
        }`}
      >
        {/* Subtle Rotating Glow Aura */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#FFD700] to-[#A67165] opacity-0 group-hover:opacity-40 blur-md transition-opacity" />

        {/* Burst Icon */}
        <FirecrackerBurstIcon className="w-7 h-7 text-white drop-shadow-md group-hover:rotate-12 transition-transform duration-300" />
      </button>
    </div>
  )
}
