"use client";

import { useState, useEffect } from "react";
import { ChartLine, Flame } from "@gravity-ui/icons";
import { api } from "@/lib/api";

function ProgressBar({ current, goal }) {
  const pct = goal > 0 ? Math.min((current / goal) * 100, 100) : 0;
  return (
    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden" role="progressbar" aria-valuenow={current} aria-valuemin={0} aria-valuemax={goal} aria-label={`${pct.toFixed(0)}% funded`}>
      <div
        className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-700 ease-out"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
      <div className="h-44 bg-gradient-to-br from-gray-200 to-gray-300 animate-shimmer" />
      <div className="p-5 space-y-3">
        <div className="h-5 bg-gray-200 rounded-md w-3/4 animate-shimmer" />
        <div className="h-3 bg-gray-100 rounded w-full animate-shimmer" />
        <div className="h-2 bg-gray-100 rounded-full animate-shimmer" />
        <div className="flex justify-between">
          <div className="h-4 bg-gray-100 rounded w-20 animate-shimmer" />
          <div className="h-4 bg-gray-100 rounded w-16 animate-shimmer" />
        </div>
      </div>
    </div>
  );
}

export default function TopCampaigns() {
  const [campaigns, setCampaigns] = useState([]);

  useEffect(() => {
    api.get("/api/campaigns/top").then(setCampaigns).catch(() => {});
  }, []);

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-white to-gray-50/50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 bg-indigo-50 px-4 py-1.5 rounded-full mb-4">
            <Flame className="w-4 h-4" />
            Trending Now
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 animate-slide-up">
            Top Funded Campaigns
          </h2>
          <p className="text-lg text-gray-500 max-w-xl mx-auto">
            Discover the most supported projects making an impact right now.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {campaigns.length === 0
            ? [1, 2, 3, 4, 5, 6].map((n) => <SkeletonCard key={n} />)
            : campaigns.map((c, i) => (
                <div
                  key={c._id}
                  className="group relative bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 animate-slide-up"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  {i === 0 && (
                    <span className="absolute top-3 left-3 z-10 inline-flex items-center gap-1 text-xs font-bold text-amber-800 bg-amber-200/90 backdrop-blur-sm px-3 py-1 rounded-full">
                      <Flame className="w-3.5 h-3.5" />
                      Top Funded
                    </span>
                  )}
                  <div className="relative h-44 overflow-hidden">
                    <div
                      className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-500"
                      style={{ backgroundImage: `url(${c.imageUrl || "/placeholder.jpg"})` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    <div className="absolute bottom-3 left-4 right-4">
                      <span className="text-xs font-medium text-white/80 bg-black/30 backdrop-blur-sm px-2.5 py-1 rounded-full">
                        {c.category || "General"}
                      </span>
                    </div>
                  </div>
                  <div className="p-5 space-y-3">
                    <h3 className="font-bold text-lg text-gray-900 leading-snug line-clamp-1 group-hover:text-indigo-600 transition-colors">
                      {c.title}
                    </h3>
                    <ProgressBar current={c.amountRaised || 0} goal={c.fundingGoal || 1} />
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">
                        Raised{" "}
                        <span className="font-semibold text-green-600">
                          {(c.amountRaised || 0).toLocaleString()}
                        </span>{" "}
                        credits
                      </span>
                      <span className="flex items-center gap-1 text-gray-400">
                        <ChartLine className="w-3.5 h-3.5" />
                        {c.fundingGoal
                          ? `${Math.min(Math.round(((c.amountRaised || 0) / c.fundingGoal) * 100), 100)}%`
                          : "—"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
        </div>
      </div>
    </section>
  );
}
