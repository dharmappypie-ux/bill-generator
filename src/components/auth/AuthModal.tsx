"use client";
import { useEffect, useState } from "react";

type Mode = "login" | "signup";
type LoginMethod = "password" | "otp";

export default function AuthModal({
  initialMode = "login",
  onClose,
  onSuccess,
}: {
  initialMode?: Mode;
  onClose: () => void;
  onSuccess: () => void | Promise<void>;
}) {
  const [mode, setMode] = useState<Mode>(initialMode);
  const [method, setMethod] = useState<LoginMethod>("password");
  const [otpSent, setOtpSent] = useState(false);
  const [devCode, setDevCode] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [code, setCode] = useState("");
  const [agree, setAgree] = useState(true);

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  async function post(url: string, body: unknown) {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(json.error || "Something went wrong.");
    return json;
  }

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (password !== confirm) return setError("Passwords do not match.");
    if (!agree) return setError("Please accept the Terms & Privacy Policy.");
    setBusy(true);
    try {
      await post("/api/auth/signup", { name, email, mobile, password });
      await onSuccess();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  async function handlePasswordLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      await post("/api/auth/login", { email, password });
      await onSuccess();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  async function requestOtp(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setNotice(null);
    setBusy(true);
    try {
      const res = await post("/api/auth/otp/request", { email });
      setOtpSent(true);
      if (res.devCode) {
        setDevCode(res.devCode);
        setNotice(`Dev mode: your code is ${res.devCode} (also in the server console).`);
      } else {
        setNotice("We've emailed you a 6-digit code.");
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  async function verifyOtp(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      await post("/api/auth/otp/verify", { email, code });
      await onSuccess();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  const inputCls = "field-input";
  const isLogin = mode === "login";

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center overflow-y-auto bg-black/50 p-4 backdrop-blur-sm sm:items-center" onMouseDown={onClose}>
      <div
        className="relative w-full max-w-md rounded-2xl bg-white p-7 shadow-2xl animate-fade-up"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full text-placeholderGray transition hover:bg-section hover:text-ink" aria-label="Close">
          <i className="fa-solid fa-xmark" />
        </button>

        <div className="mb-5 text-center">
          <h2 className="text-2xl font-extrabold text-ink">{isLogin ? "Welcome back" : "Create your account"}</h2>
          <p className="mt-1 text-sm text-inkSoft">
            {isLogin ? "Sign in to save and manage your bills." : "Save bills across devices and unlock all templates."}
          </p>
        </div>

        {/* Mode tabs */}
        <div className="mb-5 grid grid-cols-2 rounded-full bg-section p-1 text-sm font-semibold">
          <button onClick={() => { setMode("login"); setError(null); }} className={`rounded-full py-2 transition ${isLogin ? "bg-white text-brand shadow" : "text-inkSoft"}`}>Sign In</button>
          <button onClick={() => { setMode("signup"); setError(null); }} className={`rounded-full py-2 transition ${!isLogin ? "bg-white text-brand shadow" : "text-inkSoft"}`}>Sign Up</button>
        </div>

        {error && <div className="mb-4 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-600">{error}</div>}
        {notice && <div className="mb-4 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{notice}</div>}

        {/* SIGNUP */}
        {!isLogin && (
          <form onSubmit={handleSignup} className="space-y-3">
            <input className={inputCls} placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} required />
            <input className={inputCls} type="email" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <input className={inputCls} placeholder="Mobile number" value={mobile} onChange={(e) => setMobile(e.target.value)} />
            <input className={inputCls} type="password" placeholder="Password (min 6 chars)" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <input className={inputCls} type="password" placeholder="Confirm password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required />
            <label className="flex items-start gap-2 text-xs text-inkSoft">
              <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} className="mt-0.5" />
              <span>I agree to the <a className="text-brand underline" href="/legal/terms">Terms</a> and <a className="text-brand underline" href="/legal/privacy">Privacy Policy</a>.</span>
            </label>
            <button disabled={busy} className="btn-primary w-full">{busy ? "Creating…" : "Create Account"}</button>
          </form>
        )}

        {/* LOGIN */}
        {isLogin && (
          <>
            <div className="mb-4 flex gap-2 text-xs font-semibold">
              <button onClick={() => setMethod("password")} className={`flex-1 rounded-lg border py-2 transition ${method === "password" ? "border-brand bg-brand-50 text-brand" : "border-line text-inkSoft"}`}>
                <i className="fa-solid fa-key mr-1" /> Password
              </button>
              <button onClick={() => setMethod("otp")} className={`flex-1 rounded-lg border py-2 transition ${method === "otp" ? "border-brand bg-brand-50 text-brand" : "border-line text-inkSoft"}`}>
                <i className="fa-solid fa-shield-halved mr-1" /> Email OTP
              </button>
            </div>

            {method === "password" && (
              <form onSubmit={handlePasswordLogin} className="space-y-3">
                <input className={inputCls} type="email" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <input className={inputCls} type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <button disabled={busy} className="btn-primary w-full">{busy ? "Signing in…" : "Sign In"}</button>
              </form>
            )}

            {method === "otp" && (
              <div className="space-y-3">
                {!otpSent ? (
                  <form onSubmit={requestOtp} className="space-y-3">
                    <input className={inputCls} type="email" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    <button disabled={busy} className="btn-primary w-full">{busy ? "Sending…" : "Send Code"}</button>
                  </form>
                ) : (
                  <form onSubmit={verifyOtp} className="space-y-3">
                    <input className={`${inputCls} text-center text-lg tracking-[0.5em]`} inputMode="numeric" maxLength={6} placeholder="••••••" value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))} required />
                    <button disabled={busy} className="btn-primary w-full">{busy ? "Verifying…" : "Verify & Sign In"}</button>
                    <button type="button" onClick={() => { setOtpSent(false); setCode(""); setNotice(null); setDevCode(null); }} className="w-full text-xs font-semibold text-brand">Use a different email</button>
                  </form>
                )}
              </div>
            )}
          </>
        )}

        {/* Divider + Google */}
        <div className="my-5 flex items-center gap-3 text-xs text-placeholderGray">
          <span className="h-px flex-1 bg-line" /> or continue with <span className="h-px flex-1 bg-line" />
        </div>
        <a href="/api/auth/google" className="flex w-full items-center justify-center gap-2 rounded-full border border-line py-3 text-sm font-semibold text-ink transition hover:bg-section">
          <svg width="18" height="18" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9 3.6l6.7-6.7C35.6 2.6 30.2 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.8 6.1C12.3 13.2 17.6 9.5 24 9.5z"/><path fill="#4285F4" d="M46.1 24.6c0-1.6-.1-3.1-.4-4.6H24v9.3h12.4c-.5 2.9-2.1 5.3-4.6 7l7.1 5.5c4.2-3.9 6.6-9.6 6.6-17.2z"/><path fill="#FBBC05" d="M10.4 28.3c-.5-1.4-.8-2.9-.8-4.3s.3-3 .8-4.3l-7.8-6.1C.9 16.7 0 20.2 0 24s.9 7.3 2.6 10.4l7.8-6.1z"/><path fill="#34A853" d="M24 48c6.2 0 11.4-2 15.2-5.5l-7.1-5.5c-2 1.4-4.6 2.2-8.1 2.2-6.4 0-11.7-3.7-13.6-9.8l-7.8 6.1C6.5 42.6 14.6 48 24 48z"/></svg>
          Google
        </a>

        <p className="mt-4 text-center text-xs text-placeholderGray">
          No login required to generate a bill — sign in only to save & sync.
        </p>
      </div>
    </div>
  );
}
