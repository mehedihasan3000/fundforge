"use client";
import { useState, useEffect } from "react";
import { useToast } from "@/context/ToastContext";
import { api } from "@/lib/api";
import { Eye, TrashBin, CircleCheck, Clock, CircleXmark } from "@gravity-ui/icons";

export default function ManageCampaigns() {
  const { showToast } = useToast();
  const [campaigns, setCampaigns] = useState([]);
  const [loadError, setLoadError] = useState("");

  useEffect(() => { load(); }, []);

  async function load() {
    try { setCampaigns(await api.get("/api/campaigns")); }
    catch (err) { setLoadError(err.message); }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this campaign? This action cannot be undone.")) return;
    try {
      await api.delete(`/api/campaigns/${id}`);
      load();
    } catch (err) { showToast(err.message, "error"); }
  }

  async function handleApprove(id) {
    try {
      await api.put(`/api/campaigns/${id}/approve`);
      load();
    } catch (err) { showToast(err.message, "error"); }
  }

  async function handleReject(id) {
    try {
      await api.put(`/api/campaigns/${id}/reject`);
      load();
    } catch (err) { showToast(err.message, "error"); }
  }

  function getStatusBadge(status) {
    const badges = {
      pending: { icon: <Clock className="w-3 h-3" />, bg: "bg-yellow-100 text-yellow-800" },
      approved: { icon: <CircleCheck className="w-3 h-3" />, bg: "bg-green-100 text-green-800" },
      rejected: { icon: <CircleXmark className="w-3 h-3" />, bg: "bg-red-100 text-red-800" },
    };
    const b = badges[status] || { icon: null, bg: "bg-gray-100 text-gray-800" };
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${b.bg}`}>
        {b.icon}
        {status}
      </span>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Manage Campaigns</h1>
        <p className="text-sm text-gray-500 mt-1">Oversee all campaigns on the platform</p>
      </div>

      {loadError && (
        <div className="mb-4 flex items-center gap-2 text-red-600 bg-red-50 border border-red-100 px-4 py-3 rounded-xl text-sm">
          {loadError}
        </div>
      )}
      <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Title</th>
              <th className="text-left px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Creator</th>
              <th className="text-left px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Goal</th>
              <th className="text-left px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Raised</th>
              <th className="text-left px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              <th className="text-left px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {campaigns.map((c) => (
              <tr key={c._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3.5 text-sm font-medium text-gray-900">{c.title}</td>
                <td className="px-4 py-3.5 text-sm text-gray-600">{c.creatorName}</td>
                <td className="px-4 py-3.5 text-sm text-gray-600">{c.fundingGoal} cr</td>
                <td className="px-4 py-3.5 text-sm text-gray-600">{c.amountRaised || 0} cr</td>
                <td className="px-4 py-3.5 text-sm">{getStatusBadge(c.status)}</td>
                <td className="px-4 py-3.5 text-sm">
                  <div className="flex items-center gap-1.5">
                    {c.status === "pending" && (
                      <>
                        <button
                          onClick={() => handleApprove(c._id)}
                          className="flex items-center gap-1 text-xs font-medium text-green-600 hover:text-green-800 px-2.5 py-1.5 rounded-lg hover:bg-green-50 transition-colors"
                        >
                          <CircleCheck className="w-3.5 h-3.5" />
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(c._id)}
                          className="flex items-center gap-1 text-xs font-medium text-red-600 hover:text-red-800 px-2.5 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
                        >
                          <CircleXmark className="w-3.5 h-3.5" />
                          Reject
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => handleDelete(c._id)}
                      className="flex items-center gap-1 text-xs font-medium text-gray-600 hover:text-red-600 px-2.5 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      <TrashBin className="w-3.5 h-3.5" />
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {campaigns.length === 0 && (
              <tr>
                <td colSpan={6}>
                  <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                    <Eye className="w-8 h-8 mb-2" />
                    <p className="text-sm">No campaigns found</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
