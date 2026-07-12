"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

const testimonials = [
  {
    name: "Sarah Johnson",
    photo: "https://i.pravatar.cc/80?img=1",
    quote: "FundForge made it incredibly easy to launch my campaign. I reached my funding goal in just two weeks!",
  },
  {
    name: "Marcus Chen",
    photo: "https://i.pravatar.cc/80?img=3",
    quote: "As a supporter, I love discovering new projects here. The platform is intuitive and secure.",
  },
  {
    name: "Priya Patel",
    photo: "https://i.pravatar.cc/80?img=5",
    quote: "The community here is amazing. People genuinely want to help bring creative ideas to life.",
  },
  {
    name: "James Wilson",
    photo: "https://i.pravatar.cc/80?img=8",
    quote: "I've backed over 10 campaigns on FundForge. The transparency and trust are unmatched.",
  },
];

export default function Testimonials() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-10 animate-slide-up">
          What Our Users Say
        </h2>
        <Swiper
          modules={[Autoplay]}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          loop
          className="w-full"
        >
          {testimonials.map((t, i) => (
            <SwiperSlide key={i}>
              <div className="flex flex-col items-center text-center px-6 py-8 animate-fade-in">
                <img
                  src={t.photo}
                  alt={t.name}
                  className="w-20 h-20 rounded-full object-cover mb-4"
                />
                <p className="text-lg text-gray-700 italic max-w-xl mb-4">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <p className="font-semibold text-gray-900">{t.name}</p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
