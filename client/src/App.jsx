import { useState, useCallback } from "react";

function Toggle({ checked, onChange, label }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-gray-300 text-sm">{label}</span>

      <div
        onClick={() => onChange(!checked)}
        className="relative cursor-pointer"
        style={{ width: 46, height: 26 }}
      >
        <div
          style={{
            width: 46,
            height: 26,
            borderRadius: 999,
            background: checked
              ? "linear-gradient(135deg,#6366f1,#8b5cf6)"
              : "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.08)",
            transition: "all 0.3s ease",
            position: "relative",
            boxShadow: checked
              ? "0 0 18px rgba(99,102,241,0.4)"
              : "inset 0 0 10px rgba(0,0,0,0.4)",
          }}
        >
          <div
            style={{
              position: "absolute",
              width: 20,
              height: 20,
              background: "#fff",
              borderRadius: "50%",
              top: 2.5,
              left: checked ? 24 : 2.5,
              transition: "all 0.3s cubic-bezier(.4,0,.2,1)",
              boxShadow: "0 4px 10px rgba(0,0,0,0.4)",
            }}
          />
        </div>
      </div>
    </div>
  );
}

function getStrength(pw) {
  if (!pw)
    return { width: "0%", color: "#4b5563", label: "—", cls: "text-gray-500" };

  const len = pw.length;
  const v = [/[A-Z]/, /[a-z]/, /[0-9]/, /[^A-Za-z0-9]/].filter((r) =>
    r.test(pw)
  ).length;

  let score = 0;
  if (len >= 8) score += 20;
  if (len >= 12) score += 20;
  if (len >= 20) score += 20;
  score += v * 10;

  if (score < 30)
    return {
      width: "25%",
      color: "#ef4444",
      label: "Weak",
      cls: "text-red-400",
    };
  if (score < 55)
    return {
      width: "55%",
      color: "#f59e0b",
      label: "Fair",
      cls: "text-amber-400",
    };
  if (score < 75)
    return {
      width: "78%",
      color: "#10b981",
      label: "Strong",
      cls: "text-emerald-400",
    };
  return {
    width: "100%",
    color: "#6366f1",
    label: "Very Strong",
    cls: "text-indigo-400",
  };
}

export default function App() {
  const [length, setLength] = useState(12);
  const [password, setPassword] = useState("");
  const [copied, setCopied] = useState(false);
  const [useUpper, setUseUpper] = useState(true);
  const [useLower, setUseLower] = useState(true);
  const [useNums, setUseNums] = useState(true);
  const [useSyms, setUseSyms] = useState(false);

  const generatePassword = useCallback(() => {
    let pool = "";
    if (useUpper) pool += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (useLower) pool += "abcdefghijklmnopqrstuvwxyz";
    if (useNums) pool += "0123456789";
    if (useSyms) pool += "!@#$%^&*()_+-=[]{}|;:,.<>?";

    if (!pool) return;

    const arr = new Uint32Array(length);
    crypto.getRandomValues(arr);

    const pw = Array.from(arr)
      .map((n) => pool[n % pool.length])
      .join("");

    setPassword(pw);
  }, [length, useUpper, useLower, useNums, useSyms]);

  const copyPassword = () => {
    if (!password) return;
    navigator.clipboard.writeText(password).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    });
  };

  const strength = getStrength(password);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[#07070d] via-[#0a0a14] to-[#0f0f1f]">
      <div
        className="w-full max-w-md p-6 rounded-3xl backdrop-blur-xl"
        style={{
          background:
            "linear-gradient(145deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02))",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow:
            "0 30px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.05)",
        }}
      >
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-white text-2xl font-bold tracking-tight">
            Password Generator
          </h1>
          <p className="text-indigo-400 text-xs mt-1 opacity-70">
            Secure • Fast • Random
          </p>
        </div>

        {/* Password Box */}
        <div
          className="flex items-center justify-between gap-3 p-3 rounded-2xl mb-3"
          style={{
            background: "rgba(0,0,0,0.35)",
            border: "1px solid rgba(99,102,241,0.25)",
          }}
        >
          <span className="text-indigo-300 text-sm break-all flex-1">
            {password || "Generate a password..."}
          </span>

          <button
            onClick={copyPassword}
            className="text-xs px-3 py-1.5 rounded-lg font-semibold text-indigo-200 hover:text-white transition"
            style={{
              background: "rgba(99,102,241,0.15)",
              border: "1px solid rgba(99,102,241,0.3)",
            }}
          >
            {copied ? "Copied" : "Copy"}
          </button>
        </div>

        {/* Strength */}
        <div className="flex items-center gap-2 mb-6">
          <div className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
            <div
              style={{
                width: strength.width,
                background: strength.color,
                height: "100%",
                transition: "all 0.3s ease",
              }}
            />
          </div>
          <span className={`text-xs w-20 text-right ${strength.cls}`}>
            {strength.label}
          </span>
        </div>

        {/* Length */}
        <div className="mb-5">
          <div className="flex justify-between text-xs mb-2">
            <span className="text-gray-400">Length</span>
            <span className="text-indigo-400 font-bold">{length}</span>
          </div>

          <input
            type="range"
            min="4"
            max="32"
            value={length}
            onChange={(e) => setLength(Number(e.target.value))}
            className="w-full accent-indigo-500"
          />
        </div>

        {/* Settings */}
        <div className="mb-6 space-y-3">
          <Toggle
            label="Uppercase"
            checked={useUpper}
            onChange={setUseUpper}
          />
          <Toggle
            label="Lowercase"
            checked={useLower}
            onChange={setUseLower}
          />
          <Toggle label="Numbers" checked={useNums} onChange={setUseNums} />
          <Toggle label="Symbols" checked={useSyms} onChange={setUseSyms} />
        </div>

        {/* Button */}
        <button
          onClick={generatePassword}
          className="w-full py-3 rounded-2xl font-bold text-white tracking-wide transition active:scale-95"
          style={{
            background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
            boxShadow: "0 10px 30px rgba(99,102,241,0.35)",
          }}
        >
          Generate Password
        </button>
      </div>
    </div>
  );
}