"use client";
import { useState, useEffect } from "react";
import { useToast } from "@/context/ToastContext";
import { api } from "@/lib/api";
import { CircleCheck, CircleXmark } from "@gravity-ui/icons";

export default function WithdrawalRequests() {
  const { showToast } = useToast();
  const [withdrawals, setWithdrawals] = useState([]);
  const [loadError, setLoadError] = useState("");

  useEffect(() => { load(); }, []);

  async function load() {
    try { setWithdrawals(await api.get("/api/withdrawals/pending")); }
    catch (err) { setLoadError(err.message); }
  }

  async function approve(id) {
    try {
      await api.put(`/api/withdrawals/${id}/approve`);
      load();
    } catch (err) { showToast(err.message, "error"); }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Withdrawal Requests</h1>
        <p className="text-sm text-gray-500 mt-1">Review and process creator withdrawal requests</p>
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
              <th className="text-left px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Creator</th>
              <th className="text-left px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Credits</th>
              <th className="text-left px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount ($)</th>
              <th className="text-left px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Payment</th>
              <th className="text-left px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Account</th>
              <th className="text-left px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
              <th className="text-left px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {withdrawals.map((w) => (
              <tr key={w._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3.5 text-sm font-medium text-gray-900">{w.creatorName}</td>
                <td className="px-4 py-3.5 text-sm text-gray-700">{w.withdrawalCredit}</td>
                <td className="px-4 py-3.5 text-sm text-gray-700">${w.withdrawalAmount?.toFixed(2)}</td>
                <td className="px-4 py-3.5 text-sm text-gray-600">{w.paymentSystem}</td>
                <td className="px-4 py-3.5 text-sm text-gray-600 font-mono">{w.accountNumber}</td>
                <td className="px-4 py-3.5 text-sm text-gray-500">{new Date(w.withdrawDate).toLocaleDateString()}</td>
                <td className="px-4 py-3.5 text-sm">
                  <button
                    onClick={() => approve(w._id)}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <CircleCheck className="w-3.5 h-3.5" />
                    Approve
                  </button>
                </td>
              </tr>
            ))}
            {withdrawals.length === 0 && (
              <tr>
                <td colSpan={7}>
                  <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                    <CircleXmark className="w-8 h-8 mb-2" />
                    <p className="text-sm">No pending withdrawals</p>
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
