import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/Card"
import { Box, Code2, Globe, Heart } from "lucide-react"

export const About: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-up">
      {/* Page Title */}
      <div className="flex flex-col gap-2">
        <h2 className="page-title">About Custun</h2>
        <p className="body-text">Learn more about the systems powering this desktop application.</p>
      </div>

      <div className="grid gap-6">
        {/* Banner Card */}
        <Card className="overflow-hidden" style={{ borderRadius: "20px" }}>
          <div 
            className="flex flex-col items-center justify-center text-center border-b border-[rgba(166,113,101,0.15)] select-none"
            style={{
              background: "linear-gradient(135deg, rgba(242,216,194,0.3) 0%, rgba(166,113,101,0.1) 100%)",
              padding: "36px 24px",
            }}
          >
            <div 
              className="h-16 w-16 rounded-2xl flex items-center justify-center text-white shadow-lg mb-4"
              style={{
                background: "linear-gradient(135deg, #A67165 0%, #734E46 100%)",
                boxShadow: "0 4px 16px rgba(166,113,101,0.3)",
              }}
            >
              <span className="text-2xl font-black select-none animate-pulse" style={{ fontFamily: "system-ui, sans-serif" }}>C</span>
            </div>
            <h3 className="section-title" style={{ fontSize: "24px", color: "#252326" }}>Custun Desktop</h3>
            <p className="text-sm text-[#6B5B54] mt-1.5">A production-ready Tauri + React application boilerplate.</p>
            <div 
              className="mt-4 px-3.5 py-1 rounded-full text-xs font-mono font-bold"
              style={{
                background: "rgba(166,113,101,0.12)",
                color: "#A67165",
                border: "1px solid rgba(166,113,101,0.2)",
              }}
            >
              v0.1.0-alpha
            </div>
          </div>

          <CardContent style={{ padding: "28px" }}>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-1.5">
                <div className="text-xs font-bold text-[#9B8179] uppercase tracking-wider">Framework Core</div>
                <div className="text-sm font-semibold flex items-center gap-2.5 text-[#252326]">
                  <Box className="h-4.5 w-4.5 text-[#A67165]" /> Tauri v2 (Rust Backend)
                </div>
              </div>
              
              <div className="space-y-1.5">
                <div className="text-xs font-bold text-[#9B8179] uppercase tracking-wider">Frontend Interface</div>
                <div className="text-sm font-semibold flex items-center gap-2.5 text-[#252326]">
                  <Code2 className="h-4.5 w-4.5 text-[#A67165]" /> React 19 + TypeScript + Vite
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="text-xs font-bold text-[#9B8179] uppercase tracking-wider">Design System</div>
                <div className="text-sm font-semibold flex items-center gap-2.5 text-[#252326]">
                  <Globe className="h-4.5 w-4.5 text-[#A67165]" /> Tailwind CSS & styled elements
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="text-xs font-bold text-[#9B8179] uppercase tracking-wider">Platform support</div>
                <div className="text-sm font-semibold flex items-center gap-2.5 text-[#252326]">
                  <Globe className="h-4.5 w-4.5 text-[#A67165]" /> Microsoft Windows Desktop
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* License Card */}
        <Card style={{ borderRadius: "20px" }}>
          <CardHeader>
            <CardTitle style={{ fontSize: "18px" }}>License & Open Source</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-[#6B5B54]" style={{ padding: "20px 24px 28px 24px" }}>
            <p className="body-text" style={{ fontSize: "14px", lineHeight: "1.6" }}>
              Custun is built on open-source technologies under standard permissive developer licensing. It utilizes rust-safe system hooks to interact natively with Windows.
            </p>
            <div className="flex items-center gap-1.5 pt-2 text-xs text-[#A67165] font-bold">
              Made with <Heart className="h-3.5 w-3.5 fill-current text-rose-500" /> by the DeepMind Antigravity developer agent.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
