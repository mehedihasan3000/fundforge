"use client";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";

export default function ManageCampaigns() {
  const [campaigns, setCampaigns] = useState([]);

  useEffect(() => { load(); }, []);

  async function load() {
    try { setCampaigns(await api.get("/api/campaigns")); }
    catch (err) { console.error(err); }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this campaign?")) return;
    try {
      await api.delete(`/api/campaigns/${id}`);
      load();
    } catch (err) { alert(err.message); }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Manage Campaigns</h1>
      <div className="bg-white rounded-lg border overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Title</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Creator</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Goal</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Raised</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Status</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {campaigns.map((c) => (
              <tr key={c._id} className="border-b last:border-0">
                <td className="px-4 py-3 text-sm">{c.title}</td>
                <td className="px-4 py-3 text-sm">{c.creatorName}</td>
                <td className="px-4 py-3 text-sm">{c.fundingGoal}</td>
                <td className="px-4 py-3 text-sm">{c.amountRaised || 0}</td>
                <td className="px-4 py-3 text-sm">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    c.status === "approved" ? "bg-green-100 text-green-800" :
                    c.status === "pending" ? "bg-yellow-100 text-yellow-800" :
                    "bg-red-100 text-red-800"
                  }`}>{c.status}</span>
                </td>
                <td className="px-4 py-3 text-sm">
                  <button onClick={() => handleDelete(c._id)} className="text-red-600 hover:text-red-800 text-sm">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
