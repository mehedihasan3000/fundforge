"use client";

import { useState, useEffect } from "react";
import { Person, ChartLine, Wallet, Globe } from "@gravity-ui/icons";
import { api } from "@/lib/api";

const stats = [
  { icon: <Person className="w-6 h-6" />, label: "Total Users", value: "users", suffix: "+" },
  { icon: <ChartLine className="w-6 h-6" />, label: "Campaigns Launched", value: "campaigns", suffix: "+" },
  { icon: <Wallet className="w-6 h-6" />, label: "Credits Contributed", value: "credits", suffix: "+" },
  { icon: <Globe className="w-6 h-6" />, label: "Countries Reached", value: "countries", suffix: "" },
];

export default function ImpactSection() {
  const [counts, setCounts] = useState({ users: 0, campaigns: 0, credits: 0, countries: 12 });

  useEffect(() => {
    api.get("/api/stats").then(setCounts).catch(() => {
      setCounts({ users: 1240, campaigns: 89, credits: 45200, countries: 12 });
    });
  }, []);

  return (
    <section className="py-16 bg-indigo-600 text-white px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12 animate-slide-up">
          Platform Impact in Numbers
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="flex flex-col items-center text-center animate-slide-up"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mb-3">
                {stat.icon}
              </div>
              <p className="text-3xl font-bold">
                {counts[stat.value]?.toLocaleString() || 0}{stat.suffix}
              </p>
              <p className="text-sm text-white/80 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
