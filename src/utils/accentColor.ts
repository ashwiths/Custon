/**
 * Centralized Accent Color Utility for Custon Shortcuts
 * Converts hex color strings into CSS custom properties and updates root styles dynamically.
 */

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  let cleanHex = hex.replace("#", "")
  if (cleanHex.length === 3) {
    cleanHex = cleanHex.split("").map(c => c + c).join("")
  }
  const num = parseInt(cleanHex, 16)
  if (isNaN(num)) {
    return { r: 166, g: 113, b: 101 } // Fallback to default mocha
  }
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255
  }
}

function adjustColorBrightness(r: number, g: number, b: number, factor: number): string {
  const clamp = (val: number) => Math.max(0, Math.min(255, Math.round(val)))
  const adjR = clamp(r * factor)
  const adjG = clamp(g * factor)
  const adjB = clamp(b * factor)
  return `#${((1 << 24) + (adjR << 16) + (adjG << 8) + adjB).toString(16).slice(1)}`
}

export function applyAccentColor(hexColor: string) {
  if (!hexColor || typeof hexColor !== "string") return

  const { r, g, b } = hexToRgb(hexColor)
  const hoverColor = adjustColorBrightness(r, g, b, 0.8)

  const root = document.documentElement
  root.style.setProperty("--accent-color", hexColor)
  root.style.setProperty("--accent-color-hover", hoverColor)
  root.style.setProperty("--accent-color-rgb", `${r}, ${g}, ${b}`)
  
  // Update HSL semantic tokens if needed
  root.style.setProperty("--primary-rgb", `${r}, ${g}, ${b}`)

  try {
    localStorage.setItem("appearance_accent_color", hexColor)
  } catch {
    // Ignore
  }
}

export function initAccentColor() {
  try {
    const saved = localStorage.getItem("appearance_accent_color") || "#A67165"
    applyAccentColor(saved)
  } catch {
    applyAccentColor("#A67165")
  }
}
