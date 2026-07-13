"use client";
import { useState, useEffect } from "react";
import { useToast } from "@/context/ToastContext";
import { api } from "@/lib/api";
import { CircleXmark, TrashBin } from "@gravity-ui/icons";

export default function Reports() {
  const { showToast } = useToast();
  const [reports, setReports] = useState([]);
  const [loadError, setLoadError] = useState("");

  useEffect(() => { load(); }, []);

  async function load() {
    try { setReports(await api.get("/api/reports")); }
    catch (err) { setLoadError(err.message); }
  }

  async function deleteReport(id) {
    try {
      await api.delete(`/api/reports/${id}`);
      load();
    } catch (err) { showToast(err.message, "error"); }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
        <p className="text-sm text-gray-500 mt-1">Review reported campaigns and take action</p>
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
              <th className="text-left px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Reporter</th>
              <th className="text-left px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Campaign</th>
              <th className="text-left px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Reason</th>
              <th className="text-left px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
              <th className="text-left px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {reports.map((r) => (
              <tr key={r._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3.5 text-sm font-medium text-gray-900">{r.supporterName}</td>
                <td className="px-4 py-3.5 text-sm text-gray-600">{r.campaignTitle}</td>
                <td className="px-4 py-3.5 text-sm text-gray-600 max-w-[200px] truncate">{r.reason}</td>
                <td className="px-4 py-3.5 text-sm text-gray-500">{new Date(r.date).toLocaleDateString()}</td>
                <td className="px-4 py-3.5 text-sm">
                  <button
                    onClick={() => deleteReport(r._id)}
                    className="flex items-center gap-1 text-xs font-medium text-red-600 hover:text-red-800 px-2.5 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    <TrashBin className="w-3.5 h-3.5" />
                    Dismiss
                  </button>
                </td>
              </tr>
            ))}
            {reports.length === 0 && (
              <tr>
                <td colSpan={5}>
                  <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                    <CircleXmark className="w-8 h-8 mb-2" />
                    <p className="text-sm">No reports</p>
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
