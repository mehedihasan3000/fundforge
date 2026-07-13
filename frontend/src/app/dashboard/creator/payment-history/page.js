"use client";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { CreditCard, CircleCheck, Clock } from "@gravity-ui/icons";

export default function CreatorPaymentHistory() {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    api.get("/api/payments/creator-history")
      .then(setPayments)
      .catch(console.error);
  }, []);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Payment History</h1>
        <p className="text-sm text-gray-500 mt-1">Your withdrawal transactions</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount (cr)</th>
              <th className="text-left px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount ($)</th>
              <th className="text-left px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Payment System</th>
              <th className="text-left px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Account</th>
              <th className="text-left px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
              <th className="text-left px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {payments.map((p) => (
              <tr key={p._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3.5 text-sm font-medium text-gray-900">{p.withdrawalCredit} cr</td>
                <td className="px-4 py-3.5 text-sm text-gray-700">${p.withdrawalAmount?.toFixed(2)}</td>
                <td className="px-4 py-3.5 text-sm text-gray-600">{p.paymentSystem}</td>
                <td className="px-4 py-3.5 text-sm text-gray-600">{p.accountNumber}</td>
                <td className="px-4 py-3.5 text-sm text-gray-600">{new Date(p.withdrawDate).toLocaleDateString()}</td>
                <td className="px-4 py-3.5 text-sm">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                    p.status === "approved" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                  }`}>
                    {p.status === "approved" ? <CircleCheck className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                    {p.status}
                  </span>
                </td>
              </tr>
            ))}
            {payments.length === 0 && (
              <tr>
                <td colSpan={6}>
                  <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                    <CreditCard className="w-8 h-8 mb-2" />
                    <p className="text-sm">No withdrawals yet</p>
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
