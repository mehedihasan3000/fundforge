"use client";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { Wallet } from "@gravity-ui/icons";

export default function SupporterPaymentHistory() {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    api.get("/api/payments/history")
      .then(setPayments)
      .catch(console.error);
  }, []);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Payment History</h1>
        <p className="text-sm text-gray-500 mt-1">Your credit purchase history</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Credits</th>
              <th className="text-left px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="text-left px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Stripe ID</th>
              <th className="text-left px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {payments.map((p) => (
              <tr key={p._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3.5 text-sm font-semibold text-gray-900">{p.credits} cr</td>
                <td className="px-4 py-3.5 text-sm text-gray-700">${p.amount}</td>
                <td className="px-4 py-3.5 text-sm text-gray-400 font-mono">{(p.stripePaymentId || "").slice(0, 16)}...</td>
                <td className="px-4 py-3.5 text-sm text-gray-500">{new Date(p.date).toLocaleDateString()}</td>
              </tr>
            ))}
            {payments.length === 0 && (
              <tr>
                <td colSpan={4}>
                  <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                    <Wallet className="w-8 h-8 mb-2" />
                    <p className="text-sm">No payments yet</p>
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
