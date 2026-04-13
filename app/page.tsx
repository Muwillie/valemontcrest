// app/(auth)/page.tsx  or  app/page.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  Shield, Zap, Globe, ChevronRight, Star,
  ArrowRight, Check, Menu, X, TrendingUp,
  Lock, Smartphone, CreditCard, PiggyBank,
  BarChart3, HeadphonesIcon, ChevronDown,
  BadgeCheck, Award, Users, DollarSign,
} from "lucide-react";

// ─── Animated counter ─────────────────────────────────────────────────────────

function CountUp({ end, prefix = "", suffix = "", duration = 2000 }: {
  end: number; prefix?: string; suffix?: string; duration?: number;
}) {
  const [count, setCount]   = useState(0);
  const ref                 = useRef(null);
  const inView              = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start     = 0;
    const step    = end / (duration / 16);
    const timer   = setInterval(() => {
      start += step;
      if (start >= end) { setCount(end); clearInterval(timer); return; }
      setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [inView, end, duration]);

  return (
    <span ref={ref}>
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
}

// ─── Section wrapper with fade-in ─────────────────────────────────────────────

function FadeIn({ children, delay = 0, className = "" }: {
  children: React.ReactNode; delay?: number; className?: string;
}) {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── Navbar ───────────────────────────────────────────────────────────────────

function Navbar() {
  const [menuOpen,   setMenuOpen]   = useState(false);
  const [scrolled,   setScrolled]   = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const links = ["Features", "Products", "Pricing", "About", "Contact"];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-100" : "bg-transparent"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <span className={`font-bold text-lg ${scrolled ? "text-slate-900" : "text-white"}`}>
              SecureBank
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
{links.map(l => (
  <a
    key={l}
    href={`#${l.toLowerCase()}`}
    className={`text-sm font-medium transition-colors ${
      scrolled ? "text-slate-600 hover:text-slate-900" : "text-white/80 hover:text-white"
    }`}
  >
    {l}
  </a>
))}
          </nav>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/sign-in"
              className={`text-sm font-medium transition-colors ${scrolled ? "text-slate-700 hover:text-slate-900" : "text-white/90 hover:text-white"}`}
            >
              Sign in
            </Link>
            <Link
              href="/sign-in"
              className="text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl transition-all"
            >
              Open account
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(v => !v)}
            className={`md:hidden p-2 rounded-lg ${scrolled ? "text-slate-700" : "text-white"}`}
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-slate-100 overflow-hidden"
          >
            <div className="px-4 py-4 space-y-1">
            {links.map(l => (
  <a
    key={l}
    href={`#${l.toLowerCase()}`}
    onClick={() => setMenuOpen(false)}
    className="block px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-xl transition-colors"
  >
    {l}
  </a>
))}
              <div className="pt-3 flex flex-col gap-2">
                <Link href="/sign-in" className="w-full py-2.5 text-center text-sm font-medium border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50 transition-colors">
                  Sign in
                </Link>
                <Link href="/sign-in" className="w-full py-2.5 text-center text-sm font-medium bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors">
                  Open account
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function Hero() {
  const words = ["Smarter.", "Faster.", "Safer.", "Better."];
  const [wordIdx, setWordIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setWordIdx(i => (i + 1) % words.length), 2200);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">

      {/* Animated background grid */}
      <div className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Glowing orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-400/20 text-blue-300 text-xs font-medium px-4 py-2 rounded-full mb-8"
        >
          <BadgeCheck className="w-3.5 h-3.5" />
          FDIC Insured · 256-bit Encryption · Trusted by 2M+ customers
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight mb-4"
        >
          Banking made{" "}
          <AnimatePresence mode="wait">
            <motion.span
              key={wordIdx}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.35 }}
              className="text-blue-400 inline-block"
            >
              {words[wordIdx]}
            </motion.span>
          </AnimatePresence>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-slate-400 text-lg sm:text-xl max-w-2xl mx-auto mb-10"
        >
          SecureBank gives you the tools to manage, grow, and protect your money — all from one place. Open an account in minutes, no paperwork needed.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
        >
          <Link
            href="/sign-in"
            className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-8 py-4 rounded-2xl text-sm transition-all hover:shadow-lg hover:shadow-blue-500/25 group"
          >
            Open a free account
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <a
  href="#features"
  className="inline-flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium px-8 py-4 rounded-2xl text-sm transition-all"
>
  See how it works
</a>
</motion.div>

</div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-3xl mx-auto"
        >
          {[
            { value: 2,    suffix: "M+",  label: "Customers"        },
            { value: 99.9, suffix: "%",   label: "Uptime"           },
            { value: 150,  suffix: "+",   label: "Countries"        },
            { value: 4.9,  suffix: "★",   label: "App store rating" },
          ].map((s, i) => (
            <div key={i} className="text-center">
              <p className="text-3xl font-bold text-white">
                <CountUp end={s.value} suffix={s.suffix} />
              </p>
              <p className="text-xs text-slate-400 mt-1">{s.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <ChevronDown className="w-6 h-6 text-white/40" />
          </motion.div>
        </motion.div>
  
    </section>
  );
}

// ─── Features ─────────────────────────────────────────────────────────────────

function Features() {
  const features = [
    {
      icon: <Zap       className="w-5 h-5" />,
      color: "bg-amber-100 text-amber-600",
      title: "Instant transfers",
      desc:  "Send money to anyone in seconds. Domestic and international wires, ACH, and peer-to-peer — all from one dashboard.",
    },
    {
      icon: <Shield    className="w-5 h-5" />,
      color: "bg-blue-100 text-blue-600",
      title: "Bank-grade security",
      desc:  "256-bit encryption, two-factor authentication, biometric login, and real-time fraud monitoring protect every transaction.",
    },
    {
      icon: <TrendingUp className="w-5 h-5" />,
      color: "bg-green-100 text-green-600",
      title: "Smart investing",
      desc:  "Grow your wealth with curated investment portfolios, index funds, and real-time market data — no broker required.",
    },
    {
      icon: <Smartphone className="w-5 h-5" />,
      color: "bg-purple-100 text-purple-600",
      title: "Mobile-first design",
      desc:  "Full banking power on any device. Deposit checks, pay bills, and manage cards from your phone — anywhere, anytime.",
    },
    {
      icon: <Globe      className="w-5 h-5" />,
      color: "bg-teal-100 text-teal-600",
      title: "Global banking",
      desc:  "Multi-currency accounts, real exchange rates with no hidden fees, and worldwide ATM access in 150+ countries.",
    },
    {
      icon: <BarChart3  className="w-5 h-5" />,
      color: "bg-rose-100 text-rose-600",
      title: "Spending insights",
      desc:  "AI-powered analytics break down your spending by category, flag unusual transactions, and help you hit savings goals.",
    },
  ];

  return (
    <section id="features" className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn className="text-center mb-16">
          <span className="text-xs font-semibold text-blue-600 uppercase tracking-widest">Features</span>
          <h2 className="text-4xl font-bold text-slate-900 mt-2 mb-4">
            Everything you need, nothing you don't
          </h2>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto">
            We built SecureBank from the ground up to be the only banking app you'll ever need.
          </p>
        </FadeIn>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <FadeIn key={f.title} delay={i * 0.08}>
              <div className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-50 transition-all group cursor-default h-full">
                <div className={`w-10 h-10 rounded-xl ${f.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  {f.icon}
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">{f.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Products ─────────────────────────────────────────────────────────────────

function Products() {
  const [active, setActive] = useState(0);

  const products = [
    {
      icon: <PiggyBank  className="w-5 h-5" />,
      label: "Savings",
      title: "High-yield savings that works for you",
      desc:  "Earn up to 4.65% APY on your savings — 10× the national average. No minimum balance, no monthly fees, and your money is always accessible.",
      perks: ["4.65% APY", "No minimum balance", "FDIC insured to $250K", "Instant transfers"],
      color: "from-emerald-500 to-teal-600",
    },
    {
      icon: <CreditCard className="w-5 h-5" />,
      label: "Cards",
      title: "Cards that reward every purchase",
      desc:  "Our Platinum Rewards Visa gives you 3% cash back on dining, 2% on groceries, and 1% on everything else — with no annual fee.",
      perks: ["Up to 3% cash back", "No annual fee", "Zero foreign transaction fees", "Virtual card for online safety"],
      color: "from-blue-500 to-indigo-600",
    },
    {
      icon: <TrendingUp className="w-5 h-5" />,
      label: "Investing",
      title: "Invest with confidence from day one",
      desc:  "Access stocks, ETFs, index funds, and crypto from one account. Our robo-advisor builds and rebalances your portfolio automatically.",
      perks: ["$0 commission trades", "Auto-rebalancing", "Fractional shares from $1", "Real-time market data"],
      color: "from-purple-500 to-pink-600",
    },
    {
      icon: <DollarSign className="w-5 h-5" />,
      label: "Loans",
      title: "Flexible loans at rates you deserve",
      desc:  "Personal loans from $1,000 to $100,000, mortgages with competitive fixed rates, and auto loans with same-day approval.",
      perks: ["APR from 8.9%", "Same-day decisions", "No prepayment penalty", "Dedicated loan advisor"],
      color: "from-amber-500 to-orange-600",
    },
  ];

  const p = products[active];

  return (
    <section id="products" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn className="text-center mb-16">
          <span className="text-xs font-semibold text-blue-600 uppercase tracking-widest">Products</span>
          <h2 className="text-4xl font-bold text-slate-900 mt-2 mb-4">
            One bank, every financial need
          </h2>
        </FadeIn>

        {/* Tab switcher */}
        <div className="flex justify-center gap-2 mb-12 flex-wrap">
          {products.map((prod, i) => (
            <button
              key={prod.label}
              onClick={() => setActive(i)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                active === i
                  ? "bg-slate-900 text-white shadow-md"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {prod.icon}
              {prod.label}
            </button>
          ))}
        </div>

        {/* Product panel */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center"
          >
            {/* Text */}
            <div>
              <h3 className="text-3xl font-bold text-slate-900 mb-4">{p.title}</h3>
              <p className="text-slate-500 text-lg mb-8 leading-relaxed">{p.desc}</p>
              <ul className="space-y-3 mb-8">
                {p.perks.map(perk => (
                  <li key={perk} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 text-green-600" />
                    </div>
                    <span className="text-slate-700 font-medium">{perk}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/sign-in"
                className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-700 text-white px-6 py-3 rounded-xl text-sm font-semibold transition-all group"
              >
                Get started
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Visual card */}
            <div className={`bg-gradient-to-br ${p.color} rounded-3xl p-8 text-white min-h-[280px] flex flex-col justify-between`}>
              <div className="flex justify-between items-start">
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                  {p.icon}
                </div>
                <span className="text-white/60 text-sm font-medium">{p.label}</span>
              </div>
              <div>
                <p className="text-white/70 text-sm mb-1">{p.label} account</p>
                <p className="text-4xl font-bold mb-1">{p.perks[0]}</p>
                <p className="text-white/60 text-sm">{p.perks[1]}</p>
              </div>
              <div className="flex gap-2">
                {p.perks.slice(2).map(perk => (
                  <span key={perk} className="text-xs bg-white/10 border border-white/20 px-3 py-1 rounded-full">
                    {perk}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

// ─── Pricing ──────────────────────────────────────────────────────────────────

function Pricing() {
  const [annual, setAnnual] = useState(true);

  const plans = [
    {
      name:  "Basic",
      price: { monthly: 0,  annual: 0  },
      desc:  "Perfect for everyday banking",
      perks: ["Checking & savings account", "Debit card", "Mobile banking", "2 free wire transfers/mo", "Standard support"],
      cta:   "Get started free",
      highlight: false,
    },
    {
      name:  "Premium",
      price: { monthly: 9,  annual: 7  },
      desc:  "For those who want more",
      perks: ["Everything in Basic", "High-yield savings 4.65% APY", "Unlimited wire transfers", "Virtual cards", "Priority support", "Investment account"],
      cta:   "Start free trial",
      highlight: true,
    },
    {
      name:  "Business",
      price: { monthly: 29, annual: 22 },
      desc:  "Built for growing businesses",
      perks: ["Everything in Premium", "Business checking account", "Multi-user access", "Expense management", "Payroll integration", "Dedicated account manager"],
      cta:   "Contact sales",
      highlight: false,
    },
  ];

  return (
    <section id="pricing" className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn className="text-center mb-12">
          <span className="text-xs font-semibold text-blue-600 uppercase tracking-widest">Pricing</span>
          <h2 className="text-4xl font-bold text-slate-900 mt-2 mb-4">
            Simple, transparent pricing
          </h2>
          <p className="text-slate-500 text-lg mb-8">No hidden fees. No surprises. Cancel anytime.</p>

          {/* Toggle */}
          <div className="inline-flex items-center gap-3 bg-white border border-slate-200 rounded-xl p-1">
            <button
              onClick={() => setAnnual(false)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${!annual ? "bg-slate-900 text-white" : "text-slate-500 hover:text-slate-700"}`}
            >
              Monthly
            </button>
            <button
              onClick={() => setAnnual(true)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${annual ? "bg-slate-900 text-white" : "text-slate-500 hover:text-slate-700"}`}
            >
              Annual
              <span className="text-[10px] bg-green-500 text-white px-1.5 py-0.5 rounded-full">Save 20%</span>
            </button>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan, i) => (
            <FadeIn key={plan.name} delay={i * 0.1}>
              <div className={`relative rounded-2xl p-6 h-full flex flex-col ${
                plan.highlight
                  ? "bg-slate-900 text-white ring-2 ring-blue-500 shadow-xl shadow-blue-500/10"
                  : "bg-white border border-slate-200"
              }`}>
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-blue-600 text-white text-xs font-bold px-4 py-1 rounded-full">
                      Most popular
                    </span>
                  </div>
                )}

                <div className="mb-6">
                  <p className={`text-sm font-semibold mb-1 ${plan.highlight ? "text-blue-400" : "text-blue-600"}`}>
                    {plan.name}
                  </p>
                  <div className="flex items-baseline gap-1 mb-1">
                    <span className={`text-4xl font-bold ${plan.highlight ? "text-white" : "text-slate-900"}`}>
                      ${annual ? plan.price.annual : plan.price.monthly}
                    </span>
                    <span className={`text-sm ${plan.highlight ? "text-white/50" : "text-slate-400"}`}>/mo</span>
                  </div>
                  <p className={`text-sm ${plan.highlight ? "text-white/60" : "text-slate-500"}`}>{plan.desc}</p>
                </div>

                <ul className="space-y-3 flex-1 mb-8">
                  {plan.perks.map(perk => (
                    <li key={perk} className="flex items-start gap-2.5 text-sm">
                      <Check className={`w-4 h-4 mt-0.5 shrink-0 ${plan.highlight ? "text-blue-400" : "text-green-500"}`} />
                      <span className={plan.highlight ? "text-white/80" : "text-slate-600"}>{perk}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/sign-in"
                  className={`w-full py-3 text-center rounded-xl text-sm font-semibold transition-all ${
                    plan.highlight
                      ? "bg-blue-600 hover:bg-blue-500 text-white"
                      : "bg-slate-100 hover:bg-slate-200 text-slate-800"
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Testimonials ─────────────────────────────────────────────────────────────

function Testimonials() {
  const reviews = [
    { name: "Sarah K.",    role: "Small business owner",  rating: 5, text: "Switched from my old bank after 12 years and I'll never go back. The transfer speeds alone are worth it." },
    { name: "Marcus T.",   role: "Freelance designer",    rating: 5, text: "Managing multiple currencies used to be a nightmare. SecureBank makes it effortless with real exchange rates and zero fees." },
    { name: "Priya M.",    role: "Software engineer",     rating: 5, text: "The investment account is incredible. I started with $50 in fractional shares and now have a properly diversified portfolio." },
    { name: "James O.",    role: "Retired teacher",       rating: 5, text: "4.65% APY on savings is genuinely unbeatable. My money actually grows now instead of sitting there doing nothing." },
    { name: "Elena R.",    role: "Marketing director",    rating: 5, text: "The spending insights showed me I was spending $400/mo on subscriptions I'd forgotten about. Saved me immediately." },
    { name: "David L.",    role: "E-commerce seller",     rating: 5, text: "The business account and expense management tools handle everything my accountant used to do manually." },
  ];

  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn className="text-center mb-16">
          <span className="text-xs font-semibold text-blue-600 uppercase tracking-widest">Testimonials</span>
          <h2 className="text-4xl font-bold text-slate-900 mt-2 mb-4">
            Loved by over 2 million customers
          </h2>
          <div className="flex items-center justify-center gap-1 mb-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="w-5 h-5 text-amber-400 fill-amber-400" />
            ))}
            <span className="text-slate-600 text-sm ml-2 font-medium">4.9 out of 5 from 142,000+ reviews</span>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {reviews.map((r, i) => (
            <FadeIn key={r.name} delay={i * 0.07}>
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 hover:border-blue-200 hover:shadow-md transition-all h-full">
                <div className="flex items-center gap-0.5 mb-3">
                  {Array.from({ length: r.rating }).map((_, j) => (
                    <Star key={j} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-slate-700 text-sm leading-relaxed mb-4">"{r.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold">
                    {r.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{r.name}</p>
                    <p className="text-xs text-slate-400">{r.role}</p>
                  </div>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Trust bar ────────────────────────────────────────────────────────────────

function TrustBar() {
  const items = [
    { icon: <Shield      className="w-5 h-5 text-blue-600"  />, label: "FDIC Insured",            sub: "Up to $250,000"          },
    { icon: <Lock        className="w-5 h-5 text-green-600" />, label: "256-bit SSL Encryption",  sub: "Bank-grade security"     },
    { icon: <Award       className="w-5 h-5 text-amber-600" />, label: "Best Digital Bank 2024",  sub: "Forbes & NerdWallet"     },
    { icon: <Users       className="w-5 h-5 text-purple-600"/>, label: "2M+ Customers",           sub: "And growing every day"   },
    { icon: <HeadphonesIcon className="w-5 h-5 text-rose-600" />, label: "24/7 Support",          sub: "Real humans, always"     },
  ];

  return (
    <section className="py-16 bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
          {items.map((item, i) => (
            <FadeIn key={item.label} delay={i * 0.08}>
              <div className="flex flex-col items-center text-center gap-2">
                <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center">
                  {item.icon}
                </div>
                <p className="text-white text-sm font-semibold">{item.label}</p>
                <p className="text-slate-400 text-xs">{item.sub}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── FAQ ──────────────────────────────────────────────────────────────────────

function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  const faqs = [
    { q: "Is SecureBank a real bank?",                      a: "Yes. SecureBank is a federally chartered bank, FDIC-insured up to $250,000 per depositor. Your money is protected by the full faith of the US government." },
    { q: "How long does it take to open an account?",       a: "Most accounts are opened in under 5 minutes. You'll need a government-issued ID and your Social Security number. No paperwork, no branch visit required." },
    { q: "Are there any monthly fees?",                     a: "Our Basic plan is completely free with no monthly fees. Premium and Business plans have a small monthly fee, but you can try either free for 30 days." },
    { q: "How does the 4.65% APY savings rate work?",       a: "Your savings balance earns 4.65% APY, compounded daily and credited monthly. There's no minimum balance required and no rate tiers — everyone earns the same rate." },
    { q: "Is my money safe if SecureBank goes under?",      a: "Absolutely. All deposits are FDIC-insured up to $250,000. Additionally, we maintain a capital reserve well above the regulatory minimum." },
    { q: "Can I use SecureBank outside the United States?", a: "Yes. Our debit and credit cards work in 150+ countries with no foreign transaction fees. Wire transfers are available to 80+ countries." },
  ];

  return (
    <section id="about" className="py-24 bg-slate-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn className="text-center mb-14">
          <span className="text-xs font-semibold text-blue-600 uppercase tracking-widest">FAQ</span>
          <h2 className="text-4xl font-bold text-slate-900 mt-2 mb-4">
            Questions answered
          </h2>
        </FadeIn>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <FadeIn key={i} delay={i * 0.05}>
              <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left"
                >
                  <span className="text-sm font-semibold text-slate-800 pr-4">{faq.q}</span>
                  <motion.div animate={{ rotate: open === i ? 180 : 0 }} transition={{ duration: 0.2 }}>
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {open === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <p className="px-5 pb-4 text-sm text-slate-500 leading-relaxed border-t border-slate-100 pt-3">
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── CTA banner ───────────────────────────────────────────────────────────────

function CTABanner() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 rounded-3xl px-8 py-16 text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
                backgroundSize: "40px 40px",
              }}
            />
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-400/20 text-blue-300 text-xs font-medium px-4 py-2 rounded-full mb-6">
                <Zap className="w-3.5 h-3.5" />
                Open in under 5 minutes
              </div>
              <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
                Ready to bank better?
              </h2>
              <p className="text-slate-400 text-lg max-w-xl mx-auto mb-10">
                Join over 2 million people who've already made the switch. No paperwork, no branch visit, no hassle.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/sign-in"
                  className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-8 py-4 rounded-2xl text-sm transition-all hover:shadow-lg hover:shadow-blue-500/25 group"
                >
                  Open your free account
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <a
  href="mailto:support@securebank.com"
  className="inline-flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium px-8 py-4 rounded-2xl text-sm transition-all"
>
  <HeadphonesIcon className="w-4 h-4" />
  Talk to an advisor
</a>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer() {
  const cols = [
    {
      heading: "Products",
      links: ["Checking account", "Savings account", "Credit cards", "Personal loans", "Mortgages", "Investing"],
    },
    {
      heading: "Company",
      links: ["About us", "Careers", "Press", "Blog", "Legal", "Privacy policy"],
    },
    {
      heading: "Support",
      links: ["Help center", "Contact us", "System status", "Security", "Report fraud", "Accessibility"],
    },
  ];

  return (
    <footer id="contact" className="bg-slate-900 text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-lg">SecureBank</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-4">
              Modern banking built for the way you live and work. FDIC insured, always secure, always available.
            </p>
            <div className="flex gap-3">
              {["App Store", "Google Play"].map(s => (
                <div key={s} className="px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-slate-400 hover:bg-white/10 cursor-pointer transition-colors">
                  {s}
                </div>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {cols.map(col => (
            <div key={col.heading}>
              <p className="text-sm font-semibold mb-4 text-slate-200">{col.heading}</p>
              <ul className="space-y-2.5">
                {col.links.map(l => (
                  <li key={l}>
                    <a href="#" className="text-slate-400 hover:text-white text-sm transition-colors">
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-xs">
            © {new Date().getFullYear()} SecureBank. All rights reserved. FDIC Member. Equal Housing Lender.
          </p>
          <div className="flex gap-4">
            {["Terms", "Privacy", "Cookies"].map(l => (
              <a key={l} href="#" className="text-slate-500 hover:text-slate-300 text-xs transition-colors">{l}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <main className="overflow-x-hidden">
      <Navbar />
      <Hero />
      <Features />
      <Products />
      <Pricing />
      <Testimonials />
      <TrustBar />
      <FAQ />
      <CTABanner />
      <Footer />
    </main>
  );
}