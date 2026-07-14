"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Eye, ArrowChevronLeft } from "@gravity-ui/icons";

function Skeleton() {
  return (
    <div className="max-w-3xl animate-pulse mx-auto">
      <div className="w-full h-64 bg-gray-200 rounded-xl mb-6" />
      <div className="h-8 w-2/3 bg-gray-200 rounded-lg mb-2" />
      <div className="h-4 w-1/3 bg-gray-200 rounded mb-6" />
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-xl border p-4">
            <div className="h-3 w-12 bg-gray-200 rounded mb-2" />
            <div className="h-6 w-20 bg-gray-200 rounded" />
          </div>
        ))}
      </div>
      <div className="h-32 bg-gray-200 rounded-xl mb-6" />
    </div>
  );
}

export default function PublicCampaignDetails() {
  const { id } = useParams();
  const [campaign, setCampaign] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/campaigns/${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.message) throw new Error(data.message);
        setCampaign(data);
      })
      .catch((err) => setError(err.message));
  }, [id]);

  if (error) {
    return (
      <div className="max-w-3xl mx-auto py-16 text-center">
        <p className="text-gray-400 text-sm">{error}</p>
        <Link href="/explore" className="text-indigo-600 text-sm mt-2 inline-block hover:underline">
          Back to Explore
        </Link>
      </div>
    );
  }

  if (!campaign) return <Skeleton />;

  const progress = Math.min(Math.round(((campaign.amountRaised || 0) / campaign.fundingGoal) * 100), 100);
  const daysLeft = Math.ceil((new Date(campaign.deadline) - new Date()) / (1000 * 60 * 60 * 24));

  return (
    <div className="bg-gray-100 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="max-w-3xl mx-auto">
        <Link
          href="/explore"
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors mb-4"
        >
          <ArrowChevronLeft className="w-4 h-4" />
          Back to Explore
        </Link>

        {campaign.imageUrl && (
          <img src={campaign.imageUrl} alt={campaign.title} className="w-full h-64 object-cover rounded-xl mb-6" />
        )}

        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">{campaign.title}</h1>
            <p className="text-sm text-gray-500">by {campaign.creatorName} · <span className="text-indigo-600">{campaign.category}</span></p>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            daysLeft > 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}>
            {daysLeft > 0 ? `${daysLeft} days left` : "Ended"}
          </span>
        </div>

        <div className="w-full bg-gray-100 rounded-full h-3 mb-2">
          <div className="bg-indigo-600 rounded-full h-3 transition-all" style={{ width: `${progress}%` }} />
        </div>
        <p className="text-sm text-gray-500 mb-6">{progress}% funded · {campaign.amountRaised || 0} of {campaign.fundingGoal} credits raised</p>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Goal</p>
            <p className="text-xl font-bold text-gray-900">{campaign.fundingGoal} cr</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Raised</p>
            <p className="text-xl font-bold text-indigo-600">{campaign.amountRaised || 0} cr</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Deadline</p>
            <p className="text-xl font-bold text-gray-900">{new Date(campaign.deadline).toLocaleDateString()}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-3">Story</h2>
          <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{campaign.story}</p>
        </div>

        {campaign.rewardInfo && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-3">Rewards</h2>
            <p className="text-gray-700">{campaign.rewardInfo}</p>
          </div>
        )}

        {daysLeft > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
            <p className="text-gray-600 mb-4">Want to support this campaign?</p>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-600/25"
            >
              <Eye className="w-4 h-4" />
              Login to Contribute
            </Link>
            <p className="text-xs text-gray-400 mt-3">
              Don&apos;t have an account? <Link href="/register" className="text-indigo-600 hover:underline">Register here</Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
