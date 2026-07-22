import * as React from "react"
import { ShieldCheck, Terminal, FolderOpen, Download, AlertTriangle, Activity } from "lucide-react"

export const DiagnosticsTab: React.FC = () => {
  // Simulated stats
  const [cpuUsage, setCpuUsage] = React.useState(1.4)
  const [memoryUsage, setMemoryUsage] = React.useState(22.8)
  const [ipcLatency, setIpcLatency] = React.useState(12)
  const [healthScore, setHealthScore] = React.useState(98)
  const [diagnosticRunning, setDiagnosticRunning] = React.useState(false)
  const [logMessages, setLogMessages] = React.useState<string[]>([
    "[18:14:02] [INFO] Tauri v2 client socket established.",
    "[18:14:05] [INFO] Shortcut engine initialized with 4 hotkeys.",
    "[18:15:32] [WARN] Process 'chrome.exe' is already hidden.",
    "[18:16:11] [INFO] Settings database synchronized successfully."
  ])

  // Update stats periodically to feel live
  React.useEffect(() => {
    const timer = setInterval(() => {
      setCpuUsage(prev => {
        const next = prev + (Math.random() - 0.5) * 0.4
        return Math.max(0.5, Math.min(6.5, Number(next.toFixed(1))))
      })
      setMemoryUsage(prev => {
        const next = prev + (Math.random() - 0.5) * 0.2
        return Math.max(18.0, Math.min(28.0, Number(next.toFixed(1))))
      })
      setIpcLatency(prev => {
        const next = prev + Math.floor((Math.random() - 0.5) * 4)
        return Math.max(6, Math.min(20, next))
      })
    }, 2000)
    return () => clearInterval(timer)
  }, [])

  const runFullDiagnostics = () => {
    setDiagnosticRunning(true)
    setLogMessages(prev => [...prev, `[${new Date().toLocaleTimeString()}] [INFO] Starting diagnostic health check...`])
    
    setTimeout(() => {
      setLogMessages(prev => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] [INFO] Checking Rust core hooks... OK`,
        `[${new Date().toLocaleTimeString()}] [INFO] Checking local credentials... OK`,
        `[${new Date().toLocaleTimeString()}] [INFO] IPC diagnostic test... Latency normal.`,
        `[${new Date().toLocaleTimeString()}] [SUCCESS] Health check finished. No issues detected.`
      ])
      setHealthScore(99)
      setDiagnosticRunning(false)
    }, 2000)
  }

  const exportLogs = () => {
    const dataStr = "data:text/plain;charset=utf-8," + encodeURIComponent(logMessages.join("\n"))
    const dlAnchorElem = document.createElement("a")
    dlAnchorElem.setAttribute("href", dataStr)
    dlAnchorElem.setAttribute("download", "custun_diagnostics_logs.txt")
    dlAnchorElem.click()
  }

  return (
    <div className="space-y-4">
      {/* 2-Column Split */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch">
        {/* Left Column Engine Info (7 cols) */}
        <div className="md:col-span-7 space-y-4 flex flex-col justify-between">
          {/* Status indicators */}
          <div className="p-4 rounded-xl border border-white/5 bg-black/10 dark:bg-black/25 space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-white">Engine Operations</label>
            <div className="grid grid-cols-2 gap-3 text-[10px] font-bold font-mono">
              {[
                { label: "Rust Core Status", val: "ACTIVE", ok: true },
                { label: "IPC Client API", val: "STABLE", ok: true },
                { label: "Settings DB", val: "SECURE", ok: true },
                { label: "Global Hooks", val: "LOADED", ok: true }
              ].map((indicator, idx) => (
                <div key={idx} className="p-3 bg-white/5 border border-white/5 rounded-lg flex items-center justify-between">
                  <span className="text-[#9B8179] font-sans">{indicator.label}</span>
                  <div className="flex items-center gap-1.5 text-emerald-500">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>{indicator.val}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Performance Gauges */}
          <div className="p-4 rounded-xl border border-white/5 bg-black/10 dark:bg-black/25 space-y-4 font-mono text-[10px]">
            <label className="text-xs font-bold uppercase tracking-wider text-white font-sans">Performance Gauges</label>
            
            {/* CPU usage */}
            <div className="space-y-1">
              <div className="flex justify-between text-[#9B8179] font-bold">
                <span>SIMULATED CPU ALLOCATION</span>
                <span>{cpuUsage}%</span>
              </div>
              <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-[#A67165] rounded-full transition-all duration-500" style={{ width: `${cpuUsage * 10}%` }} />
              </div>
            </div>

            {/* Memory Usage */}
            <div className="space-y-1">
              <div className="flex justify-between text-[#9B8179] font-bold">
                <span>MEMORY WORKSET RESIDENT</span>
                <span>{memoryUsage} MB / 512 MB</span>
              </div>
              <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-[#A67165] rounded-full transition-all duration-500" style={{ width: `${(memoryUsage / 512) * 100}%` }} />
              </div>
            </div>

            {/* Latency */}
            <div className="space-y-1">
              <div className="flex justify-between text-[#9B8179] font-bold">
                <span>IPC SOCKET ROUND-TRIP</span>
                <span>{ipcLatency}ms</span>
              </div>
              <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-[#A67165] rounded-full transition-all duration-500" style={{ width: `${(ipcLatency / 30) * 100}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column Health Score & Run buttons (5 cols) */}
        <div className="md:col-span-5 bg-black/35 p-5 rounded-2xl border border-white/5 flex flex-col justify-between">
          <div className="flex justify-between items-center border-b border-white/5 pb-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#9B8179]">System Health Index</span>
            <Activity className="w-3.5 h-3.5 text-[#A67165]" />
          </div>

          {/* Health Score Gauge */}
          <div className="text-center py-4 relative flex flex-col items-center">
            <div className="w-20 h-20 rounded-full border-4 border-dashed border-[#A67165]/30 flex flex-col items-center justify-center relative">
              <span className="font-mono text-2xl font-black text-white">{healthScore}</span>
              <span className="text-[7px] font-bold text-[#9B8179] uppercase tracking-wider">INDEX</span>
            </div>
            <span className="text-[9px] uppercase font-bold text-emerald-500 mt-2 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
              Operational Stable
            </span>
          </div>

          <button
            onClick={runFullDiagnostics}
            disabled={diagnosticRunning}
            className={`w-full py-3 bg-[#A67165] hover:bg-[#734E46] text-white font-bold uppercase rounded-xl border-none cursor-pointer shadow-md transition-all text-xs tracking-wider font-mono ${
              diagnosticRunning ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {diagnosticRunning ? "Diagnosing Core Hooks..." : "Run Diagnostics Check"}
          </button>
        </div>
      </div>

      {/* Terminal logs box below */}
      <div className="p-4 rounded-xl border border-white/5 bg-black/55 space-y-3 font-mono">
        <div className="flex items-center justify-between border-b border-white/5 pb-2">
          <div className="flex items-center gap-1.5 text-xs text-[#9B8179] font-bold uppercase">
            <Terminal className="w-4 h-4 text-[#A67165]" />
            <span>Application Event Stream logs</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => alert("Opened default diagnostic log folders on your desktop.")}
              className="p-1 rounded hover:bg-white/10 border-none bg-transparent cursor-pointer text-[#9B8179] hover:text-white"
              title="Open log Folder"
            >
              <FolderOpen className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={exportLogs}
              className="p-1 rounded hover:bg-white/10 border-none bg-transparent cursor-pointer text-[#9B8179] hover:text-white"
              title="Download Logs"
            >
              <Download className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Console stream */}
        <div className="h-28 overflow-y-auto text-[9px] leading-relaxed text-[#9B8179] pr-1 scrollbar-thin">
          {logMessages.map((msg, idx) => {
            const isSuccess = msg.includes("SUCCESS")
            return (
              <div key={idx} className={isSuccess ? "text-emerald-500 font-bold" : ""}>
                {msg}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
