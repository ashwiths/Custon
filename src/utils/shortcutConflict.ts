import { DEFAULT_KEY_SHORTCUTS, KeyShortcutItem } from "@/types/allKeysShortcuts"

export interface ConflictCheckResult {
  hasConflict: boolean
  conflictName?: string
}

let cachedTargetShortcuts: any[] = []
let lastTargetCacheTime = 0

function getTargetShortcutsCached(): any[] {
  const now = Date.now()
  if (now - lastTargetCacheTime < 1000 && cachedTargetShortcuts.length > 0) {
    return cachedTargetShortcuts
  }
  try {
    const savedTargets = localStorage.getItem("custom_workspace_shortcuts")
    if (savedTargets) {
      cachedTargetShortcuts = JSON.parse(savedTargets) || []
      lastTargetCacheTime = now
      return cachedTargetShortcuts
    }
  } catch {
    // Ignore
  }
  cachedTargetShortcuts = []
  lastTargetCacheTime = now
  return []
}

/**
 * Normalizes a key combination string into a canonical order-agnostic format.
 * E.g., "Ctrl + Shift + V" and "Shift + Ctrl + V" both normalize to "ctrl + shift + v".
 */
export function normalizeCombo(comboStr: string): string {
  if (!comboStr || !comboStr.trim()) return ""
  const parts = comboStr
    .split("+")
    .map((k: string) => k.trim().toLowerCase())
    .filter(Boolean)

  const modifiers: string[] = []
  const mainKeys: string[] = []

  for (const part of parts) {
    if (["ctrl", "control", "alt", "shift", "win", "cmd", "meta"].includes(part)) {
      if (part === "control") modifiers.push("ctrl")
      else if (part === "cmd" || part === "meta") modifiers.push("win")
      else modifiers.push(part)
    } else {
      mainKeys.push(part)
    }
  }

  modifiers.sort()
  mainKeys.sort()

  return [...modifiers, ...mainKeys].join(" + ")
}

/**
 * Checks if a proposed key combination is already assigned to another shortcut in:
 * 1. General/System Key Shortcuts (in-memory or localStorage or DEFAULT_KEY_SHORTCUTS)
 * 2. Target Workspace Shortcuts (localStorage cached)
 */
export function checkShortcutConflict(
  proposedCombo: string,
  currentId?: string,
  inMemoryGeneralKeys?: KeyShortcutItem[]
): ConflictCheckResult {
  const normProposed = normalizeCombo(proposedCombo)

  if (!normProposed) return { hasConflict: false }

  // 1. Determine active list of general key shortcuts
  let generalList: KeyShortcutItem[] = DEFAULT_KEY_SHORTCUTS
  if (inMemoryGeneralKeys && inMemoryGeneralKeys.length > 0) {
    generalList = inMemoryGeneralKeys
  } else {
    try {
      const savedKeys = localStorage.getItem("custom_all_key_shortcuts")
      if (savedKeys) {
        const parsed = JSON.parse(savedKeys)
        if (Array.isArray(parsed) && parsed.length > 0) {
          generalList = parsed
        }
      }
    } catch {
      // Ignore
    }
  }

  // 1a. Check general key list (both custom and default active shortcuts)
  for (const item of generalList) {
    if (item.id === currentId) continue
    if (item.status === false) continue

    // Check custom shortcut if set
    if (item.customShortcut && item.customShortcut.trim()) {
      if (normalizeCombo(item.customShortcut) === normProposed) {
        return {
          hasConflict: true,
          conflictName: item.action ? `General Hotkey (${item.action})` : "General Shortcut"
        }
      }
    }

    // Check default shortcut if custom is not set or even if custom is set
    if (item.defaultShortcut && item.defaultShortcut.trim()) {
      if (normalizeCombo(item.defaultShortcut) === normProposed) {
        return {
          hasConflict: true,
          conflictName: item.action ? `Default Hotkey (${item.action})` : "Default Shortcut"
        }
      }
    }
  }

  // 2. Check Target Workspace Shortcuts (using cached target shortcuts)
  const targets = getTargetShortcutsCached()
  for (const item of targets) {
    if (item.id === currentId) continue
    if (!item.keys || !Array.isArray(item.keys)) continue

    const targetCombo = item.keys.join(" + ").trim()
    if (normalizeCombo(targetCombo) === normProposed) {
      return {
        hasConflict: true,
        conflictName: item.name ? `Target Shortcut (${item.name})` : "Target Workspace Shortcut"
      }
    }
  }

  return { hasConflict: false }
}
