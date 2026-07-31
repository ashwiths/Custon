import * as React from "react"
import { animate, splitText, stagger } from "animejs"

const TYPING_PHRASES = [
  "Welcome to Custon",
  "Shortcuts Engine Active",
  "Stealth Mode Enabled",
  "Build. Control. Optimize."
]

export const AnimatedWelcomeHeader: React.FC = () => {
  const [phraseIndex, setPhraseIndex] = React.useState(0)
  const titleRef = React.useRef<HTMLHeadingElement>(null)
  const subtitleRef = React.useRef<HTMLParagraphElement>(null)

  React.useEffect(() => {
    if (!titleRef.current) return

    let timeoutId: NodeJS.Timeout | undefined

    const currentText = TYPING_PHRASES[phraseIndex]
    titleRef.current.innerHTML = currentText

    // Split text into individual characters using Anime.js splitText
    const split = splitText(titleRef.current)

    // Auto-typing character stagger animation
    animate(split.chars, {
      opacity: [0, 1],
      translateY: [8, 0],
      scale: [0.8, 1],
      delay: stagger(45), // 45ms per character typing speed
      duration: 350,
      ease: "outQuad",
      onComplete: () => {
        // Pause on completed text, then rotate to next phrase after 4 seconds
        timeoutId = setTimeout(() => {
          // Fade out characters before switching phrase
          animate(split.chars, {
            opacity: [1, 0],
            translateY: [0, -6],
            delay: stagger(20),
            duration: 250,
            ease: "inQuad",
            onComplete: () => {
              setPhraseIndex((prev) => (prev + 1) % TYPING_PHRASES.length)
            }
          })
        }, 4000)
      }
    })

    return () => {
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [phraseIndex])

  // Subtitle fade-in animation on initial render
  React.useEffect(() => {
    if (subtitleRef.current) {
      animate(subtitleRef.current, {
        opacity: [0, 1],
        translateY: [12, 0],
        duration: 700,
        delay: 300,
        ease: "outCubic"
      })
    }
  }, [])

  return (
    <div className="flex flex-col justify-center gap-3 text-left py-2 relative select-none">
      {/* Main Animated Typing Heading */}
      <div className="flex items-center gap-3">
        <h1
          ref={titleRef}
          className="text-[40px] sm:text-[46px] font-black tracking-tight text-[#252326] dark:text-[#F2D8C2] leading-tight min-h-[56px]"
          style={{
            fontFamily: "'Geist', 'Inter', sans-serif",
            textShadow: "0 2px 20px rgba(var(--accent-color-rgb, 166,113,101), 0.15)",
          }}
        >
          Welcome to Custon
        </h1>

        {/* Anime.js Blinking Cursor for Typewriter effect */}
        <span
          className="w-1 h-9 rounded-full inline-block animate-pulse shrink-0"
          style={{
            backgroundColor: "var(--accent-color, #A67165)",
            boxShadow: "0 0 10px var(--accent-color, #A67165)",
          }}
        />
      </div>

      {/* Subtitle Description */}
      <p
        ref={subtitleRef}
        className="text-[15px] font-semibold text-[#6B5B54] dark:text-[#A69281] max-w-[800px] leading-relaxed mt-1 opacity-0"
      >
        High-performance desktop shortcut engine built for instant target application hiding, stealth hotkey management, and total workspace control.
      </p>
    </div>
  )
}
