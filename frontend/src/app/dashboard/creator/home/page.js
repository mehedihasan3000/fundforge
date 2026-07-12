"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import { ChartLine, Clock, Wallet } from "@gravity-ui/icons";

export default function CreatorHome() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [pendingContributions, setPendingContributions] = useState([]);
  const [viewing, setViewing] = useState(null);

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
      <h1 className="text-2xl font-bold mb-6">Creator Dashboard</h1>
      <p className="text-gray-600 mb-6">Welcome back, {user?.name}!</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center">
              <ChartLine className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Campaigns</p>
              <p className="text-2xl font-bold">{stats ? stats.total : "—"}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <Clock className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Active Campaigns</p>
              <p className="text-2xl font-bold">{stats ? stats.active : "—"}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center">
              <Wallet className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Raised</p>
              <p className="text-2xl font-bold">{stats ? `${stats.raised} cr` : "—"}</p>
            </div>
          </div>
        </div>
      </div>

      <h2 className="text-xl font-bold mb-4">Contributions to Review</h2>
      <div className="bg-white rounded-lg border overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Supporter</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Campaign</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Amount</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pendingContributions.map((c) => (
              <tr key={c._id} className="border-b last:border-0">
                <td className="px-4 py-3 text-sm">{c.supporterName}</td>
                <td className="px-4 py-3 text-sm">{c.campaignTitle}</td>
                <td className="px-4 py-3 text-sm">{c.contributionAmount} cr</td>
                <td className="px-4 py-3 text-sm space-x-2">
                  <button onClick={() => setViewing(c)} className="text-gray-600 hover:text-gray-800 text-sm underline">View</button>
                  <button onClick={() => handleApprove(c._id)} className="text-green-600 hover:text-green-800 text-sm">Approve</button>
                  <button onClick={() => handleReject(c._id)} className="text-red-600 hover:text-red-800 text-sm">Reject</button>
                </td>
              </tr>
            ))}
            {pendingContributions.length === 0 && (
              <tr><td colSpan={4} className="text-center py-8 text-gray-500">No pending contributions</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {viewing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setViewing(null)}>
          <div className="bg-white rounded-lg p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-bold mb-4">Contribution Details</h2>
            <div className="space-y-2 text-sm">
              <p><strong>Supporter:</strong> {viewing.supporterName} ({viewing.supporterEmail})</p>
              <p><strong>Campaign:</strong> {viewing.campaignTitle}</p>
              <p><strong>Amount:</strong> {viewing.contributionAmount} credits</p>
              <p><strong>Date:</strong> {new Date(viewing.date).toLocaleDateString()}</p>
              <p><strong>Status:</strong> {viewing.status}</p>
            </div>
            <div className="flex justify-end mt-4">
              <button onClick={() => setViewing(null)} className="px-4 py-2 text-sm border rounded-lg">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
