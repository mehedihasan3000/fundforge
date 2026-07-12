"use client";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";

export default function Reports() {
  const [reports, setReports] = useState([]);

  useEffect(() => { load(); }, []);

  async function load() {
    try { setReports(await api.get("/api/reports")); }
    catch (err) { console.error(err); }
  }

  async function deleteReport(id) {
    try {
      await api.delete(`/api/reports/${id}`);
      load();
    } catch (err) { alert(err.message); }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Reports</h1>
      <div className="bg-white rounded-lg border overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Reporter</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Campaign</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Reason</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Date</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((r) => (
              <tr key={r._id} className="border-b last:border-0">
                <td className="px-4 py-3 text-sm">{r.supporterName}</td>
                <td className="px-4 py-3 text-sm">{r.campaignTitle}</td>
                <td className="px-4 py-3 text-sm">{r.reason}</td>
                <td className="px-4 py-3 text-sm">{new Date(r.date).toLocaleDateString()}</td>
                <td className="px-4 py-3 text-sm space-x-2">
                  <button onClick={() => deleteReport(r._id)} className="text-red-600 hover:text-red-800 text-sm">Dismiss</button>
                </td>
              </tr>
            ))}
            {reports.length === 0 && (
              <tr><td colSpan={5} className="text-center py-8 text-gray-500">No reports</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
