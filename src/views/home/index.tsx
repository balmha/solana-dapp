// Next, React
import { FC, useEffect, useState, useCallback } from 'react';
import Link from 'next/link';

// Wallet
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

import pkg from '../../../package.json';

// Store
import useUserSOLBalanceStore from '../../stores/useUserSOLBalanceStore';

export const HomeView: FC = ({ }) => {
  const wallet = useWallet();
  const { connection } = useConnection();

  const balance = useUserSOLBalanceStore((s) => s.balance)
  const { getUserSOLBalance } = useUserSOLBalanceStore()

  //Create a function called downloadApp which downloads a wallet app from the remote server https://peerwallet.com
  const downloadApp = () => {
    window.location.href = 'https://pearwallet.com'
  }

  useEffect(() => {
    if (wallet.publicKey) {
      console.log(wallet.publicKey.toBase58())
      getUserSOLBalance(wallet.publicKey, connection)
    }
  }, [wallet.publicKey, connection, getUserSOLBalance])

  return (

    <div className="md:hero mx-auto p-4">
      <div className="md:hero-content flex flex-col">
        <div className='mt-6'>
        <div className='text-sm font-normal align-bottom text-right text-slate-900 mt-4'>v{pkg.version}</div>
        <h1 className="text-center text-5xl md:pl-12 font-bold bg-clip-text text-black mb-4">
          Pear Tools
        </h1>
        </div>
        <h4 className="md:w-full text-2x1 md:text-4xl text-center text-slate-300 my-2">
          <p className='text-slate-900 font-semibold'>Create and Manage Tokens on Solana.</p><br></br>
          <p className='text-slate-700 text-2x1 leading-relaxed'>Easily create SPL tokens and liquidity pools with Pear Tools.</p>
        </h4>
        <br></br>
        <div className="space-x-4">
          <Link
            href="/tokencreator"
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-3 px-6 rounded"
          >
            Create Token
          </Link>
          <Link
            href="/liquiditypool"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded"
          >
            Create Pool
          </Link>
        </div>
        {/* <div className="flex flex-col mt-2">
          <div className="flex flex-row justify-center">
                  <div className="relative group items-center">
                      <div className="m-1 absolute -inset-0.5 rounded-lg blur opacity-20 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
              
                          <button
                              className="px-8 m-2 btn animate-pulse bg-gradient-to-br from-green-500 to-yellow-500 hover:from-white hover:to-purple-300 text-black"
                              onClick={downloadApp}
                              >
                                  <span>Download Wallet App</span>
                  
                          </button>
                  </div>
          </div>
        </div> */}
      </div>
    </div>
  );
};
