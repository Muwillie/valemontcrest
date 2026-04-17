// app/(auth)/sign-up/page.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  Eye, EyeOff, ShieldCheck, ArrowRight, Loader2,
  User, Mail, Lock, Phone, MapPin, Calendar,
  AlertTriangle, CheckCircle2, Check, X,
} from "lucide-react";

// ─── Password strength checker ────────────────────────────────────────────────

function getPasswordStrength(pwd: string): { score: number; label: string; color: string } {
  let score = 0;
  if (pwd.length >= 8)              score++;
  if (pwd.length >= 12)             score++;
  if (/[A-Z]/.test(pwd))           score++;
  if (/[0-9]/.test(pwd))           score++;
  if (/[^A-Za-z0-9]/.test(pwd))    score++;

  if (score <= 1) return { score, label: "Very weak",  color: "bg-red-500"    };
  if (score === 2) return { score, label: "Weak",       color: "bg-orange-500" };
  if (score === 3) return { score, label: "Fair",       color: "bg-amber-400"  };
  if (score === 4) return { score, label: "Strong",     color: "bg-blue-500"   };
  return                { score, label: "Very strong", color: "bg-green-500"   };
}

const PASSWORD_RULES = [
  { label: "At least 8 characters",       test: (p: string) => p.length >= 8              },
  { label: "One uppercase letter",         test: (p: string) => /[A-Z]/.test(p)            },
  { label: "One number",                   test: (p: string) => /[0-9]/.test(p)            },
  { label: "One special character",        test: (p: string) => /[^A-Za-z0-9]/.test(p)    },
];

// ─── Field component ──────────────────────────────────────────────────────────

function Field({
  label, icon, error, children,
}: {
  label: string;
  icon?: React.ReactNode;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <label className="text-xs font-medium text-muted-foreground">{label}</label>
      <div className="relative">
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            {icon}
          </span>
        )}
        {children}
      </div>
      {error && (
        <p className="text-xs text-red-500 flex items-center gap-1">
          <AlertTriangle className="w-3 h-3" />{error}
        </p>
      )}
    </div>
  );
}

// ─── Input styles ─────────────────────────────────────────────────────────────

const inputCls = (hasIcon = true, hasError = false) =>
  `w-full h-11 ${hasIcon ? "pl-10" : "px-3"} pr-3 rounded-xl border ${
    hasError ? "border-red-400 bg-red-50" : "border-border bg-background"
  } text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all`;

// ─── Main page ────────────────────────────────────────────────────────────────

export default function SignUpPage() {
  // Form fields
  const [firstName,   setFirstName]   = useState("");
  const [lastName,    setLastName]     = useState("");
  const [email,       setEmail]        = useState("");
  const [phone,       setPhone]        = useState("");
  const [dob,         setDob]          = useState("");
  const [address,     setAddress]      = useState("");
  const [city,        setCity]         = useState("");
  const [state,       setState]        = useState("");
  const [zip,         setZip]          = useState("");
  const [accountType, setAccountType]  = useState("checking");
  const [password,    setPassword]     = useState("");
  const [confirm,     setConfirm]      = useState("");
  const [showPass,    setShowPass]     = useState(false);
  const [showConfirm, setShowConfirm]  = useState(false);
  const [agreeTerms,  setAgreeTerms]   = useState(false);
  const [agreePrivacy,setAgreePrivacy] = useState(false);

  // UI state
  const [loading,  setLoading]  = useState(false);
  const [errors,   setErrors]   = useState<Record<string, string>>({});
  const [step,     setStep]     = useState(1); // 1 = personal, 2 = security, 3 = success

  const strength = getPasswordStrength(password);

  // ── Validation ───────────────────────────────────────────────────────────────

  const validateStep1 = () => {
    const e: Record<string, string> = {};
    if (!firstName.trim())                          e.firstName   = "First name is required";
    if (!lastName.trim())                           e.lastName    = "Last name is required";
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))e.email       = "Enter a valid email address";
    if (!phone.replace(/\D/g, "").match(/^\d{10,}/))e.phone      = "Enter a valid phone number";
    if (!dob)                                       e.dob         = "Date of birth is required";
    else {
      const age = (Date.now() - new Date(dob).getTime()) / (365.25 * 24 * 60 * 60 * 1000);
      if (age < 18) e.dob = "You must be at least 18 years old";
    }
    if (!address.trim())                            e.address     = "Street address is required";
    if (!city.trim())                               e.city        = "City is required";
    if (!state.trim())                              e.state       = "State is required";
    if (!zip.match(/^\d{5}(-\d{4})?$/))            e.zip         = "Enter a valid ZIP code";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep2 = () => {
    const e: Record<string, string> = {};
    if (strength.score < 3)                         e.password    = "Password is too weak";
    if (password !== confirm)                       e.confirm     = "Passwords do not match";
    if (!agreeTerms)                                e.terms       = "You must accept the terms";
    if (!agreePrivacy)                              e.privacy     = "You must accept the privacy policy";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ── Step navigation ───────────────────────────────────────────────────────────

  const handleNext = () => {
    if (validateStep1()) setStep(2);
  };

  // ── Submit ────────────────────────────────────────────────────────────────────

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep2()) return;

    setLoading(true);

    try {
      const res = await fetch("/api/sign-up", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({
          firstName, lastName, email, phone, dob,
          address, city, state, zip, accountType,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error ?? "Something went wrong");

      setStep(3);

    } catch {
      // System is down — show the Sonner error and email was still attempted
      toast.error("System currently unavailable", {
        description: "We were unable to create your account at this time. Please try again later",
        duration:    10000,
        icon:        <AlertTriangle className="w-4 h-4 text-red-500" />,
      });
    } finally {
      setLoading(false);
    }
  };

  // ─────────────────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-muted/40 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg space-y-6">

        {/* Logo */}
        <div className="flex flex-col items-center gap-3">
          <Image
            src="/images/logo.png"
            alt=" logo"
            width={52}
            height={52}
            className="rounded-2xl"
            priority
          />
          <div className="text-center">
            <h1 className="text-xl font-medium">Open an account</h1>
            <p className="text-sm text-muted-foreground">
              Join 2M+ customers banking with Valemont Crest Investment Bank
            </p>
          </div>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-2 justify-center">
          {[1, 2, 3].map(s => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                step > s  ? "bg-green-500 text-white" :
                step === s ? "bg-blue-600 text-white" :
                "bg-muted text-muted-foreground"
              }`}>
                {step > s ? <Check className="w-4 h-4" /> : s}
              </div>
              {s < 3 && (
                <div className={`w-12 h-0.5 rounded-full transition-all ${step > s ? "bg-green-500" : "bg-muted"}`} />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between text-xs text-muted-foreground px-1">
          <span>Personal info</span>
          <span>Security</span>
          <span>Done</span>
        </div>

        {/* Card */}
        <div className="bg-background border border-border rounded-2xl overflow-hidden">

          {/* Header */}
          <div className="px-6 py-4 border-b border-border flex items-center justify-between">
            <span className="text-sm font-medium">
              {step === 1 && "Personal information"}
              {step === 2 && "Create your password"}
              {step === 3 && "Account created"}
            </span>
            <span className="flex items-center gap-1 text-[11px] text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full">
              <ShieldCheck className="w-3 h-3" />
              256-bit encrypted
            </span>
          </div>

          <AnimatePresence mode="wait">

            {/* ── Step 1: Personal info ── */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
                className="p-6 space-y-4"
              >
                {/* Name row */}
                <div className="grid grid-cols-2 gap-3">
                  <Field label="First name" icon={<User className="w-4 h-4" />} error={errors.firstName}>
                    <input
                      type="text"
                      value={firstName}
                      onChange={e => setFirstName(e.target.value)}
                      placeholder="Jane"
                      style={{ fontSize: "16px" }}
                      className={inputCls(true, !!errors.firstName)}
                    />
                  </Field>
                  <Field label="Last name" error={errors.lastName}>
                    <input
                      type="text"
                      value={lastName}
                      onChange={e => setLastName(e.target.value)}
                      placeholder="Doe"
                      style={{ fontSize: "16px" }}
                      className={inputCls(false, !!errors.lastName)}
                    />
                  </Field>
                </div>

                {/* Email */}
                <Field label="Email address" icon={<Mail className="w-4 h-4" />} error={errors.email}>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="jane@example.com"
                    style={{ fontSize: "16px" }}
                    className={inputCls(true, !!errors.email)}
                  />
                </Field>

                {/* Phone */}
                <Field label="Phone number" icon={<Phone className="w-4 h-4" />} error={errors.phone}>
                  <input
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    style={{ fontSize: "16px" }}
                    className={inputCls(true, !!errors.phone)}
                  />
                </Field>

                {/* Date of birth */}
                <Field label="Date of birth" icon={<Calendar className="w-4 h-4" />} error={errors.dob}>
                  <input
                    type="date"
                    value={dob}
                    onChange={e => setDob(e.target.value)}
                    style={{ fontSize: "16px" }}
                    className={inputCls(true, !!errors.dob)}
                  />
                </Field>

                {/* Account type */}
                <div className="space-y-1">
                  <label className="text-xs font-medium text-muted-foreground">Account type</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { value: "checking",   label: "Checking"   },
                      { value: "savings",    label: "Savings"    },
                      { value: "investment", label: "Investment" },
                    ].map(opt => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setAccountType(opt.value)}
                        className={`py-2.5 rounded-xl border text-xs font-semibold transition-all ${
                          accountType === opt.value
                            ? "border-blue-500 bg-blue-50 text-blue-700 ring-1 ring-blue-300"
                            : "border-border text-muted-foreground hover:bg-muted/50"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Address */}
                <Field label="Street address" icon={<MapPin className="w-4 h-4" />} error={errors.address}>
                  <input
                    type="text"
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                    placeholder="123 Main Street"
                    style={{ fontSize: "16px" }}
                    className={inputCls(true, !!errors.address)}
                  />
                </Field>

                <div className="grid grid-cols-3 gap-3">
                  <Field label="City" error={errors.city} className="col-span-1">
                    <input
                      type="text"
                      value={city}
                      onChange={e => setCity(e.target.value)}
                      placeholder="New York"
                      style={{ fontSize: "16px" }}
                      className={inputCls(false, !!errors.city)}
                    />
                  </Field>
                  <Field label="State" error={errors.state}>
                    <input
                      type="text"
                      value={state}
                      onChange={e => setState(e.target.value)}
                      placeholder="NY"
                      maxLength={2}
                      style={{ fontSize: "16px" }}
                      className={inputCls(false, !!errors.state)}
                    />
                  </Field>
                  <Field label="ZIP code" error={errors.zip}>
                    <input
                      type="text"
                      value={zip}
                      onChange={e => setZip(e.target.value)}
                      placeholder="10001"
                      style={{ fontSize: "16px" }}
                      className={inputCls(false, !!errors.zip)}
                    />
                  </Field>
                </div>

                <button
                  type="button"
                  onClick={handleNext}
                  className="w-full h-11 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-all flex items-center justify-center gap-2"
                >
                  Continue
                  <ArrowRight className="w-4 h-4" />
                </button>

                <p className="text-center text-xs text-muted-foreground">
                  Already have an account?{" "}
                  <Link href="/sign-in" className="text-blue-600 hover:underline font-medium">
                    Sign in
                  </Link>
                </p>
              </motion.div>
            )}

            {/* ── Step 2: Password + agreements ── */}
            {step === 2 && (
              <motion.form
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
                onSubmit={handleSubmit}
                className="p-6 space-y-4"
              >
                {/* Password */}
                <Field label="Password" icon={<Lock className="w-4 h-4" />} error={errors.password}>
                  <input
                    type={showPass ? "text" : "password"}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Create a strong password"
                    style={{ fontSize: "16px" }}
                    className={`${inputCls(true, !!errors.password)} pr-10`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </Field>

                {/* Password strength bar */}
                {password && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="space-y-2"
                  >
                    <div className="flex gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <div
                          key={i}
                          className={`h-1.5 flex-1 rounded-full transition-all ${
                            i < strength.score ? strength.color : "bg-muted"
                          }`}
                        />
                      ))}
                    </div>
                    <p className={`text-xs font-medium ${
                      strength.score <= 2 ? "text-red-500" :
                      strength.score === 3 ? "text-amber-500" : "text-green-600"
                    }`}>
                      {strength.label}
                    </p>

                    {/* Rule checklist */}
                    <div className="grid grid-cols-2 gap-1.5">
                      {PASSWORD_RULES.map(rule => (
                        <div key={rule.label} className="flex items-center gap-1.5">
                          {rule.test(password)
                            ? <Check className="w-3 h-3 text-green-500 shrink-0" />
                            : <X     className="w-3 h-3 text-slate-300 shrink-0" />}
                          <span className={`text-[11px] ${rule.test(password) ? "text-green-600" : "text-muted-foreground"}`}>
                            {rule.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Confirm password */}
                <Field label="Confirm password" icon={<Lock className="w-4 h-4" />} error={errors.confirm}>
                  <input
                    type={showConfirm ? "text" : "password"}
                    value={confirm}
                    onChange={e => setConfirm(e.target.value)}
                    placeholder="Repeat your password"
                    style={{ fontSize: "16px" }}
                    className={`${inputCls(true, !!errors.confirm)} pr-10`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </Field>

                {/* Match indicator */}
                {confirm && (
                  <p className={`text-xs flex items-center gap-1 ${password === confirm ? "text-green-600" : "text-red-500"}`}>
                    {password === confirm
                      ? <><Check className="w-3 h-3" /> Passwords match</>
                      : <><X     className="w-3 h-3" /> Passwords do not match</>}
                  </p>
                )}

                {/* Agreements */}
                <div className="space-y-3 pt-1">
                  {[
                    {
                      key:     "terms",
                      checked: agreeTerms,
                      set:     setAgreeTerms,
                      label:   <>I agree to the <a href="/terms" className="text-blue-600 hover:underline">Terms of Service</a> and <a href="/terms" className="text-blue-600 hover:underline">Account Agreement</a></>,
                      error:   errors.terms,
                    },
                    {
                      key:     "privacy",
                      checked: agreePrivacy,
                      set:     setAgreePrivacy,
                      label:   <>I have read and accept the <a href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</a></>,
                      error:   errors.privacy,
                    },
                  ].map(item => (
                    <div key={item.key} className="space-y-1">
                      <label className="flex items-start gap-2.5 cursor-pointer">
                        <div
                          onClick={() => item.set(v => !v)}
                          className={`w-4 h-4 rounded border-2 mt-0.5 shrink-0 flex items-center justify-center transition-all cursor-pointer ${
                            item.checked
                              ? "bg-blue-600 border-blue-600"
                              : item.error
                              ? "border-red-400"
                              : "border-border"
                          }`}
                        >
                          {item.checked && <Check className="w-2.5 h-2.5 text-white" />}
                        </div>
                        <span className="text-xs text-muted-foreground leading-relaxed">{item.label}</span>
                      </label>
                      {item.error && (
                        <p className="text-xs text-red-500 flex items-center gap-1 ml-6">
                          <AlertTriangle className="w-3 h-3" />{item.error}
                        </p>
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex-1 h-11 rounded-xl border border-border text-sm font-medium text-muted-foreground hover:bg-muted/50 transition-all"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 h-11 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed text-white text-sm font-medium transition-all flex items-center justify-center gap-2"
                  >
                    {loading
                      ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating account…</>
                      : <>Create account <ArrowRight className="w-4 h-4" /></>}
                  </button>
                </div>
              </motion.form>
            )}

            {/* ── Step 3: Success ── */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-10 flex flex-col items-center gap-4 text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.1 }}
                  className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center"
                >
                  <CheckCircle2 className="w-8 h-8 text-green-500" />
                </motion.div>
                <div>
                  <p className="font-semibold text-lg">Application submitted!</p>
                  <p className="text-sm text-muted-foreground mt-1 max-w-xs">
                    Welcome, {firstName}. Your application is under review.
                    We&apos;ll email you at <span className="font-medium text-foreground">{email}</span> within 24 hours.
                  </p>
                </div>
                <div className="w-full bg-muted/50 border border-border rounded-xl p-4 text-left space-y-2">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">What happens next</p>
                  {[
                    "We verify your identity securely",
                    "Your account is activated within 24h",
                    "You receive your debit card in 5–7 days",
                    "Sign in and start banking immediately",
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                      <div className="w-4 h-4 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-[9px] font-bold shrink-0">
                        {i + 1}
                      </div>
                      {item}
                    </div>
                  ))}
                </div>
                <Link
                  href="/sign-in"
                  className="w-full h-11 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-all flex items-center justify-center gap-2"
                >
                  Go to sign in
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <p className="text-center text-[11px] text-muted-foreground">
          Protected by 256-bit encryption · FDIC insured up to $250,000 · Member FDIC
        </p>
      </div>
    </div>
  );
}