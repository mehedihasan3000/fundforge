"use client";

import { Person, Plus, Wallet, ChartLine } from "@gravity-ui/icons";

const steps = [
  {
    icon: <Person className="w-8 h-8" />,
    title: "Create an Account",
    desc: "Sign up as a Supporter or Creator in seconds with email or Google.",
  },
  {
    icon: <Plus className="w-8 h-8" />,
    title: "Start or Support a Campaign",
    desc: "Creators launch campaigns — Supporters browse and contribute credits.",
  },
  {
    icon: <Wallet className="w-8 h-8" />,
    title: "Fund & Grow",
    desc: "Campaigns reach their funding goals with help from the community.",
  },
  {
    icon: <ChartLine className="w-8 h-8" />,
    title: "Withdraw & Celebrate",
    desc: "Creators withdraw funds once approved. Supporters track their impact.",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-16 px-4 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-12 animate-slide-up">
        How It Works
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {steps.map((step, i) => (
          <div
            key={i}
            className="flex flex-col items-center text-center p-6 rounded-xl bg-white shadow-sm border hover:shadow-md transition-shadow animate-slide-up"
            style={{ animationDelay: `${i * 0.15}s` }}
          >
            <div className="w-14 h-14 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center mb-4">
              {step.icon}
            </div>
            <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
            <p className="text-sm text-gray-600">{step.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
