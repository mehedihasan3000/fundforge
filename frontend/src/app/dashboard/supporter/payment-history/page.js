"use client";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";

export default function SupporterPaymentHistory() {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    api.get("/api/payments/history")
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
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Credits</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Amount</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Stripe ID</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Date</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((p) => (
              <tr key={p._id} className="border-b last:border-0">
                <td className="px-4 py-3 text-sm font-medium">{p.credits} cr</td>
                <td className="px-4 py-3 text-sm">${p.amount}</td>
                <td className="px-4 py-3 text-sm text-gray-500">{p.stripePaymentId?.slice(0, 20)}...</td>
                <td className="px-4 py-3 text-sm">{new Date(p.date).toLocaleDateString()}</td>
              </tr>
            ))}
            {payments.length === 0 && (
              <tr><td colSpan={4} className="text-center py-8 text-gray-500">No payments yet</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
