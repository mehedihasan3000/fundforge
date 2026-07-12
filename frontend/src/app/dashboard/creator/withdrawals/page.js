"use client";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";

export default function Withdrawals() {
  const [earnings, setEarnings] = useState({ raised: 0, dollar: 0 });
  const [form, setForm] = useState({ withdrawalCredit: "", paymentSystem: "Stripe", accountNumber: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const campaigns = await api.get("/api/campaigns/creator/mine");
        const raised = campaigns.reduce((sum, c) => sum + (c.amountRaised || 0), 0);
        setEarnings({ raised, dollar: raised / 20 });
      } catch (err) {
        console.error(err);
      }
    }
    load();
  }, []);

  const calculatedAmount = form.withdrawalCredit ? (Number(form.withdrawalCredit) / 20).toFixed(2) : "0.00";
  const canWithdraw = Number(form.withdrawalCredit) >= 200 && Number(form.withdrawalCredit) <= earnings.raised;

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!canWithdraw) {
      setError("Minimum 200 credits required or exceeds your earnings");
      return;
    }
    setSubmitting(true);
    try {
      await api.post("/api/withdrawals", {
        withdrawalCredit: Number(form.withdrawalCredit),
        paymentSystem: form.paymentSystem,
        accountNumber: form.accountNumber,
      });
      alert("Withdrawal request submitted!");
      setForm({ withdrawalCredit: "", paymentSystem: "Stripe", accountNumber: "" });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Withdrawals</h1>

      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg border p-6">
          <p className="text-sm text-gray-500">Total Raised Credits</p>
          <p className="text-2xl font-bold">{earnings.raised} cr</p>
        </div>
        <div className="bg-white rounded-lg border p-6">
          <p className="text-sm text-gray-500">Withdrawal Amount (20 cr = $1)</p>
          <p className="text-2xl font-bold">${earnings.dollar.toFixed(2)}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg border p-6 max-w-lg">
        <h2 className="text-lg font-bold mb-4">Request Withdrawal</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Credits to Withdraw</label>
            <input
              type="number"
              min="200"
              required
              className="w-full border rounded-lg px-3 py-2"
              value={form.withdrawalCredit}
              onChange={(e) => setForm({ ...form, withdrawalCredit: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Withdrawal Amount ($)</label>
            <input
              type="text"
              disabled
              className="w-full border rounded-lg px-3 py-2 bg-gray-50"
              value={`$${calculatedAmount}`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Payment System</label>
            <select
              className="w-full border rounded-lg px-3 py-2"
              value={form.paymentSystem}
              onChange={(e) => setForm({ ...form, paymentSystem: e.target.value })}
            >
              <option value="Stripe">Stripe</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Account Number</label>
            <input
              type="text"
              required
              className="w-full border rounded-lg px-3 py-2"
              value={form.accountNumber}
              onChange={(e) => setForm({ ...form, accountNumber: e.target.value })}
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          {canWithdraw ? (
            <button
              type="submit"
              disabled={submitting}
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
            >
              {submitting ? "Processing..." : "Withdraw"}
            </button>
          ) : (
            <p className="text-sm text-red-500 font-medium">Insufficient credit</p>
          )}
        </form>
      </div>
    </div>
  );
}
