import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import obfuscator from "vite-plugin-javascript-obfuscator";
import path from "path";

// @ts-expect-error process is a nodejs global
const host = process.env.TAURI_DEV_HOST;

// https://vite.dev/config/
export default defineConfig(async () => ({
  plugins: [
    react(),
    obfuscator({
      apply: "build",
      options: {
        compact: true,
        controlFlowFlattening: true,
        controlFlowFlatteningThreshold: 0.5,
        deadCodeInjection: false,
        debugProtection: false,
        disableConsoleOutput: true,
        identifierNamesGenerator: "hexadecimal",
        log: false,
        numbersToExpressions: false,
        renameGlobals: false,
        selfDefending: false,
        simplify: true,
        splitStrings: false,
        stringArray: true,
        stringArrayCallsTransform: true,
        stringArrayCallsTransformThreshold: 0.5,
        stringArrayEncoding: [],
        stringArrayIndexShift: true,
        stringArrayRotate: true,
        stringArrayShuffle: true,
        stringArrayWrappersCount: 1,
        stringArrayWrappersChainedCalls: false,
        stringArrayWrappersParametersMaxCount: 2,
        stringArrayWrappersType: "variable",
        stringArrayThreshold: 0.5,
        transformObjectKeys: false,
        unicodeEscapeSequence: false,
        reservedNames: [
          "invoke", "listen", "emit",
          "sync_shortcuts", "sync_all_key_shortcuts", "toggle_workspace", "toggle_target_shortcut",
          "get_workspace_state", "get_running_apps", "set_autostart", "get_autostart_status",
          "restore_all_hidden", "send_exam_complaint", "set_workspace_hotkey",
          "shortcuts", "shortcutId", "targetApps", "mode", "isFullClose", "executionMode",
          "defaultShortcut", "customShortcut", "systemAction", "apps", "keys", "name", "id",
          "status", "lastUsed", "category", "action", "enable", "keyCombo",
          "__TAURI_INTERNALS__", "__TAURI__", "__TAURI_PATTERN__", "__TAURI_IPC__"
        ],
        reservedStrings: [
          "sync_shortcuts", "sync_all_key_shortcuts", "toggle_workspace", "toggle_target_shortcut",
          "get_workspace_state", "get_running_apps", "set_autostart", "get_autostart_status",
          "restore_all_hidden", "send_exam_complaint", "set_workspace_hotkey",
          "shortcut-trigger-event", "workspace-toggle-event",
          "shortcuts", "shortcutId", "targetApps", "mode", "isFullClose", "executionMode"
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
  //
  // 1. prevent Vite from obscuring rust errors
  clearScreen: false,
  // 2. tauri expects a fixed port, fail if that port is not available
  server: {
    port: 1420,
    strictPort: true,
    host: host || false,
    hmr: host
      ? {
          protocol: "ws",
          host,
          port: 1421,
        }
      : undefined,
    watch: {
      // 3. tell Vite to ignore watching `src-tauri`
      ignored: ["**/src-tauri/**"],
    },
  },
  build: {
    target: "esnext",
    sourcemap: false,
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
      format: {
        comments: false,
      },
    },
    cssMinify: true,
    rollupOptions: {
      output: {
        manualChunks: {
          "vendor-lucide": ["lucide-react"],
          "vendor-anime": ["animejs"],
          "vendor-emailjs": ["@emailjs/browser"],
        },
      },
    },
  },
}));

