"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { Eye, CircleExclamation, CircleCheck, Clock, Flag, Gift } from "@gravity-ui/icons";

export default function CampaignDetails() {
  const { id } = useParams();
  const { credits, setCredits } = useAuth();
  const [campaign, setCampaign] = useState(null);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const data = await api.get(`/api/campaigns/${id}`);
        setCampaign(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  function getDaysLeft(deadline) {
    const diff = new Date(deadline) - new Date();
    return diff > 0 ? Math.ceil(diff / (1000 * 60 * 60 * 24)) : 0;
  }

  function getProgress(raised, goal) {
    return Math.min(Math.round((raised / goal) * 100), 100);
  }

  async function handleContribute(e) {
    e.preventDefault();
    setError("");
    setSuccess("");
    const contributionAmount = Number(amount);
    if (!contributionAmount || contributionAmount < campaign.minimumContribution) {
      setError(`Minimum contribution is ${campaign.minimumContribution} credits`);
      return;
    }
    if (contributionAmount > credits) {
      setError("Insufficient credits. Please purchase more credits.");
      return;
    }
    setSubmitting(true);
    try {
      await api.post("/api/contributions", {
        campaignId: id,
        campaignTitle: campaign.title,
        contributionAmount,
        creatorName: campaign.creatorName,
        creatorEmail: campaign.creatorEmail,
      });
      setCredits((prev) => prev - contributionAmount);
      setSuccess(`Successfully contributed ${contributionAmount} credits to "${campaign.title}"!`);
      setAmount("");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <svg className="animate-spin h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-400">
        <Eye className="w-12 h-12 mb-3" />
        <p className="text-sm">Campaign not found</p>
      </div>
    );
  }

  const daysLeft = getDaysLeft(campaign.deadline);
  const progress = getProgress(campaign.amountRaised || 0, campaign.fundingGoal);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {campaign.imageUrl ? (
          <img src={campaign.imageUrl} alt={campaign.title} className="w-full h-64 md:h-80 object-cover" />
        ) : (
          <div className="w-full h-64 md:h-80 bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
            <Eye className="w-16 h-16 text-indigo-300" />
          </div>
        )}

        <div className="p-6 md:p-8">
          <div className="flex items-center gap-2 mb-3">
            <span className="bg-indigo-100 text-indigo-700 text-xs font-medium px-2.5 py-0.5 rounded-full">
              {campaign.category}
            </span>
            {daysLeft > 0 && daysLeft <= 7 && (
              <span className="bg-red-100 text-red-600 text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <Clock className="w-3 h-3" /> {daysLeft} days left
              </span>
            )}
          </div>

          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">{campaign.title}</h1>
          <p className="text-sm text-gray-500 mb-6">by {campaign.creatorName}</p>

          <div className="w-full bg-gray-100 rounded-full h-3 mb-2">
            <div className="bg-indigo-600 rounded-full h-3 transition-all" style={{ width: `${progress}%` }} />
          </div>
          <div className="flex items-center justify-between text-sm mb-6">
            <span className="font-semibold text-indigo-700">{campaign.amountRaised || 0} cr raised</span>
            <span className="text-gray-500">{progress}% of {campaign.fundingGoal} cr goal</span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-gray-50 rounded-lg p-3 text-center">
              <Flag className="w-5 h-5 text-indigo-500 mx-auto mb-1" />
              <p className="text-xs text-gray-500">Goal</p>
              <p className="font-semibold text-gray-900">{campaign.fundingGoal} cr</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 text-center">
              <Clock className="w-5 h-5 text-indigo-500 mx-auto mb-1" />
              <p className="text-xs text-gray-500">Days Left</p>
              <p className="font-semibold text-gray-900">{daysLeft || "Ended"}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 text-center">
              <Gift className="w-5 h-5 text-indigo-500 mx-auto mb-1" />
              <p className="text-xs text-gray-500">Min Contribution</p>
              <p className="font-semibold text-gray-900">{campaign.minimumContribution} cr</p>
            </div>
          </div>

          {campaign.rewardInfo && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Rewards</h2>
              <p className="text-sm text-gray-600 bg-amber-50 border border-amber-100 rounded-lg p-4">
                {campaign.rewardInfo}
              </p>
            </div>
          )}

          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Story</h2>
            <div className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
              {campaign.story}
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Contribute to this Campaign</h2>
            <form onSubmit={handleContribute} className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <div className="relative flex-1 w-full sm:max-w-xs">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter credits"
                  min={campaign.minimumContribution}
                  max={credits}
                  className="w-full px-4 py-2.5 border bg-white text-gray-900 border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-medium text-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                ) : null}
                {submitting ? "Processing..." : "Contribute Now"}
              </button>
              <p className="text-xs text-gray-400">Available: {credits} credits</p>
            </form>
          </div>

          {success && (
            <div className="flex items-center gap-2 text-green-600 bg-green-50 border border-green-100 px-4 py-3 rounded-xl text-sm mt-4">
              <CircleCheck className="w-4 h-4 shrink-0" />
              {success}
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-100 px-4 py-3 rounded-xl text-sm mt-4">
              <CircleExclamation className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
