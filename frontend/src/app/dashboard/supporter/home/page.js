"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import { ChartLine, Clock, Check } from "@gravity-ui/icons";

export default function SupporterHome() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [approved, setApproved] = useState([]);

  useEffect(() => {
    async function load() {
      try {
        const data = await api.get("/api/contributions/mine?limit=1000");
        const all = data.contributions || [];
        const pending = all.filter((c) => c.status === "pending").length;
        const approved = all.filter((c) => c.status === "approved").reduce((sum, c) => sum + c.contributionAmount, 0);
        setStats({ total: all.length, pending, approved });
      } catch (err) {
        console.error(err);
      }
      try {
        const approvedData = await api.get("/api/contributions/approved");
        setApproved(approvedData);
      } catch (err) {
        console.error(err);
      }
    }
    load();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Supporter Dashboard</h1>
      <p className="text-gray-600 mb-6">Welcome back, {user?.name}!</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center">
              <ChartLine className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Contributions</p>
              <p className="text-2xl font-bold">{stats ? stats.total : "—"}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center">
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Pending</p>
              <p className="text-2xl font-bold">{stats ? stats.pending : "—"}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <Check className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Approved Amount</p>
              <p className="text-2xl font-bold">{stats ? `${stats.approved} cr` : "—"}</p>
            </div>
          </div>
        </div>
      </div>

      <h2 className="text-xl font-bold mb-4">Approved Contributions</h2>
      <div className="bg-white rounded-lg border overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Campaign</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Amount</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Creator</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Status</th>
            </tr>
          </thead>
          <tbody>
            {approved.map((c) => (
              <tr key={c._id} className="border-b last:border-0">
                <td className="px-4 py-3 text-sm">{c.campaignTitle}</td>
                <td className="px-4 py-3 text-sm font-medium">{c.contributionAmount} cr</td>
                <td className="px-4 py-3 text-sm">{c.creatorName}</td>
                <td className="px-4 py-3 text-sm">
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">approved</span>
                </td>
              </tr>
            ))}
            {approved.length === 0 && (
              <tr><td colSpan={4} className="text-center py-8 text-gray-500">No approved contributions yet</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
