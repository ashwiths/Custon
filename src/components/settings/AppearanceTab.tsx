import * as React from "react"
import { Sun, Moon, Monitor, Upload, Settings } from "lucide-react"

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

export const AppearanceTab: React.FC<AppearanceTabProps> = ({ darkMode, setDarkMode }) => {
  const [themeMode, setThemeMode] = React.useState<"dark" | "light" | "system">(() => {
    return (localStorage.getItem("appearance_theme_mode") as any) || (darkMode ? "dark" : "light")
  })
  
  const [accentColor, setAccentColor] = React.useState(() => {
    return localStorage.getItem("appearance_accent_color") || "#A67165"
  })
  
  const [isCustomColor, setIsCustomColor] = React.useState(() => {
    const saved = localStorage.getItem("appearance_accent_color") || "#A67165"
    return !ACCENT_COLORS.some(c => c.value === saved)
  })

  const [bgType, setBgType] = React.useState(() => {
    return localStorage.getItem("appearance_bg_type") || "gradient"
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

  const [animationSpeed, setAnimationSpeed] = React.useState<"off" | "fast" | "normal" | "smooth" | "luxury">(() => {
    return (localStorage.getItem("appearance_animation_speed") as any) || "smooth"
  })

  const [sidebarStyle, setSidebarStyle] = React.useState<"compact" | "default" | "floating">(() => {
    return (localStorage.getItem("appearance_sidebar_style") as any) || "default"
  })

  const [cornerRadius, setCornerRadius] = React.useState(() => {
    return Number(localStorage.getItem("appearance_corner_radius") || "16")
  })

  const [fontSize, setFontSize] = React.useState<"small" | "medium" | "large">(() => {
    return (localStorage.getItem("appearance_font_size") as any) || "medium"
  })

  // Theme change
  const handleThemeChange = (mode: "dark" | "light" | "system") => {
    setThemeMode(mode)
    localStorage.setItem("appearance_theme_mode", mode)
    if (mode === "dark") {
      setDarkMode(true)
    } else if (mode === "light") {
      setDarkMode(false)
    } else {
      const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches
      setDarkMode(systemDark)
    }
  }

  // Accent color change
  const handleAccentChange = (color: string, isCustom = false) => {
    setAccentColor(color)
    setIsCustomColor(isCustom)
    localStorage.setItem("appearance_accent_color", color)
    document.documentElement.style.setProperty("--accent-color", color)
  }

  // Handle other saves on change
  React.useEffect(() => {
    localStorage.setItem("appearance_bg_type", bgType)
    localStorage.setItem("appearance_wallpaper_opacity", String(wallpaperOpacity))
    localStorage.setItem("appearance_blur_strength", String(blurStrength))
    localStorage.setItem("appearance_glass_transparency", String(glassTransparency))
    localStorage.setItem("appearance_animation_speed", animationSpeed)
    localStorage.setItem("appearance_sidebar_style", sidebarStyle)
    localStorage.setItem("appearance_corner_radius", String(cornerRadius))
    localStorage.setItem("appearance_font_size", fontSize)
  }, [bgType, wallpaperOpacity, blurStrength, glassTransparency, animationSpeed, sidebarStyle, cornerRadius, fontSize])

  return (
    <div className="space-y-6">
      {/* 2-Column Split: Controls on Left, Live Mockup Preview on Right */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Left Column Controls (7 cols) */}
        <div className="xl:col-span-7 space-y-5">
          {/* Theme */}
          <div className="p-4 rounded-xl border border-white/5 bg-black/10 dark:bg-black/20 space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-white">Theme</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: "light", label: "Light", icon: Sun },
                { id: "dark", label: "Dark", icon: Moon },
                { id: "system", label: "System", icon: Monitor }
              ].map(item => {
                const isActive = themeMode === item.id
                return (
                  <button
                    key={item.id}
                    onClick={() => handleThemeChange(item.id as any)}
                    className={`flex flex-col items-center justify-center py-2.5 rounded-lg border transition-all text-xs font-semibold gap-1.5 cursor-pointer ${
                      isActive
                        ? "border-[#A67165] bg-[#A67165]/10 text-white"
                        : "border-white/5 bg-white/5 text-[#9B8179] hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Accent Colors */}
          <div className="p-4 rounded-xl border border-white/5 bg-black/10 dark:bg-black/20 space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-white">Accent Color</label>
            <div className="flex flex-wrap gap-2.5 items-center">
              {ACCENT_COLORS.map(c => {
                const isSelected = accentColor === c.value && !isCustomColor
                return (
                  <button
                    key={c.name}
                    onClick={() => handleAccentChange(c.value, false)}
                    className="w-7 h-7 rounded-full transition-all border flex items-center justify-center relative hover:scale-110 cursor-pointer"
                    style={{
                      backgroundColor: c.value,
                      borderColor: isSelected ? "#F2D8C2" : "rgba(255,255,255,0.15)",
                      boxShadow: isSelected ? `0 0 10px ${c.value}` : "none"
                    }}
                    title={c.name}
                  >
                    {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </button>
                )
              })}
              {/* Custom Color Input */}
              <div className="flex items-center gap-2 border-l border-white/10 pl-2.5">
                <div
                  className="w-7 h-7 rounded-full border border-white/20 relative flex items-center justify-center overflow-hidden hover:scale-110 cursor-pointer"
                  style={{
                    backgroundColor: isCustomColor ? accentColor : "#252326",
                    boxShadow: isCustomColor ? `0 0 10px ${accentColor}` : "none"
                  }}
                  title="Custom Color"
                >
                  <input
                    type="color"
                    value={accentColor}
                    onChange={e => handleAccentChange(e.target.value, true)}
                    className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                  />
                  {isCustomColor && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
                <span className="text-[10px] uppercase font-bold text-[#9B8179]">Custom</span>
              </div>
            </div>
          </div>

          {/* Backgrounds */}
          <div className="p-4 rounded-xl border border-white/5 bg-black/10 dark:bg-black/20 space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-white">Background Artwork</label>
            <div className="flex gap-2">
              <select
                value={bgType}
                onChange={e => setBgType(e.target.value)}
                className="flex-1 bg-black/40 border border-white/10 rounded-lg py-2 px-3 text-xs text-[#F2D8C2] font-semibold outline-none"
              >
                <option value="none">None (Solid Background)</option>
                <option value="gradient">Deep Gradient Accent</option>
                <option value="landscape">Earthy Landscape Canvas</option>
                <option value="abstract">Abstract Particle Vectors</option>
                <option value="blur">Vapor Glow Radial Blur</option>
              </select>
              <button
                className="px-3 border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 rounded-lg text-white transition-all flex items-center gap-1.5 cursor-pointer text-xs"
                onClick={() => alert("Custom wallpaper uploader requires backend integration. Select local options for now.")}
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload</span>
              </button>
            </div>
          </div>

          {/* Sliders Section */}
          <div className="p-4 rounded-xl border border-white/5 bg-black/10 dark:bg-black/20 space-y-4 font-mono text-[10px]">
            {/* Opacity */}
            <div className="space-y-1">
              <div className="flex justify-between text-[#9B8179] font-bold">
                <span>WALLPAPER OPACITY</span>
                <span>{wallpaperOpacity}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={wallpaperOpacity}
                onChange={e => setWallpaperOpacity(Number(e.target.value))}
                className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#A67165]"
                style={{ accentColor }}
              />
            </div>

            {/* Blur */}
            <div className="space-y-1">
              <div className="flex justify-between text-[#9B8179] font-bold">
                <span>BACKGROUND BLUR STRENGTH</span>
                <span>{blurStrength}px</span>
              </div>
              <input
                type="range"
                min="0"
                max="40"
                value={blurStrength}
                onChange={e => setBlurStrength(Number(e.target.value))}
                className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#A67165]"
                style={{ accentColor }}
              />
            </div>

            {/* Glass Transparency */}
            <div className="space-y-1">
              <div className="flex justify-between text-[#9B8179] font-bold">
                <span>GLASS TRANSLUCENCY</span>
                <span>{Math.round(glassTransparency)}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="90"
                value={glassTransparency}
                onChange={e => setGlassTransparency(Number(e.target.value))}
                className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#A67165]"
                style={{ accentColor }}
              />
            </div>

            {/* Corner Radius */}
            <div className="space-y-1">
              <div className="flex justify-between text-[#9B8179] font-bold">
                <span>INTERFACE CORNER RADIUS</span>
                <span>{cornerRadius}px</span>
              </div>
              <input
                type="range"
                min="0"
                max="24"
                value={cornerRadius}
                onChange={e => setCornerRadius(Number(e.target.value))}
                className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#A67165]"
                style={{ accentColor }}
              />
            </div>
          </div>

          {/* Typography & Layout options */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Animation Speed */}
            <div className="p-3.5 rounded-xl border border-white/5 bg-black/10 dark:bg-black/20 space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-white">Animations</label>
              <select
                value={animationSpeed}
                onChange={e => setAnimationSpeed(e.target.value as any)}
                className="w-full bg-black/40 border border-white/10 rounded-lg py-1.5 px-2 text-xs text-[#F2D8C2] font-semibold outline-none"
              >
                <option value="off">Disabled</option>
                <option value="fast">Aggressive</option>
                <option value="normal">Normal</option>
                <option value="smooth">Smooth</option>
                <option value="luxury">Luxury Delay</option>
              </select>
            </div>

            {/* Sidebar Style */}
            <div className="p-3.5 rounded-xl border border-white/5 bg-black/10 dark:bg-black/20 space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-white">Sidebar Layout</label>
              <select
                value={sidebarStyle}
                onChange={e => setSidebarStyle(e.target.value as any)}
                className="w-full bg-black/40 border border-white/10 rounded-lg py-1.5 px-2 text-xs text-[#F2D8C2] font-semibold outline-none"
              >
                <option value="compact">Compact Icons</option>
                <option value="default">Standard Labels</option>
                <option value="floating">Floating Border</option>
              </select>
            </div>

            {/* Font Size */}
            <div className="p-3.5 rounded-xl border border-white/5 bg-black/10 dark:bg-black/20 space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-white">Interface Scale</label>
              <select
                value={fontSize}
                onChange={e => setFontSize(e.target.value as any)}
                className="w-full bg-black/40 border border-white/10 rounded-lg py-1.5 px-2 text-xs text-[#F2D8C2] font-semibold outline-none"
              >
                <option value="small">Small (90%)</option>
                <option value="medium">Default (100%)</option>
                <option value="large">Large (110%)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Right Column Interactive Live Mockup Preview (5 cols) */}
        <div className="xl:col-span-5 bg-black/35 p-5 rounded-2xl border border-white/5 space-y-4 sticky top-4">
          <div className="flex justify-between items-center border-b border-white/5 pb-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#9B8179]">Live Client Preview</span>
            <span className="w-2 h-2 rounded-full animate-ping" style={{ backgroundColor: accentColor }} />
          </div>

          {/* Miniature App Interface Frame Mockup */}
          <div
            className={`w-full overflow-hidden border border-white/10 transition-all duration-300 ${
              darkMode ? "bg-[#1E1B1A] text-[#F2D8C2]" : "bg-[#F7EFE9] text-[#252326]"
            }`}
            style={{ borderRadius: `${cornerRadius}px` }}
          >
            {/* Header bar mockup */}
            <div className="flex items-center justify-between px-3 py-2 border-b border-white/5 bg-black/10">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: accentColor }} />
                <span className="text-[9px] font-black uppercase tracking-wider font-mono">Custun Desktop</span>
              </div>
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
                <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
                <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
              </div>
            </div>

            {/* Split layout inside miniature app */}
            <div className="flex h-44">
              {/* Mini sidebar mockup */}
              <div className="w-14 border-r border-white/5 bg-black/20 p-1.5 space-y-1.5 flex flex-col items-center">
                <div className="w-full h-3.5 rounded bg-white/10 flex items-center justify-center text-[7px]" style={{ color: accentColor }}>
                  <Sun className="w-2 h-2" />
                </div>
                <div className="w-8 h-1 rounded bg-white/15" />
                <div className="w-8 h-1 rounded bg-white/15" />
                <div className="w-8 h-1 rounded bg-white/15" />
              </div>

              {/* Mini Content view mockup */}
              <div className="flex-1 p-3 space-y-2 flex flex-col justify-between">
                <div className="space-y-1">
                  <div className="w-16 h-1.5 rounded bg-white/20" />
                  <div className="w-24 h-1 rounded bg-white/10" />
                </div>

                {/* Mock card content reflecting glass opacity and background */}
                <div
                  className="p-2 border transition-all"
                  style={{
                    backgroundColor: `rgba(255, 255, 255, ${glassTransparency / 300})`,
                    borderColor: "rgba(255, 255, 255, 0.08)",
                    borderRadius: `${cornerRadius / 2.5}px`
                  }}
                >
                  <div className="flex justify-between items-center">
                    <div className="w-10 h-1 rounded bg-white/25" />
                    {/* Switch mock */}
                    <div
                      className="w-5 h-2.5 rounded-full relative flex items-center px-0.5"
                      style={{ backgroundColor: accentColor }}
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-white absolute right-0.5" />
                    </div>
                  </div>
                </div>

                {/* Footer simulation */}
                <div className="flex justify-between items-center pt-1 border-t border-white/5">
                  <div className="w-8 h-1 rounded bg-white/25" />
                  <button
                    className="px-2 py-0.5 rounded text-[7px] font-bold text-white border-none flex items-center gap-0.5"
                    style={{ backgroundColor: accentColor }}
                  >
                    <Settings className="w-1.5 h-1.5" />
                    <span>Apply</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="text-[10px] text-[#9B8179] font-medium leading-relaxed bg-white/5 p-3 rounded-lg border border-white/5">
            💡 **Live feedback active:** Accent colors and themes modify this mockup panel and the dashboard header immediately. Upload custom wallpapers from the option dropdown.
          </div>
        </div>
      </div>
    </div>
  )
}
