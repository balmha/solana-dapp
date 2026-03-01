
// About.tsx
import React, { useState } from "react";
import Link from "next/link";
import { faqItems } from "../content/faq";
import { aboutContent } from "../content/about";

export const About = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  // FAQ data imported from shared content

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div id="webcrumbs">
      {/* Hero Section */}
      <div className="my-8 bg-neutral/60 backdrop-blur-xl p-10 rounded-2xl border border-white/10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-focus/20 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="flex flex-col gap-8 items-center text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent leading-tight tracking-tight">
            Welcome to SPLForge
          </h1>
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl leading-relaxed">
            Empowering the Solana community to create custom SPL tokens effortlessly. Our tools are designed for speed, security, and simplicity.
          </p>
          <Link href="/tokencreator">
            <button className="bg-gradient-to-r from-purple-600 to-primary hover:from-purple-500 hover:to-primary-focus text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 shadow-[0_0_20px_rgba(153,69,255,0.3)] hover:shadow-[0_0_30px_rgba(153,69,255,0.5)] border border-white/10">
              Create Your Token Now
            </button>
          </Link>
        </div>
      </div>

      {/* Mission Section */}
      <div className="my-12 bg-neutral/60 backdrop-blur-xl p-8 md:p-12 rounded-2xl border border-white/10 shadow-2xl">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center border border-purple-500/30">
            <span className="material-symbols-outlined text-purple-400 text-2xl">rocket_launch</span>
          </div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Our Mission</h2>
        </div>
        <div className="space-y-4 text-gray-400 text-lg leading-relaxed">
          {aboutContent.mission.map((paragraph, idx) => (
            <p key={idx}>{paragraph}</p>
          ))}
        </div>
      </div>

      {/* Why Choose SPLForge Section */}
      <div className="my-12 bg-neutral/60 backdrop-blur-xl p-8 md:p-12 rounded-2xl border border-white/10 shadow-2xl">
        <h2 className="text-3xl font-bold text-white mb-10 tracking-tight text-center">Why Choose SPLForge?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {aboutContent.whyChooseUs.map((item, idx) => (
            <div key={idx} className="flex flex-col gap-4 bg-black/40 p-6 rounded-xl border border-white/5 hover:border-white/10 transition-colors group">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 group-hover:bg-primary/20 transition-colors">
                <span className="material-symbols-outlined text-primary-focus">bolt</span>
              </div>
              <h3 className="text-xl font-bold text-white">{item.title}</h3>
              <p className="text-gray-400 leading-relaxed text-sm">{item.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="my-12 bg-neutral/60 backdrop-blur-xl p-8 md:p-12 rounded-2xl border border-white/10 shadow-2xl">
        <h2 className="text-3xl font-bold text-white mb-10 tracking-tight text-center">Frequently Asked Questions</h2>
        <div className="w-full max-w-4xl mx-auto space-y-4" data-orientation="vertical">
          {faqItems.map((item, index) => (
            <div key={index} className="bg-black/40 border border-white/5 rounded-xl overflow-hidden transition-all duration-300 hover:border-white/10">
              <h2>
                <button
                  className="flex py-5 px-6 w-full gap-4 items-center justify-between text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-focus"
                  type="button"
                  onClick={() => toggleFAQ(index)}
                  aria-expanded={openIndex === index}
                >
                  <span className="text-white font-semibold text-lg">{item.question}</span>
                  <span
                    aria-hidden="true"
                    className={`text-gray-400 transition-transform duration-300 ease-in-out flex-shrink-0 bg-white/5 rounded-full p-1 ${openIndex === index ? "rotate-180 bg-white/10" : "rotate-0"}`}
                  >
                    <span className="material-symbols-outlined text-xl">expand_more</span>
                  </span>
                </button>
              </h2>
              <div
                className={`transition-all duration-300 ease-in-out overflow-hidden ${openIndex === index ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}
              >
                <div className="px-6 pb-6 pt-0 text-gray-400 leading-relaxed whitespace-pre-wrap text-sm border-t border-white/5 mx-6 mt-2 pt-4">
                  {item.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default About;