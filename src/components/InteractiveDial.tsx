import * as React from "react"

export const InteractiveDial: React.FC = () => {
  const dialRef = React.useRef<HTMLDivElement>(null)
  const [angle, setAngle] = React.useState(0)
  const [isHovered, setIsHovered] = React.useState(false)

  React.useEffect(() => {
    let animFrameId: number
    let currentAngle = 0
    let targetAngle = 0
    let lastMouseMoveTime = Date.now()

    const handleMouseMove = (e: MouseEvent) => {
      if (!dialRef.current) return
      
      const rect = dialRef.current.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      
      const dx = e.clientX - centerX
      const dy = e.clientY - centerY
      
      const radians = Math.atan2(dy, dx)
      const degrees = radians * (180 / Math.PI)
      
      // Calculate shortest angular difference (unwrap angle) to prevent 360° flip glitches
      let diff = (degrees - (targetAngle % 360) + 540) % 360 - 180
      targetAngle += diff
      lastMouseMoveTime = Date.now()
    }

    const updateAnimation = () => {
      const now = Date.now()
      // If mouse is idle for > 3 seconds, add slow ambient rotation
      if (now - lastMouseMoveTime > 3000) {
        targetAngle += 0.4
      }

      // Smooth 60fps linear interpolation (lerp) towards target angle
      currentAngle += (targetAngle - currentAngle) * 0.18
      setAngle(currentAngle)
      animFrameId = requestAnimationFrame(updateAnimation)
    }

    window.addEventListener("mousemove", handleMouseMove)
    animFrameId = requestAnimationFrame(updateAnimation)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      cancelAnimationFrame(animFrameId)
    }
  }, [])

  return (
    <div 
      className="flex flex-col items-center justify-center p-2 select-none transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        ref={dialRef}
        className="relative w-16 h-16 rounded-full border border-[#C98D74]/40 bg-[#2A2322]/85 dark:bg-[#1C1716]/90 backdrop-blur-md flex items-center justify-center shadow-[0_4px_20px_rgba(0,0,0,0.35)] transition-transform duration-300 hover:scale-105 hover:border-[#C98D74] cursor-pointer"
        style={{
          boxShadow: isHovered 
            ? "0 8px 28px 0 rgba(201, 141, 116, 0.35)" 
            : "0 4px 20px 0 rgba(0, 0, 0, 0.35)"
        }}
      >
        {/* Outer dotted track ring */}
        <div className="absolute inset-1.5 rounded-full border border-dashed border-[#C98D74]/35 animate-[spin_50s_linear_infinite]" />
        
        {/* Center pivot pin */}
        <div className="w-3 h-3 rounded-full bg-[#C98D74] shadow-[0_0_8px_rgba(201,141,116,0.6)] z-10" />
        
        {/* Rotating clock pointer/hand */}
        <div
          className="absolute w-[38%] h-0.5 left-1/2 origin-left bg-[#C98D74] rounded-full shadow-[0_0_6px_rgba(201,141,116,0.6)]"
          style={{
            transform: `rotate(${angle}deg)`,
            willChange: "transform"
          }}
        />

        {/* Dynamic visual trail/glow pointing towards the pointer */}
        <div
          className="absolute inset-0 rounded-full opacity-25 pointer-events-none"
          style={{
            transform: `rotate(${angle + 90}deg)`,
            background: "radial-gradient(circle at 50% 10%, rgba(201, 141, 116, 0.6) 0%, transparent 60%)",
            willChange: "transform"
          }}
        />

        {/* 12, 3, 6, 9 Cardinal Ticks */}
        <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-0.5 h-1.5 bg-[#C98D74]/70 rounded-full" />
        <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-0.5 h-1.5 bg-[#C98D74]/70 rounded-full" />
        <div className="absolute left-1.5 top-1/2 -translate-y-1/2 w-1.5 h-0.5 bg-[#C98D74]/70 rounded-full" />
        <div className="absolute right-1.5 top-1/2 -translate-y-1/2 w-1.5 h-0.5 bg-[#C98D74]/70 rounded-full" />
      </div>
      
      <span className="text-[10px] font-black text-[#C98D74] dark:text-[#F2D8C2]/90 uppercase tracking-widest mt-2 select-none">
        TRACK DIAL
      </span>
    </div>
  )
}
