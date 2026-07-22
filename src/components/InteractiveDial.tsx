import * as React from "react"

export const InteractiveDial: React.FC = () => {
  const dialRef = React.useRef<HTMLDivElement>(null)
  const [angle, setAngle] = React.useState(0)
  const [isHovered, setIsHovered] = React.useState(false)

  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!dialRef.current) return
      
      const rect = dialRef.current.getBoundingClientRect()
      // Center coordinates of the dial relative to client window
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      
      // Calculate delta between mouse and center
      const dx = e.clientX - centerX
      const dy = e.clientY - centerY
      
      // Calculate angle in radians and convert to degrees
      const radians = Math.atan2(dy, dx)
      const degrees = radians * (180 / Math.PI)
      
      setAngle(degrees)
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [])

  return (
    <div 
      className="flex flex-col items-center justify-center p-3 select-none transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        ref={dialRef}
        className="relative w-16 h-16 rounded-full border border-[rgba(166,113,101,0.25)] dark:border-[#C98D74]/30 bg-white/40 dark:bg-black/20 backdrop-blur-md flex items-center justify-center shadow-[0_4px_20px_rgba(115,78,70,0.06)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.2)] transition-all duration-300 hover:scale-[1.08] hover:border-[#A67165]/50 dark:hover:border-[#C98D74]/50 cursor-pointer"
        style={{
          boxShadow: isHovered 
            ? "0 8px 32px 0 rgba(166, 113, 101, 0.15)" 
            : "0 4px 20px 0 rgba(115, 78, 70, 0.04)"
        }}
      >
        {/* Outer dotted track ring */}
        <div className="absolute inset-1.5 rounded-full border border-dashed border-[#A67165]/20 dark:border-[#C98D74]/20 animate-[spin_40s_linear_infinite]" />
        
        {/* Center pivot pin */}
        <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-[#A67165] to-[#734E46] dark:from-[#C98D74] dark:to-[#A67165] z-10 shadow-md" />
        
        {/* Rotating clock pointer/hand */}
        <div
          className="absolute w-1/2 h-0.5 left-1/2 origin-left bg-gradient-to-r from-transparent to-[#A67165] dark:to-[#C98D74] rounded-full transition-transform duration-75 ease-out"
          style={{
            transform: `rotate(${angle}deg)`,
          }}
        />

        {/* Dynamic visual trail/glow pointing towards the mouse */}
        <div
          className="absolute inset-0 rounded-full opacity-20 pointer-events-none transition-transform duration-75 ease-out"
          style={{
            transform: `rotate(${angle + 90}deg)`,
            background: "radial-gradient(circle at 50% 10%, rgba(166, 113, 101, 0.4) 0%, transparent 60%)"
          }}
        />

        {/* 12, 3, 6, 9 Cardinal Ticks */}
        <div className="absolute top-1 left-1/2 -translate-x-1/2 w-0.5 h-1.5 bg-[#A67165]/50 dark:bg-[#C98D74]/50 rounded-full" />
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-0.5 h-1.5 bg-[#A67165]/50 dark:bg-[#C98D74]/50 rounded-full" />
        <div className="absolute left-1 top-1/2 -translate-y-1/2 w-1.5 h-0.5 bg-[#A67165]/50 dark:bg-[#C98D74]/50 rounded-full" />
        <div className="absolute right-1 top-1/2 -translate-y-1/2 w-1.5 h-0.5 bg-[#A67165]/50 dark:bg-[#C98D74]/50 rounded-full" />
      </div>
      
      <span className="text-[10px] font-bold text-[#9B8179] dark:text-[#A69281] uppercase tracking-wider mt-2 opacity-70 animate-pulse">
        Track Dial
      </span>
    </div>
  )
}
