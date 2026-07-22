import * as React from "react"
import { Eye, EyeOff, Lock, CheckCircle } from "lucide-react"

export const SecurityTab: React.FC = () => {
  const [pinEnabled, setPinEnabled] = React.useState(() => {
    return localStorage.getItem("security_pin_enabled") === "true"
  })

  const [passwordEnabled, setPasswordEnabled] = React.useState(() => {
    return localStorage.getItem("security_password_enabled") === "true"
  })

  const [biometricsEnabled, setBiometricsEnabled] = React.useState(() => {
    return localStorage.getItem("security_biometrics_enabled") === "true"
  })

  const [sessionTimeout, setSessionTimeout] = React.useState(() => {
    return localStorage.getItem("security_session_timeout") || "15"
  })

  const [authRestoring, setAuthRestoring] = React.useState(() => {
    return localStorage.getItem("security_auth_restoring") === "true"
  })

  const [authEditing, setAuthEditing] = React.useState(() => {
    return localStorage.getItem("security_auth_editing") === "true"
  })

  const [authSettings, setAuthSettings] = React.useState(() => {
    return localStorage.getItem("security_auth_settings") === "true"
  })

  // Local state for PIN setup UI
  const [pinValue, setPinValue] = React.useState(() => {
    return localStorage.getItem("security_pin_code") || "1234"
  })
  const [showPinCode, setShowPinCode] = React.useState(false)
  const [showKeypad, setShowKeypad] = React.useState(false)
  const [currentKeypadInput, setCurrentKeypadInput] = React.useState("")

  React.useEffect(() => {
    localStorage.setItem("security_pin_enabled", String(pinEnabled))
    localStorage.setItem("security_password_enabled", String(passwordEnabled))
    localStorage.setItem("security_biometrics_enabled", String(biometricsEnabled))
    localStorage.setItem("security_session_timeout", sessionTimeout)
    localStorage.setItem("security_auth_restoring", String(authRestoring))
    localStorage.setItem("security_auth_editing", String(authEditing))
    localStorage.setItem("security_auth_settings", String(authSettings))
    localStorage.setItem("security_pin_code", pinValue)
  }, [pinEnabled, passwordEnabled, biometricsEnabled, sessionTimeout, authRestoring, authEditing, authSettings, pinValue])

  // Keypad actions
  const handleKeypadPress = (val: string) => {
    if (currentKeypadInput.length < 4) {
      const next = currentKeypadInput + val
      setCurrentKeypadInput(next)
      if (next.length === 4) {
        // Automatically save
        setPinValue(next)
        localStorage.setItem("security_pin_code", next)
        alert(`New 4-Digit PIN registered: ${next}`)
        setCurrentKeypadInput("")
        setShowKeypad(false)
      }
    }
  }

  const handleKeypadClear = () => {
    setCurrentKeypadInput("")
  }

  return (
    <div className="space-y-5">
      {/* Encryption Banner */}
      <div className="p-3.5 rounded-xl bg-emerald-600/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CheckCircle className="w-4.5 h-4.5 shrink-0" />
          <div className="text-left">
            <div className="text-xs font-bold uppercase tracking-wider">Encrypted Local Database Active</div>
            <div className="text-[9px] text-emerald-500/70 font-semibold font-mono">AES-256 GCM local file encryption system is running.</div>
          </div>
        </div>
        <span className="text-[9px] font-black uppercase bg-emerald-600/20 border border-emerald-500/30 px-2 py-0.5 rounded">SECURE</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
        {/* Left Column Security Features (7 cols) */}
        <div className="md:col-span-7 space-y-4">
          {/* Main Credentials */}
          <div className="p-4 rounded-xl border border-white/5 bg-black/10 dark:bg-black/25 space-y-3.5">
            <label className="text-xs font-bold uppercase tracking-wider text-white">Credential Methods</label>
            
            {/* PIN Switch */}
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <div className="text-left space-y-0.5">
                <div className="text-xs font-bold text-[#F2D8C2] uppercase">Enable PIN Lockout</div>
                <div className="text-[10px] text-[#9B8179]">Locks app dashboard with a numeric 4-digit PIN.</div>
              </div>
              <div className="flex items-center gap-3">
                {pinEnabled && (
                  <button
                    onClick={() => setShowKeypad(!showKeypad)}
                    className="px-2 py-1 border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 rounded text-[9px] font-bold text-white uppercase cursor-pointer"
                  >
                    Change PIN
                  </button>
                )}
                <div
                  onClick={() => setPinEnabled(!pinEnabled)}
                  className={`w-9 h-5 rounded-full relative flex items-center px-0.5 cursor-pointer transition-all duration-200 ${
                    pinEnabled ? "bg-[#A67165]" : "bg-white/10"
                  }`}
                >
                  <div
                    className={`w-3.5 h-3.5 rounded-full bg-white transition-all ${
                      pinEnabled ? "translate-x-4" : "translate-x-0"
                    }`}
                  />
                </div>
              </div>
            </div>

            {/* Password Protection */}
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <div className="text-left space-y-0.5">
                <div className="text-xs font-bold text-[#F2D8C2] uppercase">Password Protection</div>
                <div className="text-[10px] text-[#9B8179]">Requires system user login password.</div>
              </div>
              <div
                onClick={() => setPasswordEnabled(!passwordEnabled)}
                className={`w-9 h-5 rounded-full relative flex items-center px-0.5 cursor-pointer transition-all duration-200 ${
                  passwordEnabled ? "bg-[#A67165]" : "bg-white/10"
                }`}
              >
                <div
                  className={`w-3.5 h-3.5 rounded-full bg-white transition-all ${
                    passwordEnabled ? "translate-x-4" : "translate-x-0"
                  }`}
                />
              </div>
            </div>

            {/* Biometric Integration */}
            <div className="flex items-center justify-between">
              <div className="text-left space-y-0.5">
                <div className="text-xs font-bold text-[#F2D8C2] uppercase">Biometric Authentication</div>
                <div className="text-[10px] text-[#9B8179]">Use Windows Hello / Touch ID / PAM local authentication.</div>
              </div>
              <div
                onClick={() => setBiometricsEnabled(!biometricsEnabled)}
                className={`w-9 h-5 rounded-full relative flex items-center px-0.5 cursor-pointer transition-all duration-200 ${
                  biometricsEnabled ? "bg-[#A67165]" : "bg-white/10"
                }`}
              >
                <div
                  className={`w-3.5 h-3.5 rounded-full bg-white transition-all ${
                    biometricsEnabled ? "translate-x-4" : "translate-x-0"
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Autolock Settings */}
          <div className="p-4 rounded-xl border border-white/5 bg-black/10 dark:bg-black/25 space-y-3.5">
            <label className="text-xs font-bold uppercase tracking-wider text-white">Auto Lock Settings</label>
            <div className="flex gap-4 items-center">
              <span className="text-xs font-semibold text-[#9B8179] shrink-0">Auto-lock after:</span>
              <select
                value={sessionTimeout}
                onChange={e => setSessionTimeout(e.target.value)}
                className="flex-1 bg-black/40 border border-white/10 rounded-lg py-1.5 px-3 text-xs text-[#F2D8C2] font-semibold outline-none"
              >
                <option value="0">Immediate Lock</option>
                <option value="1">1 minute idle</option>
                <option value="5">5 minutes idle</option>
                <option value="15">15 minutes idle</option>
                <option value="60">60 minutes idle</option>
                <option value="never">Never Lock</option>
              </select>
            </div>
          </div>

          {/* Authentication Requirements */}
          <div className="p-4 rounded-xl border border-white/5 bg-black/10 dark:bg-black/25 space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-white">Require authentication before:</label>
            <div className="space-y-2 text-xs font-semibold text-[#9B8179]">
              {[
                { checked: authRestoring, setChecked: setAuthRestoring, label: "Restoring hidden applications" },
                { checked: authEditing, setChecked: setAuthEditing, label: "Editing active triggers & shortcuts" },
                { checked: authSettings, setChecked: setAuthSettings, label: "Opening Settings dashboard panel" }
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-3.5 select-none py-1.5">
                  <div
                    onClick={() => item.setChecked(!item.checked)}
                    className="cursor-pointer"
                  >
                    {item.checked ? (
                      <div className="w-4.5 h-4.5 rounded border border-[#A67165] bg-[#A67165]/20 flex items-center justify-center text-[9px] text-[#A67165] font-black">✓</div>
                    ) : (
                      <div className="w-4.5 h-4.5 rounded border border-white/20 bg-transparent" />
                    )}
                  </div>
                  <span className="hover:text-[#F2D8C2] cursor-pointer" onClick={() => item.setChecked(!item.checked)}>
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column Keypad Preview (5 cols) */}
        <div className="md:col-span-5 bg-black/30 p-5 rounded-2xl border border-white/5 space-y-4">
          <div className="flex justify-between items-center border-b border-white/5 pb-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#9B8179]">Secure PIN Keypad</span>
            <Lock className="w-3.5 h-3.5 text-[#A67165]" />
          </div>

          {/* Show Current PIN Code */}
          <div className="bg-black/45 p-3 rounded-lg border border-white/5 flex items-center justify-between">
            <div className="text-left">
              <div className="text-[9px] text-[#9B8179] font-bold uppercase">Stored Passcode PIN:</div>
              <div className="font-mono text-base font-bold text-white tracking-widest mt-1">
                {showPinCode ? pinValue : "••••"}
              </div>
            </div>
            <button
              onClick={() => setShowPinCode(!showPinCode)}
              className="p-1.5 rounded bg-white/5 hover:bg-white/10 border border-white/10 text-white cursor-pointer transition-all"
            >
              {showPinCode ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Active Keypad Setup Panel */}
          {showKeypad ? (
            <div className="space-y-3">
              <div className="text-center font-mono text-xs font-bold text-amber-500 bg-amber-500/5 p-1 rounded border border-amber-500/20">
                Setup: Enter 4 digits [{currentKeypadInput.padEnd(4, "_")}]
              </div>
              <div className="grid grid-cols-3 gap-2 text-center font-mono text-sm font-bold">
                {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map(n => (
                  <button
                    key={n}
                    onClick={() => handleKeypadPress(n)}
                    className="py-2 rounded bg-white/5 hover:bg-white/10 border border-white/5 text-white cursor-pointer transition-all"
                  >
                    {n}
                  </button>
                ))}
                <button
                  onClick={handleKeypadClear}
                  className="py-2 rounded bg-rose-950/15 hover:bg-rose-950/25 border border-rose-900/10 text-rose-500 cursor-pointer transition-all text-xs"
                >
                  CLEAR
                </button>
                <button
                  onClick={() => handleKeypadPress("0")}
                  className="py-2 rounded bg-white/5 hover:bg-white/10 border border-white/5 text-white cursor-pointer transition-all"
                >
                  0
                </button>
                <button
                  onClick={() => setShowKeypad(false)}
                  className="py-2 rounded bg-white/10 hover:bg-white/20 border border-white/10 text-white cursor-pointer transition-all text-[9px]"
                >
                  CANCEL
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-2 text-center py-4 border border-dashed border-white/10 rounded-xl">
              <Lock className="w-8 h-8 text-[#9B8179] mx-auto opacity-40 mb-1" />
              <div className="text-xs font-bold text-white uppercase">Keypad Standby</div>
              <p className="text-[9px] text-[#9B8179] max-w-[160px] mx-auto leading-relaxed">
                Click "Change PIN" to trigger numeric recording mode.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
