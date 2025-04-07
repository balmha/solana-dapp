
// About.tsx
import React, { useState } from "react";
import Link from "next/link";

export const About = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  // FAQ data
  const faqItems = [
    {
      question: "What is the Solana Token Creator?",
      answer: "The SPLForge Solana Token Creator is an advanced Smart Contract empowering users to effortlessly generate customized SPL Tokens (Solana tokens), specifically tailored to their preferences in terms of supply, name, symbol, description, and image on the Solana Chain. Making tokens is super quick and cheap with our easy process.",
    },
    {
      question: "Is it Safe to Create Solana Tokens here?",
      answer: "Yes, our tools is completely safe. It is a dApp that creates your token, giving you and only you the mint and freeze Authority (the control of a SPL Token). Our dApp could be used by hundred of users keeping the same security level, high availability and throughput.",
    },
    {
      question: "How much time will the Solana Token Creator Take?",
      answer: "The time of your Token Creation depends on the TPS Status of Solana. It usually takes just a few seconds so do not worry, you will see your recently token created in the Token Dashboard page. If you have any issue please contact us",
    },
    {
      question: "How much does it cost?",
      answer: "The minimum token creation cost is 0.1 SOL, it doesn't includes fees for Token Creation in Solana mainnet (between 0.01-0.02 SOL these days).",
    },
    {
      question: "Which wallet can I use?",
      answer: "You can use any Solana-compatible wallet, such as Phantom, Solflare, Torus or Ledger.",
    },
    {
      question: "How many tokens can I create for each decimal amount?",
      answer: "Here is the max amount of tokens you can create for each decimal range. \n\n 0 to 4 - 1,844,674,407,370,955 \n 5 to 7 - 1,844,674,407,370 \n 8 - 184,467,440,737 \n 9 - 18,446,744,073",
    },
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div id="webcrumbs">
      {/* Hero Section */}
      <div className="my-8 bg-indigo-950/50 backdrop-blur-sm p-6 rounded-xl border border-indigo-800/30">
        <div className="flex flex-col gap-10 items-center text-center">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent leading-tight">
          Welcome to SPLForge
        </h1>
          <p className="text-xl text-gray-300">
            Empowering the Solana community to create custom SPL tokens effortlessly.
          </p>
          <Link
              href="/tokencreator"
            >
              <button className="bg-purple-800 hover:bg-purple-900 text-white font-bold py-3 px-6 rounded-lg transition-all">
            Create Your Token Now
            </button>
          </Link>
        </div>
      </div>

      {/* Mission Section */}
      <div className="my-16 bg-indigo-950/50 backdrop-blur-sm p-6 rounded-xl border border-indigo-800/30">
        <h2 className="text-4xl font-bold mb-4">Our Mission</h2>
        <p className="text-xl mb-4">
          At SPLForge, we believe in democratizing token creation on the Solana blockchain. Our mission is to provide a secure, fast, and user-friendly platform that empowers individuals and projects to bring their ideas to life.
        </p>
        <p className="text-xl">
          By leveraging Solana&apos;s high-speed, low-cost infrastructure, we aim to foster innovation and creativity within the blockchain ecosystem.
        </p>
      </div>

      {/* Why Choose SPLForge Section */}
      <div className="my-16 bg-indigo-950/50 backdrop-blur-sm p-6 rounded-xl border border-indigo-800/30">
        <h2 className="text-3xl font-bold mb-8">Why Choose SPLForge?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col gap-4">
            <h3 className="text-xl font-semibold">🚀 Fast & Efficient</h3>
            <p className="text-gray-300">
              Create tokens in seconds with Solana&apos;s lightning-fast blockchain.
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <h3 className="text-xl font-semibold">🔒 Secure & Trusted</h3>
            <p className="text-gray-300">
              Your tokens are secured by Solana&apos;s robust smart contracts.
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <h3 className="text-xl font-semibold">💡 User-Friendly</h3>
            <p className="text-gray-300">
              No coding required. Anyone can create tokens with ease.
            </p>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="my-16 bg-indigo-950/50 backdrop-blur-sm p-6 rounded-xl border border-indigo-800/30">
        <h2 className="text-3xl font-bold mb-8">Frequently Asked Questions</h2>
        <div className="w-full px-0" data-orientation="vertical">
          {faqItems.map((item, index) => (
            <div key={index}>
              <div className="group-[.is-splitted]:px-4 group-[.is-splitted]:bg-content1 group-[.is-splitted]:shadow-medium group-[.is-splitted]:rounded-medium">
                <h2>
                  <button
                    className="flex py-4 w-full h-full gap-3 items-center tap-highlight-transparent outline-none data-[focus-visible=true]:z-10 data-[focus-visible=true]:outline-2 data-[focus-visible=true]:outline-focus data-[focus-visible=true]:outline-offset-2 transition-opacity"
                    type="button"
                    onClick={() => toggleFAQ(index)}
                    aria-expanded={openIndex === index}
                  >
                    <div className="flex-1 flex flex-col text-start">
                      <span className="text-foreground text-large">{item.question}</span>
                    </div>
                    <span
                      aria-hidden="true"
                      className={`text-default-400 transition-transform ${
                        openIndex === index ? "rotate-90" : "rotate-0"
                      }`}
                    >
                      <svg aria-hidden="true" fill="none" focusable="false" height="1em" role="presentation" viewBox="0 0 24 24" width="1em">
                        <path d="M15.5 19l-7-7 7-7" stroke="currentColor"></path>
                      </svg>
                    </span>
                  </button>
                </h2>
              </div>
              {openIndex === index && (
                <div className="px-4 py-2 text-foreground text-left whitespace-pre-wrap">
                  {item.answer}
                </div>
              )}
              {index < faqItems.length - 1 && (
                <hr className="w-full border-t border-indigo-700/30 my-4" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default About;