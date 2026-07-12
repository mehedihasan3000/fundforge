"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";

export default function CampaignDetails() {
  const { id } = useParams();
  const router = useRouter();
  const [campaign, setCampaign] = useState(null);
  const [amount, setAmount] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

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

  if (!campaign) return <p className="text-gray-500">Loading...</p>;

  return (
    <div className="max-w-3xl">
      {campaign.imageUrl && (
        <img src={campaign.imageUrl} alt={campaign.title} className="w-full h-64 object-cover rounded-lg mb-6" />
      )}

      <h1 className="text-3xl font-bold mb-2">{campaign.title}</h1>
      <p className="text-gray-500 mb-4">by {campaign.creatorName} · {campaign.category}</p>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg border p-4 text-center">
          <p className="text-sm text-gray-500">Goal</p>
          <p className="text-xl font-bold">{campaign.fundingGoal} cr</p>
        </div>
        <div className="bg-white rounded-lg border p-4 text-center">
          <p className="text-sm text-gray-500">Raised</p>
          <p className="text-xl font-bold text-indigo-600">{campaign.amountRaised || 0} cr</p>
        </div>
        <div className="bg-white rounded-lg border p-4 text-center">
          <p className="text-sm text-gray-500">Deadline</p>
          <p className="text-xl font-bold">{new Date(campaign.deadline).toLocaleDateString()}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg border p-6 mb-6">
        <h2 className="text-lg font-bold mb-2">Story</h2>
        <p className="text-gray-700 whitespace-pre-wrap">{campaign.story}</p>
      </div>

      {campaign.rewardInfo && (
        <div className="bg-white rounded-lg border p-6 mb-6">
          <h2 className="text-lg font-bold mb-2">Rewards</h2>
          <p className="text-gray-700">{campaign.rewardInfo}</p>
        </div>
      )}

      <div className="bg-white rounded-lg border p-6">
        <h2 className="text-lg font-bold mb-4">Make a Contribution</h2>
        <form onSubmit={handleContribute} className="space-y-4 max-w-sm">
          <div>
            <label className="block text-sm font-medium mb-1">
              Amount (min: {campaign.minimumContribution} credits)
            </label>
            <input
              type="number"
              required
              min={campaign.minimumContribution}
              className="w-full border rounded-lg px-3 py-2"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={submitting}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
          >
            {submitting ? "Processing..." : "Contribute"}
          </button>
        </form>
      </div>
    </div>
  );
}
