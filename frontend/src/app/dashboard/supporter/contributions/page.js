"use client";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";

export default function MyContributions() {
  const [data, setData] = useState({ contributions: [], total: 0, page: 1, pages: 1 });

  async function load(page = 1) {
    try {
      const res = await api.get(`/api/contributions/mine?page=${page}&limit=10`);
      setData(res);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => { load(); }, []);

  function getStatusBadge(status) {
    const colors = { pending: "bg-yellow-100 text-yellow-800", approved: "bg-green-100 text-green-800", rejected: "bg-red-100 text-red-800" };
    return <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[status] || "bg-gray-100"}`}>{status}</span>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">My Contributions</h1>

      <div className="bg-white rounded-lg border overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Campaign</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Creator</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Amount</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Date</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Status</th>
            </tr>
          </thead>
          <tbody>
            {data.contributions.map((c) => (
              <tr key={c._id} className="border-b last:border-0">
                <td className="px-4 py-3 text-sm">{c.campaignTitle}</td>
                <td className="px-4 py-3 text-sm">{c.creatorName}</td>
                <td className="px-4 py-3 text-sm font-medium">{c.contributionAmount} cr</td>
                <td className="px-4 py-3 text-sm">{new Date(c.date).toLocaleDateString()}</td>
                <td className="px-4 py-3 text-sm">{getStatusBadge(c.status)}</td>
              </tr>
            ))}
            {data.contributions.length === 0 && (
              <tr><td colSpan={5} className="text-center py-8 text-gray-500">No contributions yet</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {data.pages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6">
          <button
            disabled={data.page <= 1}
            onClick={() => load(data.page - 1)}
            className="px-3 py-1 border rounded text-sm disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-sm text-gray-600">
            Page {data.page} of {data.pages}
          </span>
          <button
            disabled={data.page >= data.pages}
            onClick={() => load(data.page + 1)}
            className="px-3 py-1 border rounded text-sm disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
