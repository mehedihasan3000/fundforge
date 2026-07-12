"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";

export default function TopCampaigns() {
  const [campaigns, setCampaigns] = useState([]);

  useEffect(() => {
    api.get("/api/campaigns/top").then(setCampaigns).catch(() => {});
  }, []);

  return (
    <section className="py-16 px-4 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-10 animate-slide-up">
        Top Funded Campaigns
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {campaigns.length === 0 &&
          [1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="bg-gray-100 rounded-xl h-64 animate-pulse" />
          ))}
        {campaigns.map((campaign, i) => (
          <div
            key={campaign._id}
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow animate-slide-up"
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            <div
              className="h-40 bg-cover bg-center"
              style={{ backgroundImage: `url(${campaign.imageUrl || "/placeholder.jpg"})` }}
            />
            <div className="p-4">
              <h3 className="font-semibold text-lg truncate">{campaign.title}</h3>
              <p className="text-sm text-gray-500 mt-1">
                Raised: <span className="font-medium text-green-600">{campaign.amountRaised || 0}</span> credits
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
