"use client";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";

export default function WithdrawalRequests() {
  const [withdrawals, setWithdrawals] = useState([]);

  useEffect(() => { load(); }, []);

  async function load() {
    try { setWithdrawals(await api.get("/api/withdrawals/pending")); }
    catch (err) { console.error(err); }
  }

  async function approve(id) {
    try {
      await api.put(`/api/withdrawals/${id}/approve`);
      load();
    } catch (err) { alert(err.message); }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Withdrawal Requests</h1>
      <div className="bg-white rounded-lg border overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Creator</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Credits</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Amount ($)</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Payment</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Account</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Date</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {withdrawals.map((w) => (
              <tr key={w._id} className="border-b last:border-0">
                <td className="px-4 py-3 text-sm">{w.creatorName}</td>
                <td className="px-4 py-3 text-sm">{w.withdrawalCredit}</td>
                <td className="px-4 py-3 text-sm">${w.withdrawalAmount?.toFixed(2)}</td>
                <td className="px-4 py-3 text-sm">{w.paymentSystem}</td>
                <td className="px-4 py-3 text-sm">{w.accountNumber}</td>
                <td className="px-4 py-3 text-sm">{new Date(w.withdrawDate).toLocaleDateString()}</td>
                <td className="px-4 py-3 text-sm">
                  <button onClick={() => approve(w._id)} className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700">Payment Success</button>
                </td>
              </tr>
            ))}
            {withdrawals.length === 0 && (
              <tr><td colSpan={7} className="text-center py-8 text-gray-500">No pending withdrawals</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
