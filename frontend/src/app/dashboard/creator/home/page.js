"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import { ChartLine, Clock, Wallet, Eye, Xmark } from "@gravity-ui/icons";

function StatSkeleton() {
  return (
    <div className="bg-white rounded-xl border p-6 animate-pulse">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-gray-200" />
        <div className="space-y-2">
          <div className="h-3 w-24 bg-gray-200 rounded" />
          <div className="h-6 w-16 bg-gray-200 rounded" />
        </div>
      </div>
    </div>
  );
}

export default function CreatorHome() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [pendingContributions, setPendingContributions] = useState([]);
  const [viewing, setViewing] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const campaigns = await api.get("/api/campaigns/creator/mine");
        const total = campaigns.length;
        const active = campaigns.filter((c) => new Date(c.deadline) > new Date() && c.status === "approved").length;
        const raised = campaigns.reduce((sum, c) => sum + (c.amountRaised || 0), 0);
        setStats({ total, active, raised });
      } catch (err) {
        console.error("Failed to load stats:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
    loadPending();
  }, []);

  async function loadPending() {
    try {
      const data = await api.get("/api/contributions/pending");
      setPendingContributions(data);
    } catch (err) {
      console.error(err);
    }
  }

  async function handleApprove(id) {
    try {
      await api.put(`/api/contributions/${id}/approve`);
      loadPending();
    } catch (err) {
      alert(err.message);
    }
  }

  async function handleReject(id) {
    try {
      await api.put(`/api/contributions/${id}/reject`);
      loadPending();
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Creator Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Welcome back, {user?.name}!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {loading ? (
          <>
            <StatSkeleton />
            <StatSkeleton />
            <StatSkeleton />
          </>
        ) : (
          <>
            <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-indigo-100 flex items-center justify-center">
                  <ChartLine className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Total Campaigns</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-green-100 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Active Campaigns</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-yellow-100 flex items-center justify-center">
                  <Wallet className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Total Raised</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.raised} <span className="text-sm font-medium text-gray-500">cr</span></p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-900">Contributions to Review</h2>
        {pendingContributions.length > 0 && (
          <span className="text-xs bg-indigo-100 text-indigo-700 px-2.5 py-1 rounded-full font-medium">{pendingContributions.length} pending</span>
        )}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Supporter</th>
              <th className="text-left px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Campaign</th>
              <th className="text-left px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="text-left px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {pendingContributions.map((c) => (
              <tr key={c._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3.5 text-sm text-gray-900">{c.supporterName}</td>
                <td className="px-4 py-3.5 text-sm text-gray-700">{c.campaignTitle}</td>
                <td className="px-4 py-3.5 text-sm font-medium text-gray-900">{c.contributionAmount} cr</td>
                <td className="px-4 py-3.5 text-sm">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setViewing(c)}
                      className="flex items-center gap-1 text-xs font-medium text-gray-500 hover:text-gray-700 px-2.5 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      View
                    </button>
                    <button
                      onClick={() => handleApprove(c._id)}
                      className="flex items-center gap-1 text-xs font-medium text-green-600 hover:text-green-800 px-2.5 py-1.5 rounded-lg hover:bg-green-50 transition-colors"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(c._id)}
                      className="flex items-center gap-1 text-xs font-medium text-red-600 hover:text-red-800 px-2.5 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      Reject
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {pendingContributions.length === 0 && (
              <tr>
                <td colSpan={4}>
                  <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                    <ChartLine className="w-8 h-8 mb-2" />
                    <p className="text-sm">No pending contributions</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {viewing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setViewing(null)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Contribution Details</h2>
              <button onClick={() => setViewing(null)} className="p-1 rounded-lg hover:bg-gray-100 transition-colors">
                <Xmark className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500">Supporter</span>
                <span className="font-medium text-gray-900 text-right">{viewing.supporterName}<br/><span className="text-xs text-gray-400">{viewing.supporterEmail}</span></span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500">Campaign</span>
                <span className="font-medium text-gray-900 text-right">{viewing.campaignTitle}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500">Amount</span>
                <span className="font-medium text-gray-900">{viewing.contributionAmount} credits</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500">Date</span>
                <span className="font-medium text-gray-900">{new Date(viewing.date).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-500">Status</span>
                <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 capitalize">{viewing.status}</span>
              </div>
            </div>
            <button onClick={() => setViewing(null)} className="w-full mt-4 px-4 py-2.5 text-sm font-medium bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
