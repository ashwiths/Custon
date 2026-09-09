import { invoke } from "@tauri-apps/api/core"
import { type ShortcutItem } from "@/pages/Dashboard"
import { type KeyShortcutItem, DEFAULT_KEY_SHORTCUTS } from "@/types/allKeysShortcuts"

export const SHORTCUTS_STORAGE_KEY = "custom_workspace_shortcuts"
export const ALL_KEYS_STORAGE_KEY = "custom_all_key_shortcuts"
export const FULL_CLOSE_STORAGE_KEY = "custom_full_close_shortcut"

export const DEFAULT_INITIAL_SHORTCUTS: ShortcutItem[] = [
  {
    id: "1",
    name: "Chrome • VS Code • Discord",
    apps: ["chrome", "vscode", "discord"],
    keys: ["Ctrl", "Shift", "Q"],
    status: "Enabled",
    lastUsed: "Recently",
    executionMode: "stealth"
  },
  {
    id: "2",
    name: "Close All Open Windows",
    apps: ["all-apps"],
    keys: ["Ctrl", "Alt", "X"],
    status: "Enabled",
    lastUsed: "Recently",
    isFullClose: true,
    executionMode: "stealth"
  }
]

/**
 * Loads target workspace shortcuts from persistent disk storage via Rust backend,
 * falling back to localStorage if in a browser environment.
 */
export async function loadSavedShortcuts(): Promise<ShortcutItem[]> {
  try {
    const fromBackend = await invoke<ShortcutItem[]>("get_saved_shortcuts")
    if (Array.isArray(fromBackend) && fromBackend.length > 0) {
      try {
        localStorage.setItem(SHORTCUTS_STORAGE_KEY, JSON.stringify(fromBackend))
      } catch {}
      return fromBackend
    }
  } catch (e) {
    // Non-Tauri fallback or backend error
  }

  try {
    const saved = localStorage.getItem(SHORTCUTS_STORAGE_KEY)
    if (saved) {
      const parsed = JSON.parse(saved)
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Sync to backend so disk stays updated
        invoke("sync_shortcuts", { shortcuts: parsed }).catch(() => {})
        return parsed
      }
    }
  } catch {}

  // First run initialization: save and return defaults
  try {
    localStorage.setItem(SHORTCUTS_STORAGE_KEY, JSON.stringify(DEFAULT_INITIAL_SHORTCUTS))
    invoke("sync_shortcuts", { shortcuts: DEFAULT_INITIAL_SHORTCUTS }).catch(() => {})
  } catch {}

  return DEFAULT_INITIAL_SHORTCUTS
}

/**
 * Synchronously retrieves cached shortcuts from localStorage for instant initial render.
 */
export function getCachedShortcuts(): ShortcutItem[] {
  try {
    const saved = localStorage.getItem(SHORTCUTS_STORAGE_KEY)
    if (saved) {
      const parsed = JSON.parse(saved)
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed
      }
    }
  } catch {}
  return DEFAULT_INITIAL_SHORTCUTS
}

/**
 * Persists shortcuts both to physical disk via Rust backend and to localStorage,
 * broadcasting an update event so all views stay in sync.
 */
export async function persistShortcuts(shortcuts: ShortcutItem[]): Promise<void> {
  try {
    localStorage.setItem(SHORTCUTS_STORAGE_KEY, JSON.stringify(shortcuts))
  } catch {}

  try {
    await invoke("sync_shortcuts", { shortcuts })
  } catch {}

  window.dispatchEvent(new CustomEvent("custon-shortcuts-updated", { detail: shortcuts }))
}

/**
 * Loads all-key shortcuts from persistent backend storage.
 */
export async function loadSavedAllKeys(): Promise<KeyShortcutItem[]> {
  try {
    const fromBackend = await invoke<KeyShortcutItem[]>("get_saved_all_key_shortcuts")
    if (Array.isArray(fromBackend) && fromBackend.length > 0) {
      try {
        localStorage.setItem(ALL_KEYS_STORAGE_KEY, JSON.stringify(fromBackend))
      } catch {}
      return fromBackend
    }
  } catch {}

  try {
    const saved = localStorage.getItem(ALL_KEYS_STORAGE_KEY)
    if (saved) {
      const parsed = JSON.parse(saved)
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed
      }
    }
  } catch {}

  return DEFAULT_KEY_SHORTCUTS
}

/**
 * Persists all-key shortcuts to disk and localStorage.
 */
export async function persistAllKeys(shortcuts: KeyShortcutItem[]): Promise<void> {
  try {
    localStorage.setItem(ALL_KEYS_STORAGE_KEY, JSON.stringify(shortcuts))
  } catch {}

  try {
    await invoke("sync_all_key_shortcuts", { shortcuts })
  } catch {}

  window.dispatchEvent(new CustomEvent("custon-all-keys-updated", { detail: shortcuts }))
}
