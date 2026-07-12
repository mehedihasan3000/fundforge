"use client";
import { useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { Plus, Wallet, CircleExclamation } from "@gravity-ui/icons";

const PACKAGES = [
  { credits: 100, price: 10 },
  { credits: 300, price: 25, popular: false },
  { credits: 800, price: 60, popular: true },
  { credits: 1500, price: 110 },
];

export default function PurchaseCredits() {
  const { setCredits } = useAuth();
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState("");

  async function handlePurchase(pkg) {
    setLoading(pkg.credits);
    setError("");
    try {
      const { clientSecret } = await api.post("/api/payments/create-payment-intent", { credits: pkg.credits });
      const stripeSecretKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
      if (!stripeSecretKey) {
        setError("Stripe is not configured");
        return;
      }
      if (!window.Stripe) {
        await loadStripeScript();
      }
      if (!window.Stripe) {
        setError("Failed to load Stripe");
        return;
      }
      const stripeInstance = window.Stripe(stripeSecretKey);
      const { error: stripeError, paymentIntent } = await stripeInstance.confirmCardPayment(clientSecret, {
        payment_method: { card: { token: "tok_visa" } },
      });
      if (stripeError) {
        setError(stripeError.message);
        return;
      }
      if (paymentIntent.status === "succeeded") {
        await api.post("/api/payments/confirm", {
          credits: pkg.credits,
          amount: pkg.price,
          stripePaymentId: paymentIntent.id,
        });
        setCredits((prev) => prev + pkg.credits);
        alert(`Successfully purchased ${pkg.credits} credits!`);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(null);
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Purchase Credits</h1>
        <p className="text-sm text-gray-500 mt-1">Buy credits to support campaigns (10 credits = $1)</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {PACKAGES.map((pkg) => (
          <div
            key={pkg.credits}
            className={`relative bg-white rounded-xl border-2 p-6 text-center hover:shadow-lg transition-all duration-200 ${
              pkg.popular ? "border-indigo-500 shadow-md" : "border-gray-200"
            }`}
          >
            {pkg.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-xs font-semibold px-3 py-0.5 rounded-full">
                Best Value
              </div>
            )}
            <Wallet className="w-8 h-8 text-indigo-600 mx-auto mb-3" />
            <p className="text-3xl font-bold text-gray-900 mb-1">{pkg.credits}</p>
            <p className="text-xs text-gray-500 mb-3">Credits</p>
            <p className="text-xl font-bold text-indigo-600 mb-4">${pkg.price}</p>
            <p className="text-xs text-gray-400 mb-4">
              {pkg.credits / 10} credits per dollar
            </p>
            <button
              onClick={() => handlePurchase(pkg)}
              disabled={loading === pkg.credits}
              className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-xl font-semibold text-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-600/25"
            >
              {loading === pkg.credits ? (
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : (
                <Plus className="w-4 h-4" />
              )}
              {loading === pkg.credits ? "Processing..." : "Buy Now"}
            </button>
          </div>
        ))}
      </div>

      {error && (
        <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-100 px-4 py-3 rounded-xl text-sm mt-6">
          <CircleExclamation className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}
    </div>
  );
}

async function loadStripeScript() {
  return new Promise((resolve, reject) => {
    if (document.getElementById("stripe-js")) return resolve();
    const script = document.createElement("script");
    script.id = "stripe-js";
    script.src = "https://js.stripe.com/v3/";
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}
