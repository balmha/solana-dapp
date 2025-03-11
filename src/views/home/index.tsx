// Next, React
import { FC, useEffect} from 'react';
import Link from 'next/link';
// Wallet
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
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
    <div className="md:hero mx-auto p-4 md:p-36 flex flex-col md:flex-row justify-center items-center">
      <div className="md:hero-content flex flex-col">
        <div className='mt-6'>
        <div className='text-sm font-normal align-bottom text-right text-white mt-4'>v{pkg.version}</div>
        <h1 className="audiowide-text text-center text-5xl md:pl-12 font-bold bg-clip-text text-white mb-4">
          SPLForge
        </h1>
        
        </div>
        <h4 className="md:w-full text-2x1 md:text-4xl text-center text-slate-300 my-2">
          <p className='sourcesans-text text-slate-300 font-semibold'>Create and Manage Tokens on Solana.</p><br></br>
          <p className='sourcesans-text text-slate-300 text-2x1 leading-relaxed'>Easily create SPL tokens and liquidity pools with SPLForge.</p>
        </h4>
        <br></br>
        <div className="space-x-4">
          <Link
            href="/tokencreator"
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded"
          >
            Create Token
          </Link>
          <Link
            href="/liquiditypool"
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded"
          >
            Create Pool
          </Link>
        </div>
      </div>
    </div>
  );
};