"use client";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";

export default function CreatorPaymentHistory() {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    api.get("/api/payments/creator-history")
      .then(setPayments)
      .catch(console.error);
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Payment History</h1>

      <div className="bg-white rounded-lg border overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Amount (cr)</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Amount ($)</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Payment System</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Account</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Date</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Status</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((p) => (
              <tr key={p._id} className="border-b last:border-0">
                <td className="px-4 py-3 text-sm">{p.withdrawalCredit}</td>
                <td className="px-4 py-3 text-sm">${p.withdrawalAmount?.toFixed(2)}</td>
                <td className="px-4 py-3 text-sm">{p.paymentSystem}</td>
                <td className="px-4 py-3 text-sm">{p.accountNumber}</td>
                <td className="px-4 py-3 text-sm">{new Date(p.withdrawDate).toLocaleDateString()}</td>
                <td className="px-4 py-3 text-sm">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    p.status === "approved" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                  }`}>{p.status}</span>
                </td>
              </tr>
            ))}
            {payments.length === 0 && (
              <tr><td colSpan={6} className="text-center py-8 text-gray-500">No withdrawals yet</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
