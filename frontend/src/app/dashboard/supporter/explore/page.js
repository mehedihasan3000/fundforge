"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { api } from "@/lib/api";
import { Eye, Magnifier } from "@gravity-ui/icons";

const CATEGORIES = ["Technology", "Art", "Community", "Health", "Education", "Environment"];

export default function ExploreCampaigns() {
  const [campaigns, setCampaigns] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [deadline, setDeadline] = useState("");

  useEffect(() => {
    async function fetchInitial() {
      try {
        const params = new URLSearchParams({ status: "approved" });
        const data = await api.get(`/api/campaigns?${params}`);
        setCampaigns(data);
      } catch (err) {
        console.error(err);
      }
    }
    fetchInitial();
  }, []);

  async function handleFilter() {
    try {
      const params = new URLSearchParams({ status: "approved" });
      if (search) params.set("search", search);
      if (category) params.set("category", category);
      if (deadline) params.set("deadline", deadline);
      const data = await api.get(`/api/campaigns?${params}`);
      setCampaigns(data);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Explore Campaigns</h1>
        <p className="text-sm text-gray-500 mt-1">Discover and support amazing projects</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6 flex flex-wrap gap-3 items-end">
        <div className="flex-1 min-w-50">
          <label className="block text-xs font-medium text-gray-500 mb-1">Search</label>
          <div className="relative">
            <Magnifier className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search campaigns..."
              className="w-full border border-gray-300 rounded-lg pl-9 pr-3 py-2 text-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Category</label>
          <select
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Deadline</label>
          <select
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
          >
            <option value="">All</option>
            <option value="active">Active</option>
            <option value="ended">Ended</option>
          </select>
        </div>
        <button
          onClick={handleFilter}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700"
        >
          Filter
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {campaigns.map((c) => {
          const progress = Math.min(Math.round(((c.amountRaised || 0) / c.fundingGoal) * 100), 100);
          const daysLeft = Math.ceil((new Date(c.deadline) - new Date()) / (1000 * 60 * 60 * 24));
          return (
            <div key={c._id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-200 flex flex-col">
              {c.imageUrl ? (
                  <div className="relative w-full h-48">
                  <Image src={c.imageUrl} alt={c.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" unoptimized />
                  <span className="absolute top-3 left-3 bg-indigo-600 text-white text-xs font-medium px-2.5 py-0.5 rounded-full">{c.category}</span>
                  {daysLeft <= 7 && daysLeft > 0 && (
                    <span className="absolute top-3 right-3 bg-red-500 text-white text-xs font-medium px-2.5 py-0.5 rounded-full">{daysLeft}d left</span>
                  )}
                </div>
              ) : (
                <div className="w-full h-48 bg-linear-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                  <Eye className="w-10 h-10 text-indigo-300" />
                </div>
              )}
              <div className="p-4 flex flex-col flex-1">
                <h3 className="font-semibold text-base text-gray-900 mb-1 line-clamp-1">{c.title}</h3>
                <p className="text-xs text-gray-500 mb-3">by {c.creatorName}</p>
                <div className="w-full bg-gray-100 rounded-full h-2 mb-2">
                  <div className="bg-indigo-600 rounded-full h-2 transition-all" style={{ width: `${progress}%` }} />
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
            <p className="text-sm">No campaigns found</p>
            <p className="text-xs text-gray-300 mt-1">Try adjusting your filters</p>
          </div>
        )}
      </div>
    </div>
  );
}
