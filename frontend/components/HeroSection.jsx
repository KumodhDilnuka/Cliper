import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const stats = [
  { value: "100%", label: "Anonymous Protection" },
  { value: "4", label: "Core Modules" },
  { value: "24/7", label: "Resource Access" },
  { value: "0", label: "Judgment Zone" },
];

const floatCards = [
  { icon: "🎭", title: "Anonymous Q&A", sub: "Ask freely, learn boldly", delay: "animate-float" },
  { icon: "📱", title: "QR Attendance", sub: "Marked in 3 seconds", delay: "animate-float-2" },
  { icon: "🔐", title: "Secure & Private", sub: "Your identity protected", delay: "animate-float-3" },
];

export default function HeroSection() {
  const navigate = useNavigate();
  const heroRef = useRef(null);

  useEffect(() => {
    const onMove = (e) => {
      if (!heroRef.current) return;
      const xPct = (e.clientX / window.innerWidth - 0.5) * 18;
      const yPct = (e.clientY / window.innerHeight - 0.5) * 10;
      heroRef.current.style.setProperty("--mx", `${xPct}px`);
      heroRef.current.style.setProperty("--my", `${yPct}px`);
    };

    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <section ref={heroRef} className="relative min-h-screen flex items-center overflow-hidden pt-16">

      <div className="absolute -top-48 -left-48 w-[600px] h-[600px] rounded-full bg-blue-500/20 blur-[100px] pointer-events-none animate-float" />
      <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] rounded-full bg-purple-600/20 blur-[100px] pointer-events-none animate-float-2" />
      <div className="absolute top-1/2 right-1/4 w-72 h-72 rounded-full bg-cyan-400/10 blur-[80px] pointer-events-none animate-float-3" />

      <div className="relative z-10 mx-auto max-w-6xl px-6 flex flex-col lg:flex-row items-center gap-12 py-24">

        <div className="flex-1 animate-fade-up">

          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-blue-400 border border-blue-500/30 bg-blue-500/10 rounded-full px-4 py-2 mb-8">
            🎓University Academic Support System
          </div>

          <h1 className="font-[Space_Grotesk] text-5xl sm:text-6xl xl:text-7xl font-extrabold leading-[1.08] tracking-tight mb-6">
            Learn Without <span className="gradient-text">Fear.</span><br />
            Ask Without <span className="gradient-text">Limits.</span>
          </h1>

          <p className="text-lg text-[#94a3b8] leading-relaxed max-w-xl mb-10">
            A safe, inclusive, and judgment-free digital environment where every student
            can participate, ask questions anonymously, and access academic resources.
          </p>

          <div className="flex flex-wrap items-center gap-4 mb-14">
            <button
              onClick={() => navigate("/signin")}
              className="gradient-btn text-white font-bold text-base px-8 py-3.5 rounded-full"
            >
              Get Started →
            </button>

            <a
              href="#features"
              className="text-base font-semibold text-[#94a3b8] border border-white/10 rounded-full px-8 py-3.5"
            >
              Explore Features
            </a>
          </div>

          <div className="flex flex-wrap gap-10">
            {stats.map((s, i) => (
              <div key={i} className="flex flex-col gap-1">
                <span className="text-3xl font-extrabold gradient-text">{s.value}</span>
                <span className="text-xs uppercase tracking-widest text-[#4b5a72]">
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="hidden xl:flex flex-col gap-4 flex-shrink-0">
          {floatCards.map((c, i) => (
            <div
              key={i}
              className={`flex items-center gap-4 bg-white/[0.04] border border-white/[0.07] rounded-2xl px-5 py-4 min-w-[230px] ${c.delay}`}
            >
              <span className="text-2xl">{c.icon}</span>
              <div>
                <p className="text-sm font-semibold text-white">{c.title}</p>
                <p className="text-xs text-[#4b5a72]">{c.sub}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}