import * as React from "react"
import { BarChart, Clock, Award, Activity } from "lucide-react"

export const StatisticsTab: React.FC = () => {
  // Session stopwatch
  const [sessionSecs, setSessionSecs] = React.useState(0)
  // Engine uptime simulator starting at 187,932 seconds (~2.1 days)
  const [uptimeSecs, setUptimeSecs] = React.useState(187932)

  // Trigger counters
  const statsCounters = [
    { label: "Shortcuts Executed", value: "1,284", desc: "Total triggers processed" },
    { label: "Total Hidden Apps", value: "56", desc: "Distinct process targets" },
    { label: "Total Restores", value: "942", desc: "Applications recovered" },
    { label: "Avg Restore Time", value: "120ms", desc: "System thread response" }
  ]

  // Live stopwatch effects
  React.useEffect(() => {
    const timer = setInterval(() => {
      setSessionSecs(prev => prev + 1)
      setUptimeSecs(prev => prev + 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // Format time utility (secs -> D h m s)
  const formatUptime = (totalSeconds: number) => {
    const d = Math.floor(totalSeconds / (3600 * 24))
    const h = Math.floor((totalSeconds % (3600 * 24)) / 3600)
    const m = Math.floor((totalSeconds % 3600) / 60)
    const s = totalSeconds % 60
    return `${d}d ${h}h ${m}m ${s}s`
  }

  const formatSession = (totalSeconds: number) => {
    const m = Math.floor(totalSeconds / 60)
    const s = totalSeconds % 60
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
  }

  // Visual bar chart heights (last 7 days trigger frequencies)
  const activityData = [
    { day: "Thu", count: 184 },
    { day: "Fri", count: 142 },
    { day: "Sat", count: 88 },
    { day: "Sun", count: 42 },
    { day: "Mon", count: 198 },
    { day: "Tue", count: 245 },
    { day: "Wed", count: 212 }
  ]
  const maxCount = Math.max(...activityData.map(d => d.count))

  return (
    <div className="space-y-4">
      {/* Upper Grid Counters */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        {statsCounters.map((stat, idx) => (
          <div key={idx} className="p-4 rounded-xl border border-white/5 bg-black/10 dark:bg-black/25 space-y-1 text-left relative overflow-hidden group">
            <span className="text-[10px] font-bold text-[#9B8179] uppercase tracking-wide">{stat.label}</span>
            <div className="text-xl font-black text-white font-mono">{stat.value}</div>
            <span className="text-[8px] text-[#9B8179]/60 font-semibold">{stat.desc}</span>
            <div className="absolute top-1 right-1 w-6 h-6 rounded-full bg-white/5 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
              <Activity className="w-3 h-3 text-[#A67165]" />
            </div>
          </div>
        ))}
      </div>

      {/* 2-Column split chart / uptime */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch">
        {/* Left Column Activity Graph (7 cols) */}
        <div className="md:col-span-7 bg-black/25 p-5 rounded-2xl border border-white/5 flex flex-col justify-between min-h-[220px]">
          <div className="flex justify-between items-center border-b border-white/5 pb-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#9B8179]">7-Day Trigger Frequency</span>
            <BarChart className="w-3.5 h-3.5 text-[#A67165]" />
          </div>

          {/* Bar Chart Flex layout */}
          <div className="flex items-end justify-between h-28 pt-4 px-2 font-mono text-[9px]">
            {activityData.map((d, idx) => {
              const heightPct = (d.count / maxCount) * 100
              return (
                <div key={idx} className="flex flex-col items-center gap-2 group cursor-pointer">
                  {/* Tooltip on hover */}
                  <span className="opacity-0 group-hover:opacity-100 transition-all font-bold text-[#A67165] bg-[#A67165]/10 border border-[#A67165]/20 px-1 py-0.5 rounded text-[8px]">
                    {d.count}
                  </span>
                  {/* Bar */}
                  <div
                    className="w-6 rounded-t bg-[#A67165] group-hover:bg-[#734E46] transition-all duration-300 shadow-[0_0_8px_rgba(166,113,101,0.2)]"
                    style={{ height: `${heightPct * 0.7}px` }}
                  />
                  <span className="text-[#9B8179] font-bold uppercase">{d.day}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Right Column Stopwatches (5 cols) */}
        <div className="md:col-span-5 bg-black/35 p-5 rounded-2xl border border-white/5 flex flex-col justify-between space-y-4">
          <div className="flex justify-between items-center border-b border-white/5 pb-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#9B8179]">Engine Stopwatches</span>
            <Clock className="w-3.5 h-3.5 text-[#A67165] animate-spin" style={{ animationDuration: "10s" }} />
          </div>

          <div className="space-y-3.5 text-left font-mono">
            {/* Live Uptime */}
            <div>
              <span className="text-[9px] text-[#9B8179] font-bold uppercase">Tauri Service Uptime:</span>
              <div className="text-sm font-black text-white tracking-wide mt-0.5">{formatUptime(uptimeSecs)}</div>
            </div>

            {/* Current Session Duration */}
            <div>
              <span className="text-[9px] text-[#9B8179] font-bold uppercase">Current Session Duration:</span>
              <div className="text-sm font-black text-white tracking-wide mt-0.5">{formatSession(sessionSecs)}</div>
            </div>
          </div>

          {/* Quick Insights footer */}
          <div className="pt-3 border-t border-white/5 text-[9px] text-[#9B8179] leading-relaxed text-left flex items-start gap-2">
            <Award className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <span>Favorite: **Alt + H** (412 uses)</span>
              <br />
              <span>Target: **chrome.exe** (hidden 84 times)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
