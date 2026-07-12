"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { Eye } from "@gravity-ui/icons";

export default function ExploreCampaigns() {
  const [campaigns, setCampaigns] = useState([]);

  useEffect(() => {
    async function load() {
      try {
        const data = await api.get("/api/campaigns?status=approved");
        const now = new Date();
        const active = data.filter((c) => new Date(c.deadline) > now);
        setCampaigns(active);
      } catch (err) {
        console.error(err);
      }
    }
    load();
  }, []);

  function getProgress(raised, goal) {
    return Math.min(Math.round((raised / goal) * 100), 100);
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Explore Campaigns</h1>
        <p className="text-sm text-gray-500 mt-1">Discover and support amazing projects</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {campaigns.map((c) => {
          const progress = getProgress(c.amountRaised || 0, c.fundingGoal);
          const daysLeft = Math.ceil((new Date(c.deadline) - new Date()) / (1000 * 60 * 60 * 24));
          return (
            <div key={c._id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-200 flex flex-col">
              {c.imageUrl ? (
                <div className="relative">
                  <img src={c.imageUrl} alt={c.title} className="w-full h-48 object-cover" />
                  <span className="absolute top-3 left-3 bg-indigo-600 text-white text-xs font-medium px-2.5 py-0.5 rounded-full">{c.category}</span>
                  {daysLeft <= 7 && (
                    <span className="absolute top-3 right-3 bg-red-500 text-white text-xs font-medium px-2.5 py-0.5 rounded-full">{daysLeft}d left</span>
                  )}
                </div>
              ) : (
                <div className="w-full h-48 bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                  <Eye className="w-10 h-10 text-indigo-300" />
                </div>
              )}
              <div className="p-4 flex flex-col flex-1">
                <h3 className="font-semibold text-base text-gray-900 mb-1 line-clamp-1">{c.title}</h3>
                <p className="text-xs text-gray-500 mb-3">by {c.creatorName}</p>

                <div className="w-full bg-gray-100 rounded-full h-2 mb-2">
                  <div
                    className="bg-indigo-600 rounded-full h-2 transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                  <span className="font-semibold text-indigo-700">{c.amountRaised || 0} cr raised</span>
                  <span>{progress}%</span>
                </div>

                <div className="flex items-center justify-between text-xs text-gray-400 mb-4">
                  <span>Goal: {c.fundingGoal} cr</span>
                  <span>{daysLeft > 0 ? `${daysLeft} days left` : "Ended"}</span>
                </div>

                <Link
                  href={`/dashboard/supporter/explore/${c._id}`}
                  className="mt-auto inline-flex items-center justify-center gap-1.5 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  View Details
                </Link>
              </div>
            </div>
          );
        })}
        {campaigns.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center py-16 text-gray-400">
            <Eye className="w-10 h-10 mb-3" />
            <p className="text-sm">No active campaigns yet</p>
            <p className="text-xs text-gray-300 mt-1">Check back later for new campaigns</p>
          </div>
        )}
      </div>
    </div>
  );
}
