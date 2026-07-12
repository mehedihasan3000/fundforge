"use client";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { Person, Persons, Wallet, CreditCard } from "@gravity-ui/icons";

export default function AdminHome() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const users = await api.get("/api/users");
        const supporters = users.filter((u) => u.role === "supporter").length;
        const creators = users.filter((u) => u.role === "creator").length;
        const totalCredits = users.reduce((sum, u) => sum + (u.credits || 0), 0);
        const payments = await api.get("/api/payments/history").catch(() => []);
        const totalPayments = payments.length;
        setStats({ supporters, creators, totalCredits, totalPayments });
      } catch (err) {
        console.error(err);
      }
    }
    load();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center gap-3">
            <Person className="w-5 h-5 text-indigo-600" />
            <div>
              <p className="text-sm text-gray-500">Supporters</p>
              <p className="text-2xl font-bold">{stats ? stats.supporters : "—"}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center gap-3">
            <Persons className="w-5 h-5 text-green-600" />
            <div>
              <p className="text-sm text-gray-500">Creators</p>
              <p className="text-2xl font-bold">{stats ? stats.creators : "—"}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center gap-3">
            <Wallet className="w-5 h-5 text-yellow-600" />
            <div>
              <p className="text-sm text-gray-500">Total Credits</p>
              <p className="text-2xl font-bold">{stats ? stats.totalCredits : "—"}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center gap-3">
            <CreditCard className="w-5 h-5 text-red-600" />
            <div>
              <p className="text-sm text-gray-500">Payments</p>
              <p className="text-2xl font-bold">{stats ? stats.totalPayments : "—"}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
