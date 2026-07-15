"use client";

import { Gear, Eye, Person, HeartPulse, Thunderbolt, MusicNote } from "@gravity-ui/icons";

const categories = [
  { name: "Technology", icon: <Gear className="w-8 h-8" />, gradient: "from-blue-500 to-cyan-600", light: "from-blue-50 to-cyan-50", count: "48 campaigns" },
  { name: "Art & Design", icon: <Eye className="w-8 h-8" />, gradient: "from-purple-500 to-pink-600", light: "from-purple-50 to-pink-50", count: "36 campaigns" },
  { name: "Community", icon: <Person className="w-8 h-8" />, gradient: "from-emerald-500 to-teal-600", light: "from-emerald-50 to-teal-50", count: "52 campaigns" },
  { name: "Health", icon: <HeartPulse className="w-8 h-8" />, gradient: "from-red-500 to-rose-600", light: "from-red-50 to-rose-50", count: "29 campaigns" },
  { name: "Education", icon: <Thunderbolt className="w-8 h-8" />, gradient: "from-amber-500 to-orange-600", light: "from-amber-50 to-orange-50", count: "41 campaigns" },
  { name: "Music & Film", icon: <MusicNote className="w-8 h-8" />, gradient: "from-violet-500 to-indigo-600", light: "from-violet-50 to-indigo-50", count: "23 campaigns" },
];

export default function CategorySection() {
  return (
    <section className="relative py-20 px-4 overflow-hidden bg-gradient-to-b from-white to-gray-50/50">
      {/* Dot grid background */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: "radial-gradient(circle, #4338ca 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
        aria-hidden="true"
      />

      <div className="relative max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 bg-indigo-50 px-4 py-1.5 rounded-full mb-4">
            Browse Categories
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 animate-slide-up">
            Explore by Category
          </h2>
          <p className="text-lg text-gray-500 max-w-xl mx-auto">
            Find campaigns that match your interests and passions.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
          {categories.map((cat, i) => (
            <div
              key={i}
              className="group relative flex flex-col items-center text-center p-7 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1.5 cursor-pointer transition-all duration-300 animate-slide-up"
              style={{ animationDelay: `${i * 0.08}s` }}
              role="button"
              tabIndex={0}
              aria-label={`Explore ${cat.name} campaigns`}
            >
              {/* Gradient border on hover */}
              <div
                className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${cat.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10`}
                style={{ padding: "2px" }}
              />
              <div className="absolute inset-0 rounded-2xl bg-white -z-10" />

              <div
                className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${cat.gradient} text-white flex items-center justify-center mb-4 shadow-md group-hover:scale-110 group-hover:-rotate-3 transition-all duration-300`}
              >
                {cat.icon}
              </div>
              <span className="font-bold text-gray-900 text-sm mb-1">{cat.name}</span>
              <span className="text-xs text-gray-400">{cat.count}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
