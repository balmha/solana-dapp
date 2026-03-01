import { FC } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import React, { useState } from 'react';
import { useAutoConnect } from '../contexts/AutoConnectProvider';
import NetworkSwitcher from './NetworkSwitcher';
import NavElement from './nav-element';
import { Toaster } from 'react-hot-toast';

const WalletMultiButtonDynamic = dynamic(
  async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
  { ssr: false }
);

export const AppBar: FC = () => {
  const { autoConnect, setAutoConnect } = useAutoConnect();
  const [isNavOpen, setIsNavOpen] = useState(false);

  return (
    <div className="sticky top-0 z-50 w-full bg-black/60 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">

          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" rel="noopener noreferrer" passHref>
              <div className="audiowide-text text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-cyan-400 cursor-pointer flex items-center gap-2 drop-shadow-[0_0_10px_rgba(153,69,255,0.4)]">
                SPLForge
              </div>
            </Link>
          </div>

          {/* Nav Links (Desktop) */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-6 text-sm">
              <NavElement label="Home" href="/" />
              <NavElement label="Token Creator" href="/tokencreator" />
              <NavElement label="Liquidity Pool" href="/liquiditypool" />
              <NavElement label="Dashboard" href="/dashboard" />
              <NavElement label="About" href="/about" />
            </div>
          </div>

          {/* Right Section: Settings & Wallet */}
          <div className="flex items-center gap-3">
            {/* Settings Dropdown */}
            <div className="dropdown dropdown-end">
              <div tabIndex={0} className="btn btn-circle btn-ghost text-gray-300 hover:text-white hover:bg-white/10 transition-colors border border-white/5 bg-black/40">
                <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <ul tabIndex={0} className="mt-3 p-3 shadow-xl menu menu-compact dropdown-content bg-neutral border border-white/10 rounded-xl w-64 backdrop-blur-xl">
                <li>
                  <div className="form-control">
                    <label className="cursor-pointer label">
                      <span className="text-gray-300">Autoconnect</span>
                      <input type="checkbox" checked={autoConnect} onChange={(e) => setAutoConnect(e.target.checked)} className="toggle toggle-primary" />
                    </label>
                  </div>
                </li>
                <div className="divider my-1 border-white/10"></div>
                <li className="select-none">
                  <NetworkSwitcher />
                </li>
              </ul>
            </div>

            {/* Wallet Button */}
            <WalletMultiButtonDynamic className="!h-10 !rounded-lg !px-4 !bg-gradient-to-r !from-purple-600 !to-blue-600 hover:!from-purple-500 hover:!to-blue-500 !transition-all !duration-300 !font-medium !text-sm !shadow-[0_0_15px_rgba(153,69,255,0.4)]" />

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center ml-2">
              <button onClick={() => setIsNavOpen(!isNavOpen)} className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-white/10 focus:outline-none transition-colors">
                <span className="sr-only">Open main menu</span>
                {!isNavOpen ? (
                  <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                ) : (
                  <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {isNavOpen && (
        <div className="md:hidden bg-neutral border-b border-white/10 shadow-2xl">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <div className="block px-3 py-2 rounded-md text-base font-medium">
              <NavElement label="Home" href="/" navigationStarts={() => setIsNavOpen(false)} />
            </div>
            <div className="block px-3 py-2 rounded-md text-base font-medium">
              <NavElement label="Token Creator" href="/tokencreator" navigationStarts={() => setIsNavOpen(false)} />
            </div>
            <div className="block px-3 py-2 rounded-md text-base font-medium">
              <NavElement label="Liquidity Pool" href="/liquiditypool" navigationStarts={() => setIsNavOpen(false)} />
            </div>
            <div className="block px-3 py-2 rounded-md text-base font-medium">
              <NavElement label="Dashboard" href="/dashboard" navigationStarts={() => setIsNavOpen(false)} />
            </div>
            <div className="block px-3 py-2 rounded-md text-base font-medium">
              <NavElement label="About" href="/about" navigationStarts={() => setIsNavOpen(false)} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};