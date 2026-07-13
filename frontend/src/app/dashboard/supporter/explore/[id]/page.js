"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
import { Eye, CircleExclamation, ArrowChevronLeft, Flag } from "@gravity-ui/icons";

function Skeleton() {
  return (
    <div className="max-w-3xl animate-pulse">
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

export default function CampaignDetails() {
  const { id } = useParams();
  const router = useRouter();
  const [campaign, setCampaign] = useState(null);
  const [amount, setAmount] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [showReport, setShowReport] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reportError, setReportError] = useState("");

  useEffect(() => {
    api.get(`/api/campaigns/${id}`)
      .then(setCampaign)
      .catch((err) => setError(err.message));
  }, [id]);

  async function handleContribute(e) {
    e.preventDefault();
    setError("");
    if (!amount || Number(amount) < campaign.minimumContribution) {
      setError(`Minimum contribution is ${campaign.minimumContribution} credits`);
      return;
    }
    setSubmitting(true);
    try {
      await api.post("/api/contributions", {
        campaignId: id,
        campaignTitle: campaign.title,
        contributionAmount: Number(amount),
        creatorName: campaign.creatorName,
        creatorEmail: campaign.creatorEmail,
      });
      alert("Contribution submitted! Waiting for creator approval.");
      router.push("/dashboard/supporter/contributions");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleReport(e) {
    e.preventDefault();
    setReportError("");
    if (!reportReason.trim()) {
      setReportError("Please provide a reason");
      return;
    }
    try {
      await api.post("/api/reports", {
        campaignId: id,
        campaignTitle: campaign.title,
        reason: reportReason,
      });
      setShowReport(false);
      setReportReason("");
      alert("Campaign reported. Admin will review it.");
    } catch (err) {
      setReportError(err.message);
    }
  }

  if (!campaign) return <Skeleton />;

  const progress = Math.min(Math.round(((campaign.amountRaised || 0) / campaign.fundingGoal) * 100), 100);
  const daysLeft = Math.ceil((new Date(campaign.deadline) - new Date()) / (1000 * 60 * 60 * 24));

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-4">
        <Link
          href="/dashboard/supporter/explore"
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          <ArrowChevronLeft className="w-4 h-4" />
          Back to Explore
        </Link>
        <button
          onClick={() => setShowReport(true)}
          className="inline-flex items-center gap-1 text-sm text-red-500 hover:text-red-700 transition-colors"
        >
          <Flag className="w-4 h-4" />
          Report
        </button>
      </div>

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
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Make a Contribution</h2>
          <form onSubmit={handleContribute} className="space-y-4 max-w-sm">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Amount (min: {campaign.minimumContribution} credits)
              </label>
              <input
                type="number"
                required
                min={campaign.minimumContribution}
                className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
            {error && (
              <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-100 px-4 py-3 rounded-xl text-sm">
                <CircleExclamation className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-600/25"
            >
              <Eye className="w-4 h-4" />
              {submitting ? "Processing..." : "Contribute"}
            </button>
          </form>
        </div>
      )}

      {showReport && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowReport(false)}>
          <div className="bg-white rounded-xl p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-gray-900 mb-4">Report Campaign</h2>
            <form onSubmit={handleReport} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Reason</label>
                <textarea
                  required
                  rows={4}
                  className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm"
                  placeholder="Why are you reporting this campaign?"
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                />
              </div>
              {reportError && <p className="text-red-500 text-sm">{reportError}</p>}
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setShowReport(false)} className="px-4 py-2 text-sm border rounded-lg">Cancel</button>
                <button type="submit" className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700">Submit Report</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
