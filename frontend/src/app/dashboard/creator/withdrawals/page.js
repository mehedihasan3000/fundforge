"use client";
import { useState, useEffect } from "react";
import { useToast } from "@/context/ToastContext";
import { api } from "@/lib/api";
import { Wallet, CreditCard, CircleExclamation } from "@gravity-ui/icons";

export default function Withdrawals() {
  const { showToast } = useToast();
  const [earnings, setEarnings] = useState({ raised: 0, dollar: 0 });
  const [loadError, setLoadError] = useState("");
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
        setLoadError(err.message);
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
      showToast("Withdrawal request submitted!");
      setForm({ withdrawalCredit: "", paymentSystem: "Stripe", accountNumber: "" });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Withdrawals</h1>
        <p className="text-sm text-gray-500 mt-1">Convert your campaign earnings to USD</p>
      </div>

      {loadError && (
        <div className="mb-4 flex items-center gap-2 text-red-600 bg-red-50 border border-red-100 px-4 py-3 rounded-xl text-sm">
          {loadError}
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-indigo-100 flex items-center justify-center">
              <Wallet className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Total Raised Credits</p>
              <p className="text-2xl font-bold text-gray-900">{earnings.raised} cr</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-green-100 flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Withdrawal Amount (20 cr = $1)</p>
              <p className="text-2xl font-bold text-gray-900">${earnings.dollar.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 max-w-lg">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Request Withdrawal</h2>
        <p className="text-xs text-gray-400 mb-4">Minimum withdrawal: <strong>200 credits</strong> ($10)</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Credits to Withdraw</label>
            <input
              type="number"
              min="200"
              required
              className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors placeholder:text-gray-400"
              placeholder="e.g. 500"
              value={form.withdrawalCredit}
              onChange={(e) => setForm({ ...form, withdrawalCredit: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Withdrawal Amount ($)</label>
            <input
              type="text"
              disabled
              className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm bg-gray-50 text-gray-700 focus:outline-none"
              value={`$${calculatedAmount}`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Payment System</label>
            <select
              className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              value={form.paymentSystem}
              onChange={(e) => setForm({ ...form, paymentSystem: e.target.value })}
            >
              <option value="Stripe">Stripe</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Account Number</label>
            <input
              type="text"
              required
              className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors placeholder:text-gray-400"
              placeholder="Your Stripe account ID"
              value={form.accountNumber}
              onChange={(e) => setForm({ ...form, accountNumber: e.target.value })}
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-100 px-4 py-3 rounded-xl text-sm">
              <CircleExclamation className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          {canWithdraw ? (
            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white py-2.5 rounded-xl font-semibold text-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-600/25"
            >
              <CreditCard className="w-4 h-4" />
              {submitting ? "Processing..." : "Withdraw"}
            </button>
          ) : (
            <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3">
              <p className="text-sm text-red-600 font-medium text-center">Insufficient credit — minimum 200 credits required</p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
