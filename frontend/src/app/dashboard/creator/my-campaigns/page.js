"use client";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";

export default function MyCampaigns() {
  const [campaigns, setCampaigns] = useState([]);
  const [editing, setEditing] = useState(null);
  const [editForm, setEditForm] = useState({ title: "", story: "", rewardInfo: "" });

  useEffect(() => { load(); }, []);

  async function load() {
    try {
      const data = await api.get("/api/campaigns/creator/mine");
      setCampaigns(data);
    } catch (err) {
      console.error(err);
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
      alert(err.message);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this campaign? Approved supporters will be refunded.")) return;
    try {
      await api.delete(`/api/campaigns/${id}`);
      load();
    } catch (err) {
      alert(err.message);
    }
  }

  function getStatusBadge(status) {
    const colors = { pending: "bg-yellow-100 text-yellow-800", approved: "bg-green-100 text-green-800", rejected: "bg-red-100 text-red-800" };
    return <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[status] || "bg-gray-100 text-gray-800"}`}>{status}</span>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">My Campaigns</h1>

      <div className="bg-white rounded-lg border overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Title</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Goal</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Raised</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Deadline</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Status</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {campaigns.map((c) => (
              <tr key={c._id} className="border-b last:border-0">
                <td className="px-4 py-3 text-sm">{c.title}</td>
                <td className="px-4 py-3 text-sm">{c.fundingGoal}</td>
                <td className="px-4 py-3 text-sm">{c.amountRaised || 0}</td>
                <td className="px-4 py-3 text-sm">{new Date(c.deadline).toLocaleDateString()}</td>
                <td className="px-4 py-3 text-sm">{getStatusBadge(c.status)}</td>
                <td className="px-4 py-3 text-sm space-x-2">
                  <button onClick={() => startEdit(c)} className="text-indigo-600 hover:text-indigo-800 text-sm">Update</button>
                  <button onClick={() => handleDelete(c._id)} className="text-red-600 hover:text-red-800 text-sm">Delete</button>
                </td>
              </tr>
            ))}
            {campaigns.length === 0 && (
              <tr><td colSpan={6} className="text-center py-8 text-gray-500">No campaigns yet</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {editing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setEditing(null)}>
          <div className="bg-white rounded-lg p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-bold mb-4">Update Campaign</h2>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Title"
                className="w-full border rounded-lg px-3 py-2 text-sm"
                value={editForm.title}
                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
              />
              <textarea
                placeholder="Story"
                rows={3}
                className="w-full border rounded-lg px-3 py-2 text-sm"
                value={editForm.story}
                onChange={(e) => setEditForm({ ...editForm, story: e.target.value })}
              />
              <textarea
                placeholder="Reward Info"
                rows={2}
                className="w-full border rounded-lg px-3 py-2 text-sm"
                value={editForm.rewardInfo}
                onChange={(e) => setEditForm({ ...editForm, rewardInfo: e.target.value })}
              />
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button onClick={() => setEditing(null)} className="px-4 py-2 text-sm border rounded-lg">Cancel</button>
              <button onClick={() => saveEdit(editing)} className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
