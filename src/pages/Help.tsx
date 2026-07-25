import * as React from "react"
import { 
  Send, 
  CheckCircle2, 
  LifeBuoy, 
  Mail, 
  ShieldAlert, 
  MessageSquare,
  Clock,
  Upload,
  X,
  AlertCircle
} from "lucide-react"
import { sendSupportTicketEmail } from "@/services/emailService"

export const HelpPage: React.FC = () => {
  const [email, setEmail] = React.useState("")
  const [category, setCategory] = React.useState("General Feedback & Issue")
  const [complaintText, setComplaintText] = React.useState("")
  const [priority, setPriority] = React.useState<"normal" | "urgent">("normal")
  const [includeDiagnostics, setIncludeDiagnostics] = React.useState(true)

  const [selectedImage, setSelectedImage] = React.useState<File | null>(null)
  const [imagePreview, setImagePreview] = React.useState<string | null>(null)

  const [validationError, setValidationError] = React.useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [submitResult, setSubmitResult] = React.useState<{
    success: boolean
    message: string
    ticketId?: string
  } | null>(null)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setSelectedImage(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const handleRemoveImage = () => {
    setSelectedImage(null)
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview)
      setImagePreview(null)
    }
  }

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = (error) => reject(error)
    })
  }

  const validateForm = (): boolean => {
    setValidationError(null)

    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setValidationError("Please enter a valid email address (e.g. name@domain.com).")
      return false
    }

    if (!complaintText.trim() || complaintText.trim().length < 10) {
      setValidationError("Please provide at least 10 characters describing your issue or feedback.")
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsSubmitting(true)
    setSubmitResult(null)

    const ticketId = `TICKET-${Math.floor(100000 + Math.random() * 900000)}`

    try {
      let imageDataUrl: string | null = null
      if (selectedImage) {
        try {
          imageDataUrl = await fileToBase64(selectedImage)
        } catch {
          // Ignore
        }
      }

      // 1. Invoke Tauri Rust Backend Command
      try {
        const { invoke } = await import("@tauri-apps/api/core")
        await invoke("send_exam_complaint", {
          email: email.trim() || "user@custon.app",
          examName: "General Issue",
          category,
          complaintText: complaintText.trim(),
          priority,
          includeDiagnostics
        })
      } catch {
        // Fallback for non-tauri
      }

      // 2. Dispatch Direct Email Notification to Support Inbox via EmailJS SDK / Webhook
      const emailResult = await sendSupportTicketEmail({
        ticketId,
        userEmail: email.trim() || "user@custon.app",
        category,
        description: complaintText.trim(),
        priority,
        includeDiagnostics,
        imageDataUrl
      })

      setSubmitResult({
        success: true,
        message: emailResult.message,
        ticketId
      })

      // Reset form fields on successful email dispatch
      setComplaintText("")
      handleRemoveImage()
    } catch (err: any) {
      setSubmitResult({
        success: false,
        message: err?.message || "Failed to transmit ticket. Please check internet connection.",
        ticketId
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-8 animate-fade-up select-none pb-12 relative text-left">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div className="space-y-1">
          <h1 className="text-[32px] font-black text-[#252326] dark:text-[#F2D8C2] flex items-center gap-3">
            <LifeBuoy className="h-8 w-8 text-[var(--accent-color,#A67165)]" />
            <span>Help & Support</span>
          </h1>
          <p className="text-sm font-semibold text-[#6B5B54] dark:text-[#A69281] max-w-[700px]">
            Need help or facing an issue? Send us your message or screenshot below. We'll receive your email directly.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-[#A69281] bg-white/10 dark:bg-white/5 p-3 rounded-2xl border border-white/10 shrink-0">
          <Clock className="w-4 h-4 text-emerald-400 animate-pulse" />
          <span>Support Status: <strong>24/7 Active</strong></span>
        </div>
      </div>

      {/* Main Grid: Form on Left, FAQ on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Form (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="glass-card p-8 border-[rgba(255,255,255,0.28)] relative overflow-hidden" style={{ borderRadius: "24px" }}>
            
            {/* Top Badge */}
            <div className="flex items-center gap-2 text-xs font-bold text-[var(--accent-color,#A67165)] uppercase tracking-wider mb-4">
              <ShieldAlert className="w-4 h-4" />
              <span>Submit Support Ticket & Feedback</span>
            </div>

            {/* Validation Error Alert */}
            {validationError && (
              <div className="p-4 rounded-2xl border mb-6 flex items-center gap-3 animate-fade-up bg-rose-500/15 border-rose-500/30 text-rose-300">
                <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
                <p className="text-xs font-semibold">{validationError}</p>
              </div>
            )}

            {/* Submission Status Alert */}
            {submitResult && (
              <div className={`p-4 rounded-2xl border mb-6 flex items-start gap-3 animate-fade-up ${
                submitResult.success 
                  ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-300"
                  : "bg-rose-500/15 border-rose-500/30 text-rose-300"
              }`}>
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div className="text-xs font-bold uppercase tracking-wider">
                    Ticket Received • Reference #{submitResult.ticketId}
                  </div>
                  <p className="text-xs leading-relaxed">{submitResult.message}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Email Address Field */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#252326] dark:text-[#F2D8C2] uppercase tracking-wider block">
                  Your Email Address (For Response)
                </label>
                <div className="relative">
                  <input 
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full text-xs px-4 py-3 pl-10 rounded-xl border border-[rgba(166,113,101,0.2)] dark:border-[#A67165]/40 bg-white/55 dark:bg-[#1E1B1A] outline-none text-[#252326] dark:text-[#F2D8C2] font-semibold"
                  />
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9B8179]" />
                </div>
              </div>

              {/* Category Selector */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#252326] dark:text-[#F2D8C2] uppercase tracking-wider block">
                  Issue Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full text-xs px-4 py-3 rounded-xl border border-[rgba(166,113,101,0.2)] dark:border-[#A67165]/40 bg-white/55 dark:bg-[#1E1B1A] outline-none text-[#252326] dark:text-[#F2D8C2] font-semibold"
                >
                  <option value="General Feedback & Issue">General Feedback & Issue</option>
                  <option value="Stealth Toggle / Hotkey Problem">Stealth Toggle / Hotkey Problem</option>
                  <option value="Target App Detection Issue">Target App Detection Issue</option>
                  <option value="Feature Request">Feature Request</option>
                  <option value="Other Question">Other Question</option>
                </select>
              </div>

              {/* Detailed Description Text Area */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-[#252326] dark:text-[#F2D8C2] uppercase tracking-wider block">
                    Detailed Description <span className="text-rose-400">*</span>
                  </label>
                  <span className="text-[10px] font-mono text-[#9B8179]">
                    {complaintText.length} characters
                  </span>
                </div>
                <textarea
                  required
                  rows={4}
                  value={complaintText}
                  onChange={(e) => setComplaintText(e.target.value)}
                  placeholder="Describe what issue or feedback you're facing..."
                  className="w-full text-xs p-4 rounded-xl border border-[rgba(166,113,101,0.2)] dark:border-[#A67165]/40 bg-white/55 dark:bg-[#1E1B1A] outline-none text-[#252326] dark:text-[#F2D8C2] font-medium leading-relaxed resize-none"
                />
              </div>

              {/* Optional Screenshot / Image Upload Box */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#252326] dark:text-[#F2D8C2] uppercase tracking-wider block flex items-center justify-between">
                  <span>Attach Screenshot or Image <span className="text-[#9B8179] text-[10px] lowercase">(optional)</span></span>
                </label>

                {imagePreview ? (
                  <div className="relative p-3 rounded-2xl bg-white/10 dark:bg-white/5 border border-white/15 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <img 
                        src={imagePreview} 
                        alt="Screenshot preview" 
                        className="w-12 h-12 rounded-xl object-cover border border-white/20 shrink-0" 
                      />
                      <div className="min-w-0 text-xs">
                        <p className="font-bold text-[#252326] dark:text-[#F2D8C2] truncate">{selectedImage?.name}</p>
                        <p className="text-[10px] text-[#9B8179]">{selectedImage ? `${(selectedImage.size / 1024).toFixed(1)} KB` : ""}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="p-1.5 rounded-xl hover:bg-rose-500/20 text-rose-400 transition-colors border-none bg-transparent cursor-pointer shrink-0"
                      title="Remove image"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="border-2 border-dashed border-white/15 hover:border-[var(--accent-color,#A67165)] rounded-2xl p-4 flex items-center justify-center gap-3 cursor-pointer transition-all bg-white/5 hover:bg-white/10">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                    <div className="w-8 h-8 rounded-xl bg-[var(--accent-color,#A67165)]/20 text-[var(--accent-color,#A67165)] flex items-center justify-center shrink-0">
                      <Upload className="w-4 h-4" />
                    </div>
                    <div className="text-left">
                      <span className="text-xs font-bold text-[#252326] dark:text-[#F2D8C2] block">Click to upload screenshot or image</span>
                      <span className="text-[10px] text-[#9B8179]">PNG, JPG, WEBP up to 5MB</span>
                    </div>
                  </label>
                )}
              </div>

              {/* Priority & Diagnostics Bar */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white/10 dark:bg-white/5 border border-white/10">
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 text-xs font-bold text-[#252326] dark:text-[#F2D8C2] cursor-pointer">
                    <input 
                      type="checkbox"
                      checked={includeDiagnostics}
                      onChange={(e) => setIncludeDiagnostics(e.target.checked)}
                      className="rounded accent-[var(--accent-color,#A67165)] w-4 h-4 cursor-pointer"
                    />
                    <span>Attach Diagnostic System Log</span>
                  </label>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-[#A69281]">Priority:</span>
                  <button
                    type="button"
                    onClick={() => setPriority("normal")}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all border-none cursor-pointer ${
                      priority === "normal"
                        ? "bg-white/20 text-white"
                        : "bg-transparent text-[#9B8179] hover:text-white"
                    }`}
                  >
                    Normal
                  </button>
                  <button
                    type="button"
                    onClick={() => setPriority("urgent")}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all border-none cursor-pointer ${
                      priority === "urgent"
                        ? "bg-rose-500 text-white shadow-md"
                        : "bg-transparent text-[#9B8179] hover:text-rose-400"
                    }`}
                  >
                    High Priority
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting || !complaintText.trim()}
                  className={`btn-primary py-3.5 px-8 text-sm font-bold rounded-xl flex items-center gap-2 ${
                    isSubmitting || !complaintText.trim() ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  <Send className={`w-4 h-4 ${isSubmitting ? "animate-spin" : ""}`} />
                  <span>{isSubmitting ? "Sending..." : "Submit Ticket & Send Email"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column: FAQ Info (4 cols) */}
        <div className="lg:col-span-4 space-y-6">

          {/* FAQ Card */}
          <div className="glass-card p-6 border-[rgba(255,255,255,0.28)] space-y-4" style={{ borderRadius: "24px" }}>
            <h3 className="text-base font-bold text-[#252326] dark:text-[#F2D8C2] flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-[var(--accent-color,#A67165)]" />
              <span>Support FAQ</span>
            </h3>

            <div className="space-y-3 text-xs text-[#6B5B54] dark:text-[#A69281] leading-relaxed">
              <div className="space-y-1">
                <strong className="text-[#252326] dark:text-[#F2D8C2]">Q: Who receives my ticket email?</strong>
                <p>Tickets are delivered directly to the Custon support inbox with instant notifications.</p>
              </div>

              <div className="space-y-1 pt-2 border-t border-white/10">
                <strong className="text-[#252326] dark:text-[#F2D8C2]">Q: Are my hotkeys active in background?</strong>
                <p>Yes! Custon hotkeys run via low-level native Win32 API listeners in the background.</p>
              </div>

              <div className="space-y-1 pt-2 border-t border-white/10">
                <strong className="text-[#252326] dark:text-[#F2D8C2]">Q: What diagnostics are attached?</strong>
                <p>Only basic OS version, hotkey status, and active app count. No personal files are ever transmitted.</p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  )
}
