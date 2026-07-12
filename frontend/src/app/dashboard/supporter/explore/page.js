"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { api } from "@/lib/api";

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

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Explore Campaigns</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {campaigns.map((c) => (
          <div key={c._id} className="bg-white rounded-lg border overflow-hidden hover:shadow-md transition-shadow">
            {c.imageUrl && (
              <img src={c.imageUrl} alt={c.title} className="w-full h-48 object-cover" />
            )}
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-1">{c.title}</h3>
              <p className="text-sm text-gray-500 mb-2">by {c.creatorName}</p>
              <p className="text-sm text-gray-600 mb-1">Deadline: {new Date(c.deadline).toLocaleDateString()}</p>
              <p className="text-sm text-gray-600 mb-1">Goal: {c.fundingGoal} cr</p>
              <p className="text-sm font-medium text-indigo-600 mb-3">Raised: {c.amountRaised || 0} cr</p>
              <Link
                href={`/dashboard/supporter/explore/${c._id}`}
                className="inline-block bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700"
              >
                View Details
              </Link>
            </div>
          </div>
        ))}
        {campaigns.length === 0 && (
          <p className="col-span-full text-center py-12 text-gray-500">No active campaigns yet</p>
        )}
      </div>
    </div>
  );
}
