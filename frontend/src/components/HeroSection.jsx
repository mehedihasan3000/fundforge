"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

const slides = [
  {
    title: "Bring Your Ideas to Life",
    subtitle: "Join thousands of creators who have funded their dreams through community support.",
    bg: "from-indigo-600 to-purple-700",
  },
  {
    title: "Support Projects You Believe In",
    subtitle: "Discover innovative campaigns and help turn visions into reality.",
    bg: "from-emerald-600 to-teal-700",
  },
  {
    title: "Where Every Contribution Counts",
    subtitle: "Your support makes a difference — no matter the size.",
    bg: "from-orange-600 to-red-700",
  },
];

export default function HeroSection() {
  return (
    <section className="relative">
      <Swiper
        modules={[Autoplay, Pagination]}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        loop
        className="w-full"
      >
        {slides.map((slide, i) => (
          <SwiperSlide key={i}>
            <div
              className={`flex items-center justify-center bg-gradient-to-r ${slide.bg} h-[70vh] min-h-[400px] px-6`}
            >
              <div className="text-center text-white max-w-2xl animate-fade-in">
                <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
                  {slide.title}
                </h1>
                <p className="text-lg md:text-xl text-white/80">{slide.subtitle}</p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
