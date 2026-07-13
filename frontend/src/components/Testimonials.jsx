"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Creator",
    photo: "https://i.pravatar.cc/80?img=1",
    quote:
      "FundForge made it incredibly easy to launch my campaign. I reached my funding goal in just two weeks!",
    stars: 5,
  },
  {
    name: "Marcus Chen",
    role: "Supporter",
    photo: "https://i.pravatar.cc/80?img=3",
    quote:
      "As a supporter, I love discovering new projects here. The platform is intuitive and secure.",
    stars: 5,
  },
  {
    name: "Priya Patel",
    role: "Creator",
    photo: "https://i.pravatar.cc/80?img=5",
    quote:
      "The community here is amazing. People genuinely want to help bring creative ideas to life.",
    stars: 5,
  },
  {
    name: "James Wilson",
    role: "Supporter",
    photo: "https://i.pravatar.cc/80?img=8",
    quote:
      "I've backed over 10 campaigns on FundForge. The transparency and trust are unmatched.",
    stars: 4,
  },
];

function Stars({ count }) {
  return (
    <div className="flex items-center justify-center gap-0.5" aria-label={`${count} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((s) => (
        <svg
          key={s}
          className={`w-5 h-5 ${s <= count ? "text-amber-400" : "text-gray-200"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function Testimonials() {
  return (
    <section className="relative py-20 px-4 overflow-hidden bg-gradient-to-b from-gray-50 to-white">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

      <div className="relative max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 bg-indigo-50 px-4 py-1.5 rounded-full mb-4">
            Testimonials
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 animate-slide-up">
            What Our Users Say
          </h2>
          <p className="text-lg text-gray-500 max-w-xl mx-auto">
            Real stories from the FundForge community.
          </p>
        </div>

        <Swiper
          modules={[Autoplay, Pagination]}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          loop
          className="testimonials-swiper w-full pb-12"
        >
          {testimonials.map((t, i) => (
            <SwiperSlide key={i}>
              <div className="relative flex flex-col items-center text-center px-8 py-10 mx-4 rounded-2xl bg-white border border-gray-100 shadow-sm animate-fade-in">
                {/* Large quote mark */}
                <svg
                  className="absolute top-4 left-6 w-12 h-12 text-indigo-100"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311C9.591 11.69 11 13.166 11 15c0 1.933-1.567 3.5-3.5 3.5-1.271 0-2.404-.655-2.917-1.179zm10 0c-1.03-1.094-1.583-2.321-1.583-4.31 0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311C19.591 11.69 21 13.166 21 15c0 1.933-1.567 3.5-3.5 3.5-1.271 0-2.404-.655-2.917-1.179z" />
                </svg>

                {/* Avatar */}
                <div className="relative mb-5">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 blur-sm opacity-60" />
                  <img
                    src={t.photo}
                    alt={t.name}
                    className="relative w-20 h-20 rounded-full object-cover border-2 border-white shadow-md"
                  />
                </div>

                {/* Stars */}
                <Stars count={t.stars} />

                {/* Quote */}
                <p className="text-lg text-gray-600 leading-relaxed max-w-lg mt-4 mb-5">
                  &ldquo;{t.quote}&rdquo;
                </p>

                {/* Name & Role */}
                <div>
                  <p className="font-bold text-gray-900">{t.name}</p>
                  <p className="text-sm text-gray-400">{t.role}</p>
                </div>

                {/* Gradient accent line */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-1 rounded-full bg-gradient-to-r from-indigo-400 to-purple-500" />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
