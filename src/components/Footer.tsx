import { FC } from 'react';
import Link from 'next/link';

export const Footer: FC = () => {
  return (
    <div className="flex flex-col w-full z-20 mt-auto">
      <footer className="border-t border-white/10 bg-black w-full py-8 text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">

            {/* Solana Section */}
            <div className="md:flex-1">
              <h5 className="font-semibold text-white tracking-wider uppercase mb-4 text-xs">SOLANA</h5>
              <div className="flex flex-col gap-2">
                <Link href="https://solana.com" target="_blank" rel="noopener noreferrer" passHref className="text-gray-400 hover:text-white">
                  Labs
                </Link>
                <Link href="https://explorer.solana.com/" target="_blank" rel="noopener noreferrer" passHref className="text-gray-400 hover:text-white">
                  Explorer
                </Link>
              </div>
            </div>

            {/* Tokens & Liquidity Section */}
            <div className="md:flex-1">
              <h5 className="font-semibold text-white tracking-wider uppercase mb-4 text-xs">TOKENS & LIQUIDITY</h5>
              <div className="flex flex-col gap-2">
                <Link href="https://spl.solana.com/token" target="_blank" rel="noopener noreferrer" passHref className="text-gray-400 hover:text-white">
                  SPL Tokens
                </Link>
                <Link href="https://docs.solana.com/developing/programming-model/liquidity-pools" target="_blank" rel="noopener noreferrer" passHref className="text-gray-400 hover:text-white">
                  Liquidity Pools
                </Link>
              </div>
            </div>

            {/* Ecosystem Section */}
            <div className="md:flex-1">
              <h5 className="font-semibold text-white tracking-wider uppercase mb-4 text-xs">ECOSYSTEM</h5>
              <div className="flex flex-col gap-2">
                <Link href="https://solana.com/news" target="_blank" rel="noopener noreferrer" passHref className="text-gray-400 hover:text-white">
                  News
                </Link>
                <Link href="https://solana.org/validators" target="_blank" rel="noopener noreferrer" passHref className="text-gray-400 hover:text-white">
                  Validators
                </Link>
              </div>
            </div>

            {/* Support Section */}
            <div className="md:flex-1">
              <h5 className="font-semibold text-white tracking-wider uppercase mb-4 text-xs">SUPPORT</h5>
              <div className="flex flex-col gap-2">
                <Link
                  href="mailto:support@splforge.xyz"
                  target="_blank"
                  rel="noopener noreferrer"
                  passHref
                  className="text-gray-400 hover:text-white flex items-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4 mr-2"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path
                      d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"
                    />
                  </svg>
                  Contact Us
                </Link>
              </div>
            </div>
          </div>

          {/* Bottom attribution */}
          <div className="mt-8 pt-8 border-t border-white/5 flex flex-col items-center gap-4">
            <Link href="https://twitter.com/splforge" target="_blank" rel="noopener noreferrer" passHref className="text-gray-400 hover:text-primary-focus transition-colors">
              <svg
                aria-hidden="true"
                focusable="true"
                className="w-5 h-5 mx-auto"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
              >
                <path
                  fill="currentColor"
                  d="M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z"
                />
              </svg>
            </Link>
            <div className="text-gray-400 tracking-wide">
              © 2026 SPLForge. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};