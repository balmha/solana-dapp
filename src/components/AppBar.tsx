import { FC } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import React, { useState } from 'react';
import { useAutoConnect } from '../contexts/AutoConnectProvider';
import NetworkSwitcher from './NetworkSwitcher';
import NavElement from './nav-element';

const WalletMultiButtonDynamic = dynamic(
  async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
  { ssr: false }
);

export const AppBar: FC = () => {
  const { autoConnect, setAutoConnect } = useAutoConnect();
  const [isNavOpen, setIsNavOpen] = useState(false);

  return (
    <div className="z-10">
      {/* Vertical Sidebar for Desktop */}
      <div className="hidden md:flex fixed top-0 left-0 h-full w-48 bg-black bg-opacity-50 flex-col shadow-lg">
        {/* Logo */}
        <div className="p-4 flex items-center justify-center">
          <Link href="/" rel="noopener noreferrer" passHref>
            <h1 className="audiowide-text text-center md:pl-2 font-bold bg-clip-text text-white">SPLForge</h1>
          </Link>
        </div>

        {/* Nav Links */}
        <div className="flex flex-col p-4 space-y-4 items-center justify-center text-white text-sm">
          <NavElement label="Home" href="/" navigationStarts={() => setIsNavOpen(false)} />
          <NavElement label="Token Creator" href="/tokencreator" navigationStarts={() => setIsNavOpen(false)} />
          <NavElement label="Token Dashboard" href="/dashboard" navigationStarts={() => setIsNavOpen(false)} />
          <NavElement label="Liquidity Pool" href="/liquiditypool" navigationStarts={() => setIsNavOpen(false)} />
          <NavElement label="About Us" href="/about" navigationStarts={() => setIsNavOpen(false)} />
        </div>
      </div>

      {/* Horizontal Div for Connect & Settings */}
      <div className="md:flex fixed top-0 right-0 w-full md:w-[calc(100%-12rem)] h-14 bg-black bg-opacity-50 flex items-center justify-end shadow-lg z-10 px-4">
        {/* Wallet & Settings */}
        <div className="flex items-center gap-2">
          {/* Settings Dropdown */}
          <div className="dropdown dropdown-left">
            <div tabIndex={0} className="btn btn-square btn-ghost">
              <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <ul tabIndex={0} className="p-2 shadow menu dropdown-content bg-base-100 rounded-box w-52">
              <li>
                <div className="form-control bg-opacity-100">
                  <label className="cursor-pointer label">
                    <a>Autoconnect</a>
                    <input type="checkbox" checked={autoConnect} onChange={(e) => setAutoConnect(e.target.checked)} className="toggle" />
                  </label>
                  <NetworkSwitcher />
                </div>
              </li>
            </ul>
          </div>

          {/* Wallet Button */}
          <WalletMultiButtonDynamic className="h-8 inline-flex items-center justify-center px-4 py-2 text-sm font-medium bg-teal-500 text-white hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-colors btn-ghost rounded-btn" />
        </div>
      </div>

      {/* Hamburger Menu for Mobile */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button className="btn-ghost" onClick={() => setIsNavOpen(!isNavOpen)}>
          <div className="HAMBURGER-ICON space-y-2">
            <div className={`h-0.5 w-8 bg-purple-600 ${isNavOpen ? 'hidden' : ''}`} />
            <div className={`h-0.5 w-8 bg-purple-600 ${isNavOpen ? 'hidden' : ''}`} />
            <div className={`h-0.5 w-8 bg-purple-600 ${isNavOpen ? 'hidden' : ''}`} />
          </div>
          <div className={`absolute block h-0.5 w-8 animate-pulse bg-purple-600 ${isNavOpen ? "" : "hidden"}`} style={{ transform: "rotate(45deg)" }} />
          <div className={`absolute block h-0.5 w-8 animate-pulse bg-purple-600 ${isNavOpen ? "" : "hidden"}`} style={{ transform: "rotate(135deg)" }} />
        </button>
      </div>

      {/* Mobile Nav Drawer */}
      <div className={`md:hidden fixed top-0 left-0 h-full w-64 bg-black bg-opacity-100 flex flex-col shadow-lg transform transition-transform duration-300 ease-in-out ${isNavOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {/* Logo */}
        <div className="p-4 flex items-center justify-center">
          <Link href="/" rel="noopener noreferrer" passHref>
            <h1 className="audiowide-text text-center md:pl-2 font-bold bg-clip-text text-white">SPLForge</h1>
          </Link>
        </div>

        {/* Nav Links */}
        <div className="flex flex-col p-4 space-y-4 items-center justify-center text-white text-sm">
          <NavElement label="Home" href="/" navigationStarts={() => setIsNavOpen(false)} />
          <NavElement label="Token Creator" href="/tokencreator" navigationStarts={() => setIsNavOpen(false)} />
          <NavElement label="Token Dashboard" href="/dashboard" navigationStarts={() => setIsNavOpen(false)} />
          <NavElement label="Liquidity Pool" href="/liquiditypool" navigationStarts={() => setIsNavOpen(false)} />
          <NavElement label="About Us" href="/about" navigationStarts={() => setIsNavOpen(false)} />
        </div>
      </div>
    </div>
  );
};