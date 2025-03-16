// LiquidityPool.tsx
import React from "react";
import Image from 'next/image';
import Link from 'next/link';

export const LiquidityPool = () => {
  return (
    <div className="w-full max-w-7xl px-4 md:px-8 flex flex-col md:flex-row items-center justify-center gap-8">
        {/* Logo Section */}
        <div className="flex justify-center">
          <Image
            src="/splforge-superlogo-nobackground.png"
            alt="SPLForge Logo"
            width={432}
            height={324}
            priority={true}
            className="object-contain w-full max-w-[300px] md:max-w-[432px]"
          />
        </div>

        {/* Text and Buttons Section */}
        <div className="flex flex-col items-center text-center">
          <h4 className="text-2xl md:text-4xl text-slate-300 my-2">
            <p className="sourcesans-text text-slate-300 font-semibold">
              &#128679; Website is under construction &#128679;
            </p>
            <br />
            <p className="sourcesans-text text-slate-300 text-2xl leading-relaxed">
              Liquidity Pool feature is coming soon...
            </p>
          </h4>
          <br />
          <div className="flex flex-col">
            <Link
              href="https://x.com/SPLForge"
              target="_blank"
              rel="noopener noreferrer"
              passHref
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded transition-colors flex items-center justify-center gap-2"
            >
              Follow us on Twitter for updates
              <svg
                aria-hidden="true"
                focusable="true"
                data-prefix="fab"
                data-icon="twitter"
                className="w-4 h-4"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
              >
                <path
                  fill="currentColor"
                  d="M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z"
                />
              </svg>
            </Link>
            {/*<Link
              href="/liquiditypool"
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded transition-colors"
            >
              Create Pool
            </Link> */}
          </div>
        </div>
      </div>
  );
};

export default LiquidityPool;