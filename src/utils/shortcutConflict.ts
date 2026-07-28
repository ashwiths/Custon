import { DEFAULT_KEY_SHORTCUTS } from "@/types/allKeysShortcuts"

export interface ConflictCheckResult {
  hasConflict: boolean
  conflictName?: string
}

/**
 * Checks if a proposed key combination is already assigned to another shortcut in:
 * 1. CustomizeAllKeys (General/System Key Shortcuts)
 * 2. TargetShortcuts (Workspace/Target App Shortcuts)
 */
export function checkShortcutConflict(
  proposedCombo: string,
  currentId?: string
): ConflictCheckResult {
  const normProposed = proposedCombo
    .split("+")
    .map((k: string) => k.trim().toLowerCase())
    .join(" + ")

  if (!normProposed) return { hasConflict: false }

  // 1. Check General Key Shortcuts (stored in localStorage or DEFAULT_KEY_SHORTCUTS)
  try {
    const savedKeys = localStorage.getItem("custom_all_key_shortcuts")
    const keyList = savedKeys ? JSON.parse(savedKeys) : DEFAULT_KEY_SHORTCUTS
    
    if (Array.isArray(keyList)) {
      for (const item of keyList) {
        if (item.id === currentId) continue
        if (item.status === false) continue

        const activeKey = (item.customShortcut || item.defaultShortcut || "").trim()
        if (!activeKey) continue

        const normActive = activeKey
          .split("+")
          .map((k: string) => k.trim().toLowerCase())
          .join(" + ")

        if (normActive === normProposed) {
          return { 
            hasConflict: true, 
            conflictName: item.action ? `General Hotkey (${item.action})` : "General Shortcut" 
          }
        }
      }
    }
  } catch {
    // Fallback
  }

  // 2. Check Target Workspace Shortcuts (stored in localStorage)
  try {
    const savedTargets = localStorage.getItem("custom_workspace_shortcuts")
    if (savedTargets) {
      const parsedTargets = JSON.parse(savedTargets)
      if (Array.isArray(parsedTargets)) {
        for (const item of parsedTargets) {
          if (item.id === currentId) continue
          if (!item.keys || !Array.isArray(item.keys)) continue

          const targetCombo = item.keys.join(" + ").trim()
          const normTarget = targetCombo
            .split("+")
            .map((k: string) => k.trim().toLowerCase())
            .join(" + ")

          if (normTarget === normProposed) {
            return { 
              hasConflict: true, 
              conflictName: item.name ? `Target Shortcut (${item.name})` : "Target Shortcut" 
            }
          }
        }
      }
    }
  } catch {
    // Fallback
  }

  return { hasConflict: false }
}
