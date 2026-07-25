import * as React from "react"
import { Settings, Check } from "lucide-react"
import { applyAccentColor } from "@/utils/accentColor"

interface AppearanceTabProps {
  darkMode: boolean
  setDarkMode: (dark: boolean) => void
}

const ACCENT_COLORS = [
  { name: "Mocha", value: "#A67165" },
  { name: "Forest Green", value: "#2E7D32" },
  { name: "Blue", value: "#1E88E5" },
  { name: "Purple", value: "#8E24AA" },
  { name: "Crimson", value: "#D81B60" },
  { name: "Slate", value: "#546E7A" }
]

export const AppearanceTab: React.FC<AppearanceTabProps> = ({ darkMode: _darkMode, setDarkMode: _setDarkMode }) => {
  const [accentColor, setAccentColor] = React.useState(() => {
    return localStorage.getItem("appearance_accent_color") || "#A67165"
  })
  
  const [isCustomColor, setIsCustomColor] = React.useState(() => {
    const saved = localStorage.getItem("appearance_accent_color") || "#A67165"
    return !ACCENT_COLORS.some(c => c.value === saved)
  })

  const [wallpaperOpacity, setWallpaperOpacity] = React.useState(() => {
    return Number(localStorage.getItem("appearance_wallpaper_opacity") || "80")
  })

  const [blurStrength, setBlurStrength] = React.useState(() => {
    return Number(localStorage.getItem("appearance_blur_strength") || "20")
  })

  const [glassTransparency, setGlassTransparency] = React.useState(() => {
    return Number(localStorage.getItem("appearance_glass_transparency") || "30")
  })

  const [cornerRadius, setCornerRadius] = React.useState(() => {
    return Number(localStorage.getItem("appearance_corner_radius") || "16")
  })

  // Accent color change handler
  const handleAccentChange = (color: string, isCustom = false) => {
    setAccentColor(color)
    setIsCustomColor(isCustom)
    applyAccentColor(color)
  }

  // Real-time synchronization of CSS variables and localStorage
  React.useEffect(() => {
    localStorage.setItem("appearance_wallpaper_opacity", String(wallpaperOpacity))
    localStorage.setItem("appearance_blur_strength", String(blurStrength))
    localStorage.setItem("appearance_glass_transparency", String(glassTransparency))
    localStorage.setItem("appearance_corner_radius", String(cornerRadius))

    // Sync root CSS variables
    document.documentElement.style.setProperty("--card-radius", `${cornerRadius}px`)
    document.documentElement.style.setProperty("--wallpaper-opacity", `${wallpaperOpacity / 100}`)
    document.documentElement.style.setProperty("--bg-blur-strength", `${blurStrength}px`)
  }, [wallpaperOpacity, blurStrength, glassTransparency, cornerRadius])

  return (
    <div className="space-y-6 animate-fade-up select-none pb-8 text-left">
      {/* 2-Column Split: Controls on Left, Live Mockup Preview on Right */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        
        {/* Left Column Controls (7 cols) */}
        <div className="xl:col-span-7 space-y-5">

          {/* Accent Color Swatches */}
          <div className="p-4 rounded-2xl border border-black/10 dark:border-white/10 bg-white/40 dark:bg-black/20 backdrop-blur-md space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-[#252326] dark:text-white block">Accent Color</label>
            <div className="flex flex-wrap gap-3 items-center">
              {ACCENT_COLORS.map(c => {
                const isSelected = accentColor === c.value && !isCustomColor
                return (
                  <button
                    key={c.name}
                    onClick={() => handleAccentChange(c.value, false)}
                    className="w-8 h-8 rounded-full transition-all border flex items-center justify-center relative hover:scale-110 cursor-pointer"
                    style={{
                      backgroundColor: c.value,
                      borderColor: isSelected ? "#FFFFFF" : "rgba(0,0,0,0.15)",
                      boxShadow: isSelected ? `0 0 12px ${c.value}` : "none"
                    }}
                    title={c.name}
                  >
                    {isSelected && <Check className="w-4 h-4 text-white drop-shadow" />}
                  </button>
                )
              })}
              
              {/* Custom Color Input */}
              <div className="flex items-center gap-2 border-l border-black/10 dark:border-white/10 pl-3">
                <div
                  className="w-8 h-8 rounded-full border border-black/20 dark:border-white/30 relative flex items-center justify-center overflow-hidden hover:scale-110 cursor-pointer"
                  style={{
                    backgroundColor: isCustomColor ? accentColor : "#252326",
                    boxShadow: isCustomColor ? `0 0 12px ${accentColor}` : "none"
                  }}
                  title="Custom Color Picker"
                >
                  <input
                    type="color"
                    value={accentColor}
                    onChange={e => handleAccentChange(e.target.value, true)}
                    className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                  />
                  {isCustomColor ? (
                    <Check className="w-4 h-4 text-white drop-shadow" />
                  ) : (
                    <span className="text-[10px] font-bold text-white/90">Custom</span>
                  )}
                </div>
                <span className="text-[10px] uppercase font-bold text-[#594741] dark:text-[#9B8179]">Custom</span>
              </div>
            </div>
          </div>

          {/* Sliders Section */}
          <div className="p-4 rounded-2xl border border-black/10 dark:border-white/10 bg-white/40 dark:bg-black/20 backdrop-blur-md space-y-4 font-mono text-[11px]">
            
            {/* Opacity */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[#594741] dark:text-[#9B8179] font-bold">
                <span>WALLPAPER OPACITY</span>
                <span className="text-[#252326] dark:text-[#F2D8C2] font-black">{wallpaperOpacity}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={wallpaperOpacity}
                onChange={e => setWallpaperOpacity(Number(e.target.value))}
                className="w-full h-1.5 bg-black/10 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-[var(--accent-color,#A67165)]"
                style={{ accentColor }}
              />
            </div>

            {/* Blur */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[#594741] dark:text-[#9B8179] font-bold">
                <span>BACKGROUND BLUR STRENGTH</span>
                <span className="text-[#252326] dark:text-[#F2D8C2] font-black">{blurStrength}px</span>
              </div>
              <input
                type="range"
                min="0"
                max="40"
                value={blurStrength}
                onChange={e => setBlurStrength(Number(e.target.value))}
                className="w-full h-1.5 bg-black/10 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-[var(--accent-color,#A67165)]"
                style={{ accentColor }}
              />
            </div>

            {/* Glass Transparency */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[#594741] dark:text-[#9B8179] font-bold">
                <span>GLASS TRANSLUCENCY</span>
                <span className="text-[#252326] dark:text-[#F2D8C2] font-black">{glassTransparency}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="90"
                value={glassTransparency}
                onChange={e => setGlassTransparency(Number(e.target.value))}
                className="w-full h-1.5 bg-black/10 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-[var(--accent-color,#A67165)]"
                style={{ accentColor }}
              />
            </div>

            {/* Corner Radius */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[#594741] dark:text-[#9B8179] font-bold">
                <span>INTERFACE CORNER RADIUS</span>
                <span className="text-[#252326] dark:text-[#F2D8C2] font-black">{cornerRadius}px</span>
              </div>
              <input
                type="range"
                min="0"
                max="24"
                value={cornerRadius}
                onChange={e => setCornerRadius(Number(e.target.value))}
                className="w-full h-1.5 bg-black/10 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-[var(--accent-color,#A67165)]"
                style={{ accentColor }}
              />
            </div>
          </div>
        </div>

        {/* Right Column Interactive Live Mockup Preview (5 cols) */}
        <div className="xl:col-span-5 bg-black/35 p-5 rounded-2xl border border-white/10 space-y-4 sticky top-4 backdrop-blur-md">
          <div className="flex justify-between items-center border-b border-white/10 pb-2.5">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#9B8179]">Live Theme Preview</span>
            <span className="w-2.5 h-2.5 rounded-full animate-ping" style={{ backgroundColor: accentColor }} />
          </div>

          {/* Miniature App Interface Frame Mockup */}
          <div
            className={`w-full overflow-hidden border border-white/15 transition-all duration-300 ${
              _darkMode ? "bg-[#1E1B1A] text-[#F2D8C2]" : "bg-[#F7EFE9] text-[#252326]"
            }`}
            style={{ borderRadius: `${cornerRadius}px` }}
          >
            {/* Header bar mockup */}
            <div className="flex items-center justify-between px-3 py-2 border-b border-white/10 bg-black/20">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: accentColor }} />
                <span className="text-[9px] font-black uppercase tracking-wider font-mono">Custon Client</span>
              </div>
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
                <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
                <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
              </div>
            </div>

            {/* Split layout inside miniature app */}
            <div className="flex h-48 relative overflow-hidden">
              
              {/* Background Artwork Simulation */}
              <div 
                className="absolute inset-0 pointer-events-none" 
                style={{ 
                  background: `radial-gradient(circle at 50% 50%, ${accentColor}33 0%, transparent 80%)`,
                  opacity: wallpaperOpacity / 100
                }} 
              />

              {/* Mini sidebar mockup */}
              <div className="w-16 border-r border-white/10 bg-black/40 p-2 space-y-2 flex flex-col items-center z-10 backdrop-blur-sm">
                <div className="w-full h-4 rounded-lg flex items-center justify-center text-[7px] font-bold" style={{ backgroundColor: `${accentColor}33`, color: accentColor }}>
                  <Settings className="w-2.5 h-2.5" />
                </div>
                <div className="w-10 h-1.5 rounded bg-white/20" />
                <div className="w-10 h-1.5 rounded bg-white/20" />
                <div className="w-10 h-1.5 rounded bg-white/20" />
              </div>

              {/* Mini Content view mockup */}
              <div className="flex-1 p-3.5 space-y-2 flex flex-col justify-between z-10">
                <div className="space-y-1">
                  <div className="w-20 h-2 rounded bg-white/30" />
                  <div className="w-28 h-1.5 rounded bg-white/15" />
                </div>

                {/* Mock card content reflecting glass opacity and background */}
                <div
                  className="p-2.5 border transition-all backdrop-blur-md"
                  style={{
                    backgroundColor: `rgba(255, 255, 255, ${glassTransparency / 250})`,
                    borderColor: "rgba(255, 255, 255, 0.15)",
                    borderRadius: `${cornerRadius / 2}px`
                  }}
                >
                  <div className="flex justify-between items-center">
                    <div className="w-12 h-1.5 rounded bg-white/30" />
                    {/* Switch mock */}
                    <div
                      className="w-6 h-3 rounded-full relative flex items-center px-0.5"
                      style={{ backgroundColor: accentColor }}
                    >
                      <div className="w-2 h-2 rounded-full bg-white absolute right-0.5" />
                    </div>
                  </div>
                </div>

                {/* Footer simulation */}
                <div className="flex justify-between items-center pt-1 border-t border-white/10">
                  <div className="w-10 h-1.5 rounded bg-white/30" />
                  <button
                    className="px-2.5 py-1 rounded-lg text-[8px] font-bold text-white border-none flex items-center gap-1 shadow"
                    style={{ backgroundColor: accentColor }}
                  >
                    <Settings className="w-2 h-2" />
                    <span>Apply</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="text-[11px] text-[#9B8179] font-medium leading-relaxed bg-white/5 p-3.5 rounded-xl border border-white/10">
            ✨ <strong>Live styling enabled:</strong> Changing accent colors, custom wallpapers, corner radiuses, and transparency updates the app in real-time.
          </div>
        </div>

      </div>
    </div>
  )
}
