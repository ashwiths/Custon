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
      className="flex flex-col items-center justify-center p-2 select-none transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        ref={dialRef}
        className="relative w-16 h-16 rounded-full border border-[#C98D74]/40 bg-[#2A2322]/85 dark:bg-[#1C1716]/90 backdrop-blur-md flex items-center justify-center shadow-[0_4px_20px_rgba(0,0,0,0.35)] transition-all duration-300 hover:scale-105 hover:border-[#C98D74] cursor-pointer"
        style={{
          boxShadow: isHovered 
            ? "0 8px 28px 0 rgba(201, 141, 116, 0.3)" 
            : "0 4px 20px 0 rgba(0, 0, 0, 0.35)"
        }}
      >
        {/* Outer dotted track ring */}
        <div className="absolute inset-1.5 rounded-full border border-dashed border-[#C98D74]/35 animate-[spin_50s_linear_infinite]" />
        
        {/* Center pivot pin */}
        <div className="w-3 h-3 rounded-full bg-[#C98D74] shadow-[0_0_8px_rgba(201,141,116,0.6)] z-10" />
        
        {/* Rotating clock pointer/hand */}
        <div
          className="absolute w-[38%] h-0.5 left-1/2 origin-left bg-[#C98D74] rounded-full transition-transform duration-75 ease-out shadow-[0_0_6px_rgba(201,141,116,0.5)]"
          style={{
            transform: `rotate(${angle}deg)`,
          }}
        />

        {/* Dynamic visual trail/glow pointing towards the mouse */}
        <div
          className="absolute inset-0 rounded-full opacity-25 pointer-events-none transition-transform duration-75 ease-out"
          style={{
            transform: `rotate(${angle + 90}deg)`,
            background: "radial-gradient(circle at 50% 10%, rgba(201, 141, 116, 0.5) 0%, transparent 60%)"
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
