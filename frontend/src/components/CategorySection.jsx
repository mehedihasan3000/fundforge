"use client";

import { Gear, Eye, Person, HeartPulse } from "@gravity-ui/icons";

const categories = [
  { name: "Technology", icon: <Gear className="w-8 h-8" />, color: "bg-blue-100 text-blue-600" },
  { name: "Art", icon: <Eye className="w-8 h-8" />, color: "bg-purple-100 text-purple-600" },
  { name: "Community", icon: <Person className="w-8 h-8" />, color: "bg-green-100 text-green-600" },
  { name: "Health", icon: <HeartPulse className="w-8 h-8" />, color: "bg-red-100 text-red-600" },
];

export default function CategorySection() {
  return (
    <section className="py-16 bg-gray-50 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-10 animate-slide-up">
          Explore by Category
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((cat, i) => (
            <div
              key={i}
              className="flex flex-col items-center p-8 rounded-xl bg-white shadow-sm border hover:shadow-md cursor-pointer transition-all animate-slide-up"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-3 ${cat.color}`}>
                {cat.icon}
              </div>
              <span className="font-semibold text-gray-800">{cat.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
