/**
 * Cross-Platform Utilities for Windows, macOS, and Linux
 */

export const isMac = (): boolean => {
  if (typeof navigator === "undefined") return false
  return /Mac|iPhone|iPod|iPad/i.test(navigator.userAgent || navigator.platform)
}

export const isLinux = (): boolean => {
  if (typeof navigator === "undefined") return false
  return /Linux/i.test(navigator.userAgent || navigator.platform)
}

export const isWindows = (): boolean => {
  if (typeof navigator === "undefined") return true
  return /Win/i.test(navigator.userAgent || navigator.platform)
}

/**
 * Returns OS-friendly display name for key modifiers
 * (e.g. 'Ctrl' -> '⌘ Cmd' or '⌘' on macOS)
 */
export const formatKeyForOS = (key: string): string => {
  if (!key) return ""
  const trimKey = key.trim()

  if (isMac()) {
    switch (trimKey.toLowerCase()) {
      case "ctrl":
      case "control":
        return "⌘ Cmd"
      case "alt":
        return "⌥ Option"
      case "shift":
        return "⇧ Shift"
      case "win":
      case "cmd":
      case "command":
      case "meta":
        return "⌘ Cmd"
      default:
        return trimKey
    }
  }

  // Windows / Linux standard key formatting
  switch (trimKey.toLowerCase()) {
    case "meta":
    case "cmd":
    case "command":
      return "Win"
    default:
      return trimKey
  }
}

/**
 * Formats a key combination string or array for the current OS
 * e.g. ["Ctrl", "Shift", "Q"] -> "⌘ Cmd + ⇧ Shift + Q" on macOS
 */
export const formatKeyCombo = (keys: string | string[]): string => {
  const keyList = Array.isArray(keys)
    ? keys
    : keys.split("+").map((k) => k.trim())

  return keyList.map(formatKeyForOS).join(" + ")
}

/**
 * Path normalization helper to prevent hardcoded backslashes
 */
export const normalizePath = (pathStr: string): string => {
  if (!pathStr) return ""
  return pathStr.replace(/\\/g, "/")
}

/**
 * Returns default OS user configuration directory
 */
export const getSystemConfigDir = (): string => {
  if (isMac()) return "~/Library/Application Support/Custon"
  if (isLinux()) return "~/.config/custon"
  return "%APPDATA%\\Custon"
}
