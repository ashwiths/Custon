import * as React from "react"
import { FlaskConical, AlertTriangle, Bug } from "lucide-react"

export const ExperimentalTab: React.FC = () => {
  const [aiWorkspace, setAiWorkspace] = React.useState(() => {
    return localStorage.getItem("experimental_ai_workspace") === "true"
  })

  const [smartRestore, setSmartRestore] = React.useState(() => {
    return localStorage.getItem("experimental_smart_restore") !== "false"
  })

  const [smartGrouping, setSmartGrouping] = React.useState(() => {
    return localStorage.getItem("experimental_smart_grouping") === "true"
  })

  const [experimentalAnims, setExperimentalAnims] = React.useState(() => {
    return localStorage.getItem("experimental_animations") === "true"
  })

  const [betaEngine, setBetaEngine] = React.useState(() => {
    return localStorage.getItem("experimental_beta_engine") === "true"
  })

  const [developerMode, setDeveloperMode] = React.useState(() => {
    return localStorage.getItem("experimental_developer_mode") === "true"
  })

  const [verboseLogging, setVerboseLogging] = React.useState(() => {
    return localStorage.getItem("experimental_verbose_logging") === "true"
  })

  const [performanceOverlay, setPerformanceOverlay] = React.useState(() => {
    return localStorage.getItem("experimental_performance_overlay") === "true"
  })

  React.useEffect(() => {
    localStorage.setItem("experimental_ai_workspace", String(aiWorkspace))
    localStorage.setItem("experimental_smart_restore", String(smartRestore))
    localStorage.setItem("experimental_smart_grouping", String(smartGrouping))
    localStorage.setItem("experimental_animations", String(experimentalAnims))
    localStorage.setItem("experimental_beta_engine", String(betaEngine))
    localStorage.setItem("experimental_developer_mode", String(developerMode))
    localStorage.setItem("experimental_verbose_logging", String(verboseLogging))
    localStorage.setItem("experimental_performance_overlay", String(performanceOverlay))
  }, [aiWorkspace, smartRestore, smartGrouping, experimentalAnims, betaEngine, developerMode, verboseLogging, performanceOverlay])

  return (
    <div className="space-y-4">
      {/* Warning Alert */}
      <div className="p-3.5 rounded-xl bg-amber-600/10 border border-amber-500/20 text-amber-500 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4.5 h-4.5 shrink-0" />
          <div className="text-left">
            <div className="text-xs font-bold uppercase tracking-wider">Experimental features active</div>
            <div className="text-[9px] text-amber-500/70 font-semibold font-mono">These capabilities are unstable and might affect app responsiveness.</div>
          </div>
        </div>
        <span className="text-[9px] font-black uppercase bg-amber-600/20 border border-amber-500/30 px-2 py-0.5 rounded">UNSTABLE</span>
      </div>

      {/* 2-Column Split */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch">
        {/* Left Column Toggles (7 cols) */}
        <div className="md:col-span-7 space-y-3.5">
          {/* Smart Features */}
          <div className="p-4 rounded-xl border border-white/5 bg-black/10 dark:bg-black/25 space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-white">Smart Engine Tests</label>
            
            {/* AI Workspace */}
            <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
              <div className="text-left">
                <span className="text-xs font-bold text-[#F2D8C2] uppercase">AI Workspace Detection</span>
                <p className="text-[9px] text-[#9B8179] font-semibold mt-0.5">Use local model heuristics to auto-restore window focus layouts.</p>
              </div>
              <div
                onClick={() => setAiWorkspace(!aiWorkspace)}
                className={`w-9 h-5 rounded-full relative flex items-center px-0.5 cursor-pointer transition-all duration-200 ${
                  aiWorkspace ? "bg-[#A67165]" : "bg-white/10"
                }`}
              >
                <div className={`w-3.5 h-3.5 rounded-full bg-white transition-all ${aiWorkspace ? "translate-x-4" : "translate-x-0"}`} />
              </div>
            </div>

            {/* Smart Restore */}
            <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
              <div className="text-left">
                <span className="text-xs font-bold text-[#F2D8C2] uppercase">Smart Stagger Restore</span>
                <p className="text-[9px] text-[#9B8179] font-semibold mt-0.5">Throttles system API calls on massive restore waves to avoid CPU spikes.</p>
              </div>
              <div
                onClick={() => setSmartRestore(!smartRestore)}
                className={`w-9 h-5 rounded-full relative flex items-center px-0.5 cursor-pointer transition-all duration-200 ${
                  smartRestore ? "bg-[#A67165]" : "bg-white/10"
                }`}
              >
                <div className={`w-3.5 h-3.5 rounded-full bg-white transition-all ${smartRestore ? "translate-x-4" : "translate-x-0"}`} />
              </div>
            </div>

            {/* Smart Grouping */}
            <div className="flex items-center justify-between">
              <div className="text-left">
                <span className="text-xs font-bold text-[#F2D8C2] uppercase">Smart Workflow Grouping</span>
                <p className="text-[9px] text-[#9B8179] font-semibold mt-0.5">Auto-bundles active windows created together into hotkeys presets.</p>
              </div>
              <div
                onClick={() => setSmartGrouping(!smartGrouping)}
                className={`w-9 h-5 rounded-full relative flex items-center px-0.5 cursor-pointer transition-all duration-200 ${
                  smartGrouping ? "bg-[#A67165]" : "bg-white/10"
                }`}
              >
                <div className={`w-3.5 h-3.5 rounded-full bg-white transition-all ${smartGrouping ? "translate-x-4" : "translate-x-0"}`} />
              </div>
            </div>
          </div>

          {/* Rendering tests */}
          <div className="p-4 rounded-xl border border-white/5 bg-black/10 dark:bg-black/25 space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-white">Rendering Flags</label>
            
            {/* GPU Anims */}
            <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
              <div className="text-left">
                <span className="text-xs font-bold text-[#F2D8C2] uppercase">Experimental Animations</span>
                <p className="text-[9px] text-[#9B8179] font-semibold mt-0.5">Unlock GPU compositor layouts for smoother tab movements.</p>
              </div>
              <div
                onClick={() => setExperimentalAnims(!experimentalAnims)}
                className={`w-9 h-5 rounded-full relative flex items-center px-0.5 cursor-pointer transition-all duration-200 ${
                  experimentalAnims ? "bg-[#A67165]" : "bg-white/10"
                }`}
              >
                <div className={`w-3.5 h-3.5 rounded-full bg-white transition-all ${experimentalAnims ? "translate-x-4" : "translate-x-0"}`} />
              </div>
            </div>

            {/* Beta Render */}
            <div className="flex items-center justify-between">
              <div className="text-left">
                <span className="text-xs font-bold text-[#F2D8C2] uppercase">Beta Composition Engine</span>
                <p className="text-[9px] text-[#9B8179] font-semibold mt-0.5">Runs webview composition tests (uses canvas rendering engine).</p>
              </div>
              <div
                onClick={() => setBetaEngine(!betaEngine)}
                className={`w-9 h-5 rounded-full relative flex items-center px-0.5 cursor-pointer transition-all duration-200 ${
                  betaEngine ? "bg-[#A67165]" : "bg-white/10"
                }`}
              >
                <div className={`w-3.5 h-3.5 rounded-full bg-white transition-all ${betaEngine ? "translate-x-4" : "translate-x-0"}`} />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column Debug Tools (5 cols) */}
        <div className="md:col-span-5 bg-black/35 p-5 rounded-2xl border border-white/5 flex flex-col justify-between space-y-4">
          <div className="flex justify-between items-center border-b border-white/5 pb-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#9B8179]">Developer Sandbox</span>
            <FlaskConical className="w-3.5 h-3.5 text-[#A67165] animate-pulse" />
          </div>

          <div className="space-y-3 font-semibold text-xs text-[#9B8179]">
            {/* Developer Mode */}
            <div className="flex items-center justify-between">
              <span className="hover:text-[#F2D8C2] cursor-pointer uppercase font-bold text-white text-[10px]" onClick={() => setDeveloperMode(!developerMode)}>
                Developer Mode Panel
              </span>
              <div
                onClick={() => setDeveloperMode(!developerMode)}
                className={`w-9 h-5 rounded-full relative flex items-center px-0.5 cursor-pointer transition-all duration-200 ${
                  developerMode ? "bg-[#A67165]" : "bg-white/10"
                }`}
              >
                <div className={`w-3.5 h-3.5 rounded-full bg-white transition-all ${developerMode ? "translate-x-4" : "translate-x-0"}`} />
              </div>
            </div>

            {/* Verbose Logs */}
            <div className="flex items-center justify-between">
              <span className="hover:text-[#F2D8C2] cursor-pointer uppercase font-bold text-white text-[10px]" onClick={() => setVerboseLogging(!verboseLogging)}>
                Verbose API Logs
              </span>
              <div
                onClick={() => setVerboseLogging(!verboseLogging)}
                className={`w-9 h-5 rounded-full relative flex items-center px-0.5 cursor-pointer transition-all duration-200 ${
                  verboseLogging ? "bg-[#A67165]" : "bg-white/10"
                }`}
              >
                <div className={`w-3.5 h-3.5 rounded-full bg-white transition-all ${verboseLogging ? "translate-x-4" : "translate-x-0"}`} />
              </div>
            </div>

            {/* Performance overlay */}
            <div className="flex items-center justify-between">
              <span className="hover:text-[#F2D8C2] cursor-pointer uppercase font-bold text-white text-[10px]" onClick={() => setPerformanceOverlay(!performanceOverlay)}>
                Performance Overlay (FPS)
              </span>
              <div
                onClick={() => setPerformanceOverlay(!performanceOverlay)}
                className={`w-9 h-5 rounded-full relative flex items-center px-0.5 cursor-pointer transition-all duration-200 ${
                  performanceOverlay ? "bg-[#A67165]" : "bg-white/10"
                }`}
              >
                <div className={`w-3.5 h-3.5 rounded-full bg-white transition-all ${performanceOverlay ? "translate-x-4" : "translate-x-0"}`} />
              </div>
            </div>
          </div>

          <div className="pt-3.5 border-t border-white/5 text-[9px] text-[#9B8179] leading-relaxed text-left flex gap-1.5 items-start">
            <Bug className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
            <div>
              Developer Mode activates console inspect options (`F12` inside webview windows). Performance overlay outputs real-time frame rates and IPC statistics.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
