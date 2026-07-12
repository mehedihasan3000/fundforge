"use client";
import { useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

const PACKAGES = [
  { credits: 100, price: 10 },
  { credits: 300, price: 25 },
  { credits: 800, price: 60 },
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
      const stripe = window.Stripe
        ? null
        : await loadStripeScript();
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
      <h1 className="text-2xl font-bold mb-6">Purchase Credits</h1>
      <p className="text-gray-600 mb-6">10 credits = $1</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {PACKAGES.map((pkg) => (
          <div key={pkg.credits} className="bg-white rounded-lg border p-6 text-center hover:shadow-md transition-shadow">
            <p className="text-3xl font-bold text-indigo-600 mb-2">{pkg.credits}</p>
            <p className="text-sm text-gray-500 mb-1">Credits</p>
            <p className="text-xl font-semibold mb-4">${pkg.price}</p>
            <button
              onClick={() => handlePurchase(pkg)}
              disabled={loading === pkg.credits}
              className="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
            >
              {loading === pkg.credits ? "Processing..." : "Buy Now"}
            </button>
          </div>
        ))}
      </div>

      {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
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
