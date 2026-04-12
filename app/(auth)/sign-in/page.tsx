// app/(auth)/sign-in/page.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { toast } from "sonner";
import {
  Eye,
  EyeOff,
  ShieldCheck,
  ArrowRight,
  Loader2,
  RefreshCw,
  AlertCircle,
  Mail,
  Lock,
  CheckCircle2,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type Stage = "credentials" | "otp" | "success";

// ─── OTP digit input ──────────────────────────────────────────────────────────

function OtpInput({
  value,
  onChange,
  hasError,
}: {
  value: string[];
  onChange: (v: string[]) => void;
  hasError?: boolean;
}) {
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  const handleKey = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !value[i] && i > 0) {
      refs.current[i - 1]?.focus();
    }
  };

  const handleChange = (i: number, raw: string) => {
    if (raw.length > 1) {
      const digits = raw.replace(/\D/g, "").slice(0, 6).split("");
      const next = Array(6)
        .fill("")
        .map((_, idx) => digits[idx] ?? "");
      onChange(next);
      refs.current[Math.min(digits.length, 5)]?.focus();
      return;
    }
    const digit = raw.replace(/\D/g, "");
    const next = [...value];
    next[i] = digit;
    onChange(next);
    if (digit && i < 5) refs.current[i + 1]?.focus();
  };

  return (
    <motion.div
      className="flex gap-3 justify-center"
      animate={hasError ? { x: [-8, 8, -6, 6, -4, 4, 0] } : {}}
      transition={{ duration: 0.4 }}
    >
      {value.map((d, i) => (
        <input
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          type="text"
          inputMode="numeric"
          maxLength={6}
          value={d}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKey(i, e)}
          className={`w-12 h-14 text-center text-xl font-medium rounded-xl border-2 bg-background focus:outline-none focus:ring-2 transition-all ${
            hasError
              ? "border-red-400 bg-red-50 focus:border-red-500 focus:ring-red-500/20"
              : "border-border focus:border-blue-500 focus:ring-blue-500/20"
          }`}
          style={{ fontSize: "16px" }}
        />
      ))}
    </motion.div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function SignInPage() {
  const router = useRouter();

  const [stage, setStage] = useState<Stage>("credentials");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [otpError, setOtpError] = useState(false);
  const [uid, setUid] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [resetEmail, setResetEmail] = useState(false);

  // ── Countdown timer for OTP resend ──────────────────────────────────────────
  useEffect(() => {
    if (resendTimer <= 0) return;
    const t = setTimeout(() => setResendTimer((n) => n - 1), 1000);
    return () => clearTimeout(t);
  }, [resendTimer]);

  // ── Step 1: verify credentials, then send OTP ─────────────────────────────
  const handleCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Sign in with Firebase to verify credentials are correct
      const result = await signInWithEmailAndPassword(auth, email, password);
      const user = result.user;

      // Immediately sign out — we don't grant access until OTP is verified
      await auth.signOut();

      // Store uid so the OTP route knows where to save it in the DB
      setUid(user.uid);

      // Call our API route to generate + email the OTP
      const res = await fetch("/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, uid: user.uid }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to send OTP");

      toast.success("Code sent", {
        description: `A 6-digit code was sent to ${email}. Check your inbox.`,
      });

      setStage("otp");
      setResendTimer(60);
    } catch (err: unknown) {
      const code = (err as { code?: string })?.code ?? "";
      const msg = (err as { message?: string })?.message ?? "";

      if (
        code === "auth/invalid-credential" ||
        code === "auth/user-not-found" ||
        code === "auth/wrong-password" ||
        code === "auth/invalid-email"
      ) {
        toast.error("Wrong email or password", {
          description: "Please check your credentials and try again.",
        });
      } else if (code === "auth/too-many-requests") {
        toast.error("Account temporarily locked", {
          description:
            "Too many failed attempts. Try again later or reset your password.",
        });
      } else if (code === "auth/user-disabled") {
        toast.error("Account disabled", {
          description:
            "This account has been suspended. Contact support at 1-800-555-0199.",
        });
      } else if (code === "auth/network-request-failed") {
        toast.error("No internet connection", {
          description: "Check your network and try again.",
        });
      } else {
        toast.error("Sign in failed", {
          description: msg || "Something went wrong. Please try again.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // ── Step 2: verify OTP, then do the real sign-in ──────────────────────────
  // Inside handleOtp in app/(auth)/sign-in/page.tsx

  const handleOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length < 6) {
      toast.error("Enter all 6 digits");
      return;
    }
    setLoading(true);

    try {
      // 1. Verify OTP
      const res = await fetch("/api/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid, otp: code }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Verification failed");

      // 2. Do the real Firebase sign-in
      await signInWithEmailAndPassword(auth, email, password);

      // 3. Set the session cookie via our API route
      await fetch("/api/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "create" }),
      });

      // 4. Show success then redirect
      setStage("success");
      toast.success("Welcome back", {
        description: "Redirecting to your dashboard…",
      });

      // 5. Honour callbackUrl if they were trying to visit a specific page
      const params = new URLSearchParams(window.location.search);
      const callbackUrl = params.get("callbackUrl") ?? "/dashboard";
      setTimeout(() => router.push(callbackUrl), 1500);
    } catch (err: unknown) {
      const msg = (err as { message?: string })?.message ?? "";

      if (
        msg.toLowerCase().includes("incorrect") ||
        msg.toLowerCase().includes("invalid") ||
        msg.toLowerCase().includes("wrong")
      ) {
        toast.error("Incorrect code", {
          description: "The code you entered is wrong. Please try again.",
        });
      } else if (msg.toLowerCase().includes("expired")) {
        toast.error("Code expired", {
          description: "Your code has expired. Request a new one.",
        });
      } else if (msg.toLowerCase().includes("no otp")) {
        toast.error("No code found", {
          description: "Please request a new verification code.",
        });
      } else {
        toast.error("Verification failed", {
          description: msg || "Something went wrong. Please try again.",
        });
      }

      // In handleOtp catch block, add:
      setOtpError(true);
      setTimeout(() => setOtpError(false), 600); // reset after shake animation

      // Always clear the boxes on any error
      setOtp(Array(6).fill(""));
      // Focus the first box again
      setTimeout(() => {
        const first = document.querySelector<HTMLInputElement>(
          'input[inputmode="numeric"]',
        );
        first?.focus();
      }, 100);
    } finally {
      setLoading(false);
    }
  };

  // ── Resend OTP ────────────────────────────────────────────────────────────
  const handleResend = async () => {
    if (resendTimer > 0) return;
    setLoading(true);
    try {
      const res = await fetch("/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, uid }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success("New code sent");
      setOtp(Array(6).fill(""));
      setResendTimer(60);
    } catch (err: unknown) {
      toast.error((err as { message?: string })?.message ?? "Failed to resend");
    } finally {
      setLoading(false);
    }
  };

  // ── Password reset ────────────────────────────────────────────────────────
  const handleReset = async () => {
    if (!email) {
      toast.error("Enter your email address first");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      setResetEmail(true);
      toast.success("Reset link sent", {
        description: `Check ${email} for a password reset link.`,
      });
    } catch {
      toast.error(
        "Could not send reset email. Check the address and try again.",
      );
    }
  };

  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-muted/40 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        {/* Logo + bank name */}
        <div className="flex flex-col items-center gap-3">
          {/* Replace /images/logo.png with your actual logo path */}
          <Image
            src="/images/logo.png"
            alt="SecureBank logo"
            width={56}
            height={56}
            className="rounded-2xl"
            priority
          />
          <div className="text-center">
            <h1 className="text-xl font-medium">SecureBank</h1>
            <p className="text-sm text-muted-foreground">
              Secure online banking
            </p>
          </div>
        </div>

        {/* Card */}
        <div className="bg-background border border-border rounded-2xl overflow-hidden">
          {/* Header */}
          <div className="px-6 py-4 border-b border-border flex items-center justify-between">
            <span className="text-sm font-medium">
              {stage === "credentials" && "Sign in to your account"}
              {stage === "otp" && "Two-factor verification"}
              {stage === "success" && "Signed in"}
            </span>
            <span className="flex items-center gap-1 text-[11px] text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full">
              <ShieldCheck className="w-3 h-3" />
              Secure
            </span>
          </div>

          <AnimatePresence mode="wait">
            {/* ── Credentials stage ── */}
            {stage === "credentials" && (
              <motion.form
                key="credentials"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                onSubmit={handleCredentials}
                className="p-6 space-y-4"
              >
                {/* Email */}
                <div className="space-y-1">
                  <label className="text-xs font-medium text-muted-foreground">
                    Email address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      style={{ fontSize: "16px" }}
                      className="w-full h-11 pl-10 pr-4 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-1">
                  <label className="text-xs font-medium text-muted-foreground">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type={showPass ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      style={{ fontSize: "16px" }}
                      className="w-full h-11 pl-10 pr-11 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPass ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Forgot password */}
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="text-xs text-blue-600 hover:underline transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>

                {resetEmail && (
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-green-50 border border-green-200 text-green-800 text-xs">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    Reset link sent. Check your inbox.
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading || !email || !password}
                  className="w-full h-11 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed text-white text-sm font-medium transition-all flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      Continue <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <p className="text-center text-xs text-muted-foreground">
                  Don&apos;t have an account?{" "}
                  <a href="/sign-up" className="text-blue-600 hover:underline">
                    Open an account
                  </a>
                </p>
              </motion.form>
            )}

            {/* ── OTP stage ── */}
            {stage === "otp" && (
              <motion.form
                key="otp"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                onSubmit={handleOtp}
                className="p-6 space-y-5"
              >
                <div className="text-center space-y-1">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center mx-auto">
                    <Mail className="w-5 h-5 text-blue-600" />
                  </div>
                  <p className="text-sm font-medium mt-3">Check your email</p>
                  <p className="text-xs text-muted-foreground">
                    We sent a 6-digit code to
                    <br />
                    <span className="font-medium text-foreground">{email}</span>
                  </p>
                </div>

                {/* 6 digit boxes */}
                <OtpInput value={otp} onChange={setOtp} hasError={otpError} />

                {/* Expiry notice */}
                <div className="flex items-center gap-1.5 justify-center text-[11px] text-muted-foreground">
                  <AlertCircle className="w-3 h-3" />
                  Code expires in 10 minutes
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading || otp.join("").length < 6}
                  className="w-full h-11 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed text-white text-sm font-medium transition-all flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      Verify & sign in <ShieldCheck className="w-4 h-4" />
                    </>
                  )}
                </button>

                {/* Resend */}
                <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                  <span>Didn&apos;t receive it?</span>
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={resendTimer > 0 || loading}
                    className="flex items-center gap-1 text-blue-600 hover:underline disabled:text-muted-foreground disabled:no-underline transition-colors"
                  >
                    <RefreshCw className="w-3 h-3" />
                    {resendTimer > 0
                      ? `Resend in ${resendTimer}s`
                      : "Resend code"}
                  </button>
                </div>

                {/* Back */}
                <button
                  type="button"
                  onClick={() => {
                    setStage("credentials");
                    setOtp(Array(6).fill(""));
                  }}
                  className="w-full text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  ← Use a different account
                </button>
              </motion.form>
            )}

            {/* ── Success stage ── */}
            {stage === "success" && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-12 flex flex-col items-center gap-3 text-center"
              >
                <CheckCircle2 className="w-12 h-12 text-green-500" />
                <p className="font-medium">Verified successfully</p>
                <p className="text-xs text-muted-foreground">
                  Redirecting to your dashboard…
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <p className="text-center text-[11px] text-muted-foreground">
          Protected by 256-bit encryption · FDIC insured up to $250,000
        </p>
      </div>
    </div>
  );
}
