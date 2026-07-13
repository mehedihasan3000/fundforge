"use client";

import { useState, useEffect, useRef } from "react";
import { Person, ChartLine, Wallet, Globe } from "@gravity-ui/icons";
import { api } from "@/lib/api";

function useCounter(end, duration = 2000, startOnMount = true) {
  const [count, setCount] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    if (!startOnMount || started.current) return;
    started.current = true;

    let startTime = null;
    let rafId;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * end));
      if (progress < 1) rafId = requestAnimationFrame(step);
    }

    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [end, duration, startOnMount]);

  return count;
}

function StatCard({ icon, label, value, suffix, delay }) {
  const count = useCounter(value);
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const animatedCount = useCounter(visible ? value : 0, 2200);

  return (
    <div
      ref={ref}
      className="group relative flex flex-col items-center text-center p-8 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-lg hover:shadow-2xl hover:bg-white/15 transition-all duration-500 animate-slide-up"
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-white/30 transition-all duration-300">
        <span className="text-white">{icon}</span>
      </div>
      <p className="text-4xl md:text-5xl font-black text-white tabular-nums">
        {animatedCount.toLocaleString()}{suffix}
      </p>
      <p className="text-sm text-white/70 mt-2 font-medium">{label}</p>
    </div>
  );
}

export default function ImpactSection() {
  const [data, setData] = useState({ users: 1240, campaigns: 89, credits: 45200, countries: 12 });

  useEffect(() => {
    api.get("/api/stats").then(setData).catch(() => {});
  }, []);

  const stats = [
    { icon: <Person className="w-6 h-6" />, label: "Total Users", value: data.users, suffix: "+" },
    { icon: <ChartLine className="w-6 h-6" />, label: "Campaigns Launched", value: data.campaigns, suffix: "+" },
    { icon: <Wallet className="w-6 h-6" />, label: "Credits Contributed", value: data.credits, suffix: "+" },
    { icon: <Globe className="w-6 h-6" />, label: "Countries Reached", value: data.countries, suffix: "" },
  ];

  return (
    <section className="relative py-24 px-4 overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-700 to-indigo-800">
      {/* Floating orbs */}
      <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-white/[0.06] blur-3xl" />
      <div className="absolute -bottom-20 -right-20 w-96 h-96 rounded-full bg-white/[0.06] blur-3xl" />
      <div className="absolute top-1/3 right-1/4 w-48 h-48 rounded-full bg-pink-400/10 blur-3xl" />
      <div className="absolute bottom-1/3 left-1/4 w-48 h-48 rounded-full bg-cyan-400/10 blur-3xl" />

      {/* Dot grid */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
        aria-hidden="true"
      />

      <div className="relative max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-200 bg-white/10 backdrop-blur-sm px-4 py-1.5 rounded-full mb-4">
            Our Reach
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 animate-slide-up">
            Platform Impact in Numbers
          </h2>
          <p className="text-lg text-indigo-200 max-w-xl mx-auto">
            The FundForge community is growing every day.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <StatCard key={i} {...stat} delay={i * 0.1} />
          ))}
        </div>
      </div>
    </section>
  );
}
