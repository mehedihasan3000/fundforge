"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation, EffectFade } from "swiper/modules";
import Link from "next/link";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-fade";

const slides = [
  {
    title: "Bring Your Ideas to Life",
    subtitle:
      "Join thousands of creators who have funded their dreams through community support.",
    gradient: "from-violet-600 via-purple-600 to-indigo-800",
    accent: "from-pink-500 to-rose-500",
    illustration: (
      <svg
        viewBox="0 0 400 400"
        className="w-56 h-56 md:w-80 md:h-80 xl:w-96 xl:h-96"
        aria-hidden="true"
      >
        <defs>
          <radialGradient id="g1" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.25)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </radialGradient>
        </defs>
        <circle cx="200" cy="140" r="120" fill="url(#g1)" />
        <circle cx="200" cy="140" r="70" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
        <circle cx="200" cy="140" r="40" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
        <circle cx="200" cy="140" r="15" fill="rgba(255,255,255,0.25)" />
        <path
          d="M200 60 L230 100 L215 100 L215 130 L185 130 L185 100 L170 100 Z"
          fill="rgba(255,255,255,0.2)"
        />
        <circle cx="320" cy="300" r="60" fill="url(#g1)" />
        <circle cx="80" cy="280" r="50" fill="url(#g1)" />
        <circle cx="320" cy="300" r="25" fill="rgba(255,255,255,0.1)" />
        <circle cx="80" cy="280" r="18" fill="rgba(255,255,255,0.1)" />
      </svg>
    ),
  },
  {
    title: "Support Projects You Believe In",
    subtitle:
      "Discover innovative campaigns and help turn visions into reality.",
    gradient: "from-emerald-600 via-teal-600 to-cyan-800",
    accent: "from-emerald-400 to-green-500",
    illustration: (
      <svg
        viewBox="0 0 400 400"
        className="w-56 h-56 md:w-80 md:h-80 xl:w-96 xl:h-96"
        aria-hidden="true"
      >
        <defs>
          <radialGradient id="g2" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.2)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </radialGradient>
        </defs>
        <circle cx="200" cy="150" r="40" fill="rgba(255,255,255,0.15)" />
        <circle cx="130" cy="260" r="30" fill="rgba(255,255,255,0.12)" />
        <circle cx="270" cy="260" r="30" fill="rgba(255,255,255,0.12)" />
        <line
          x1="200"
          y1="190"
          x2="130"
          y2="230"
          stroke="rgba(255,255,255,0.2)"
          strokeWidth="2"
        />
        <line
          x1="200"
          y1="190"
          x2="270"
          y2="230"
          stroke="rgba(255,255,255,0.2)"
          strokeWidth="2"
        />
        <line
          x1="160"
          y1="260"
          x2="240"
          y2="260"
          stroke="rgba(255,255,255,0.2)"
          strokeWidth="2"
        />
        <circle cx="200" cy="150" r="15" fill="rgba(255,255,255,0.25)" />
        <circle cx="130" cy="260" r="12" fill="rgba(255,255,255,0.2)" />
        <circle cx="270" cy="260" r="12" fill="rgba(255,255,255,0.2)" />
        <circle cx="330" cy="80" r="70" fill="url(#g2)" />
        <circle cx="50" cy="350" r="60" fill="url(#g2)" />
      </svg>
    ),
  },
  {
    title: "Where Every Contribution Counts",
    subtitle:
      "Your support makes a difference \u2014 no matter the size.",
    gradient: "from-orange-600 via-amber-600 to-red-800",
    accent: "from-amber-400 to-orange-500",
    illustration: (
      <svg
        viewBox="0 0 400 400"
        className="w-56 h-56 md:w-80 md:h-80 xl:w-96 xl:h-96"
        aria-hidden="true"
      >
        <defs>
          <radialGradient id="g3" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.2)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </radialGradient>
        </defs>
        <rect
          x="100"
          y="220"
          width="30"
          height="100"
          rx="8"
          fill="rgba(255,255,255,0.15)"
        />
        <rect
          x="155"
          y="180"
          width="30"
          height="140"
          rx="8"
          fill="rgba(255,255,255,0.2)"
        />
        <rect
          x="210"
          y="130"
          width="30"
          height="190"
          rx="8"
          fill="rgba(255,255,255,0.25)"
        />
        <rect
          x="265"
          y="160"
          width="30"
          height="160"
          rx="8"
          fill="rgba(255,255,255,0.2)"
        />
        <line
          x1="90"
          y1="330"
          x2="310"
          y2="330"
          stroke="rgba(255,255,255,0.15)"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M110 315 C 160 290, 200 290, 225 315"
          fill="none"
          stroke="rgba(255,255,255,0.12)"
          strokeWidth="2"
        />
        <circle cx="340" cy="60" r="80" fill="url(#g3)" />
        <circle cx="50" cy="370" r="60" fill="url(#g3)" />
      </svg>
    ),
  },
];

export default function HeroSection() {
  return (
    <section className="relative" aria-label="Featured campaigns">
      <Swiper
        modules={[Autoplay, Pagination, Navigation, EffectFade]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        autoplay={{ delay: 6000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        navigation
        loop
        className="hero-swiper w-full"
      >
        {slides.map((slide, i) => (
          <SwiperSlide key={i}>
            <div
              className={`relative flex items-center justify-center bg-gradient-to-br ${slide.gradient} min-h-[85vh] md:min-h-[90vh] px-6 overflow-hidden`}
            >
              {/* Background orbs */}
              <div className="absolute -top-20 -left-20 w-72 h-72 md:w-96 md:h-96 rounded-full bg-white/5 blur-3xl" />
              <div className="absolute -bottom-20 -right-20 w-80 h-80 md:w-[30rem] md:h-[30rem] rounded-full bg-white/5 blur-3xl" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] rounded-full bg-white/[0.03] blur-2xl" />

              {/* Dot grid overlay */}
              <div
                className="absolute inset-0 opacity-[0.04]"
                style={{
                  backgroundImage:
                    "radial-gradient(circle, white 1px, transparent 1px)",
                  backgroundSize: "40px 40px",
                }}
                aria-hidden="true"
              />

              {/* Decorative illustration */}
              <div className="absolute right-0 bottom-0 md:right-8 md:bottom-8 lg:right-16 lg:bottom-16 opacity-40 md:opacity-60 lg:opacity-80 pointer-events-none will-change-transform animate-float">
                {slide.illustration}
              </div>

              {/* Content */}
              <div className="relative z-10 text-center text-white max-w-4xl mx-auto">
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold leading-[1.1] mb-6 animate-fade-in">
                  {slide.title}
                </h1>
                <p
                  className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/80 max-w-2xl mx-auto mb-8 md:mb-10 animate-fade-in"
                  style={{ animationDelay: "0.2s" }}
                >
                  {slide.subtitle}
                </p>
                <div
                  className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in"
                  style={{ animationDelay: "0.4s" }}
                >
                  <Link
                    href="/register"
                    className={`inline-flex items-center gap-2 px-8 py-3.5 md:px-10 md:py-4 rounded-full font-semibold text-base md:text-lg bg-gradient-to-r ${slide.accent} text-white shadow-xl hover:shadow-2xl hover:scale-105 active:scale-100 transition-all duration-300 focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2`}
                  >
                    Get Started
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </Link>
                  <Link
                    href="/explore"
                    className="inline-flex items-center gap-2 px-8 py-3.5 md:px-10 md:py-4 rounded-full font-semibold text-base md:text-lg border-2 border-white/30 text-white hover:bg-white/10 hover:border-white/50 active:bg-white/20 transition-all duration-300 focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2"
                  >
                    Explore Campaigns
                  </Link>
                </div>
              </div>

              {/* Bottom fade */}
              <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white/5 to-transparent pointer-events-none" />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
