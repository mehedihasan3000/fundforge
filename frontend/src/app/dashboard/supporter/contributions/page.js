"use client";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { CreditCard, CircleCheck, CircleXmark, Clock, ArrowChevronLeft, ArrowChevronRight } from "@gravity-ui/icons";

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
        <h1 className="text-2xl font-bold text-gray-900">My Contributions</h1>
        <p className="text-sm text-gray-500 mt-1">Track all the campaigns you've supported</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Campaign</th>
              <th className="text-left px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Creator</th>
              <th className="text-left px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="text-left px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
              <th className="text-left px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.contributions.map((c) => (
              <tr key={c._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3.5 text-sm font-medium text-gray-900">{c.campaignTitle}</td>
                <td className="px-4 py-3.5 text-sm text-gray-600">{c.creatorName}</td>
                <td className="px-4 py-3.5 text-sm font-semibold text-gray-900">{c.contributionAmount} cr</td>
                <td className="px-4 py-3.5 text-sm text-gray-500">{new Date(c.date).toLocaleDateString()}</td>
                <td className="px-4 py-3.5 text-sm">{getStatusBadge(c.status)}</td>
              </tr>
            ))}
            {data.contributions.length === 0 && (
              <tr>
                <td colSpan={5}>
                  <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                    <CreditCard className="w-8 h-8 mb-2" />
                    <p className="text-sm">No contributions yet</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {data.pages > 1 && (
        <div className="flex items-center justify-center gap-3 mt-6">
          <button
            disabled={data.page <= 1}
            onClick={() => load(data.page - 1)}
            className="flex items-center gap-1 px-3 py-2 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ArrowChevronLeft className="w-4 h-4" />
            Previous
          </button>
          <div className="flex items-center gap-1.5">
            {Array.from({ length: data.pages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => load(p)}
                className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                  p === data.page
                    ? "bg-indigo-600 text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
          <button
            disabled={data.page >= data.pages}
            onClick={() => load(data.page + 1)}
            className="flex items-center gap-1 px-3 py-2 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Next
            <ArrowChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
