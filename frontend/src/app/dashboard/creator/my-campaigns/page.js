"use client";
import { useState, useEffect } from "react";
import { useToast } from "@/context/ToastContext";
import { api } from "@/lib/api";
import { Eye, Xmark, TrashBin } from "@gravity-ui/icons";

export default function MyCampaigns() {
  const { showToast } = useToast();
  const [campaigns, setCampaigns] = useState([]);
  const [loadError, setLoadError] = useState("");
  const [editing, setEditing] = useState(null);
  const [editForm, setEditForm] = useState({ title: "", story: "", rewardInfo: "" });

  useEffect(() => { load(); }, []);

  async function load() {
    try {
      const data = await api.get("/api/campaigns/creator/mine");
      setCampaigns(data);
    } catch (err) {
      setLoadError(err.message);
    }
  }

  function startEdit(c) {
    setEditing(c._id);
    setEditForm({ title: c.title, story: c.story, rewardInfo: c.rewardInfo });
  }

  async function saveEdit(id) {
    try {
      await api.put(`/api/campaigns/${id}`, editForm);
      setEditing(null);
      load();
    } catch (err) {
      showToast(err.message, "error");
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this campaign? Approved supporters will be refunded.")) return;
    try {
      await api.delete(`/api/campaigns/${id}`);
      load();
    } catch (err) {
      showToast(err.message, "error");
    }
  }

  function getStatusBadge(status) {
    const colors = { pending: "bg-yellow-100 text-yellow-800", approved: "bg-green-100 text-green-800", rejected: "bg-red-100 text-red-800" };
    return <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${colors[status] || "bg-gray-100 text-gray-800"}`}>{status}</span>;
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Campaigns</h1>
        <p className="text-sm text-gray-500 mt-1">Manage and track your campaigns</p>
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
              <th className="text-left px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Goal</th>
              <th className="text-left px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Raised</th>
              <th className="text-left px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Deadline</th>
              <th className="text-left px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              <th className="text-left px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {campaigns.map((c) => (
              <tr key={c._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3.5 text-sm font-medium text-gray-900">{c.title}</td>
                <td className="px-4 py-3.5 text-sm text-gray-600">{c.fundingGoal} cr</td>
                <td className="px-4 py-3.5 text-sm text-gray-600">{c.amountRaised || 0} cr</td>
                <td className="px-4 py-3.5 text-sm text-gray-600">{new Date(c.deadline).toLocaleDateString()}</td>
                <td className="px-4 py-3.5 text-sm">{getStatusBadge(c.status)}</td>
                <td className="px-4 py-3.5 text-sm">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => startEdit(c)}
                      className="flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-800 px-2.5 py-1.5 rounded-lg hover:bg-indigo-50 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      Update
                    </button>
                    <button
                      onClick={() => handleDelete(c._id)}
                      className="flex items-center gap-1 text-xs font-medium text-red-600 hover:text-red-800 px-2.5 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
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
                    <p className="text-sm">No campaigns yet</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {editing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setEditing(null)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Update Campaign</h2>
              <button onClick={() => setEditing(null)} className="p-1 rounded-lg hover:bg-gray-100 transition-colors">
                <Xmark className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Title"
                className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                value={editForm.title}
                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
              />
              <textarea
                placeholder="Story"
                rows={3}
                className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                value={editForm.story}
                onChange={(e) => setEditForm({ ...editForm, story: e.target.value })}
              />
              <textarea
                placeholder="Reward Info"
                rows={2}
                className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                value={editForm.rewardInfo}
                onChange={(e) => setEditForm({ ...editForm, rewardInfo: e.target.value })}
              />
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button onClick={() => setEditing(null)} className="px-4 py-2 text-sm font-medium border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors">Cancel</button>
              <button onClick={() => saveEdit(editing)} className="px-4 py-2 text-sm font-medium bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
