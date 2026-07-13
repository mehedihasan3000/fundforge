"use client";

import { Person, Plus, Wallet, ChartLine } from "@gravity-ui/icons";

const steps = [
  {
    num: "01",
    icon: <Person className="w-7 h-7" />,
    title: "Create an Account",
    desc: "Sign up as a Supporter or Creator in seconds with email or Google.",
    gradient: "from-violet-500 to-purple-600",
    glow: "from-violet-200 to-purple-200",
  },
  {
    num: "02",
    icon: <Plus className="w-7 h-7" />,
    title: "Start or Support a Campaign",
    desc: "Creators launch campaigns — Supporters browse and contribute credits.",
    gradient: "from-blue-500 to-cyan-600",
    glow: "from-blue-200 to-cyan-200",
  },
  {
    num: "03",
    icon: <Wallet className="w-7 h-7" />,
    title: "Fund & Grow",
    desc: "Campaigns reach their funding goals with help from the community.",
    gradient: "from-emerald-500 to-teal-600",
    glow: "from-emerald-200 to-teal-200",
  },
  {
    num: "04",
    icon: <ChartLine className="w-7 h-7" />,
    title: "Withdraw & Celebrate",
    desc: "Creators withdraw funds once approved. Supporters track their impact.",
    gradient: "from-amber-500 to-orange-600",
    glow: "from-amber-200 to-orange-200",
  },
];

export default function HowItWorks() {
  return (
    <section className="relative py-20 px-4 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-indigo-100/60 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-purple-100/60 blur-3xl pointer-events-none" />

      {/* Connecting line (desktop) */}
      <div className="hidden lg:block absolute top-1/2 left-[calc(12.5%+3rem)] right-[calc(12.5%+3rem)] h-px bg-gradient-to-r from-violet-300 via-blue-300 via-emerald-300 to-amber-300 pointer-events-none" aria-hidden="true" />

      <div className="relative max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 bg-indigo-50 px-4 py-1.5 rounded-full mb-4">
            Simple Process
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 animate-slide-up">
            How It Works
          </h2>
          <p className="text-lg text-gray-500 max-w-xl mx-auto">
            From sign-up to pay-out, getting started takes just a few clicks.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, i) => (
            <div
              key={i}
              className="group relative flex flex-col items-center text-center p-8 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 animate-slide-up"
              style={{ animationDelay: `${i * 0.15}s` }}
            >
              {/* Hover glow */}
              <div
                className={`absolute inset-0 rounded-2xl bg-gradient-to-b ${step.glow} opacity-0 group-hover:opacity-20 transition-opacity duration-300 pointer-events-none`}
              />

              {/* Step number */}
              <span className="text-4xl font-black bg-gradient-to-br ${step.gradient} bg-clip-text text-transparent opacity-20 group-hover:opacity-40 transition-opacity mb-2 select-none">
                {step.num}
              </span>

              {/* Icon */}
              <div
                className={`relative w-16 h-16 rounded-2xl bg-gradient-to-br ${step.gradient} text-white flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}
              >
                {step.icon}
              </div>

              <h3 className="font-bold text-lg text-gray-900 mb-2">{step.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
