import React, { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { dynamoDB } from "../utils/tokentable";

export const TokenDashboard = () => {
  const { publicKey } = useWallet();
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(true);

  // External function to fetch tokens from DynamoDB
  const fetchTokens = async (creator) => {
    const params = {
      TableName: "Tokens",
      KeyConditionExpression: "creator = :creator",
      ExpressionAttributeValues: {
        ":creator": creator,
      },
    };

    try {
      const data = await dynamoDB.query(params).promise();
      return data.Items;
    } catch (error) {
      console.error("Error fetching tokens:", error);
      return [];
    }
  };

  // Inside your component
  useEffect(() => {
    const fetchTokensForDashboard = async () => {
      if (!publicKey) {
        setTokens([]); // Reset tokens if no wallet is connected
        setLoading(false);
        return;
      }

      try {
        const tokens = await fetchTokens(publicKey.toBase58()); // Use the external function
        setTokens(tokens);
      } catch (error) {
        console.error("Error fetching tokens:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTokensForDashboard(); // Call the renamed function
  }, [publicKey]);

  return (
    <div id="webcrumbs">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Side: Token List */}
        <div className="w-full lg:w-[60%] bg-neutral/60 backdrop-blur-xl p-8 rounded-2xl border border-white/10 shadow-2xl">
          <div className="flex flex-col gap-3 mb-8">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">Token Dashboard</h1>
            <p className="text-gray-400 text-sm">
              View and manage all the SPL tokens you&lsquo;ve created with SPLForge.
            </p>
          </div>

          <div className="space-y-6">
            {!publicKey ? (
              <div className="flex flex-col items-center justify-center gap-5 bg-black/30 border border-white/5 p-10 rounded-xl">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-2">
                  <span className="material-symbols-outlined text-3xl text-gray-500">account_balance_wallet</span>
                </div>
                <p className="text-gray-300 font-medium">Please connect your wallet to view your tokens.</p>
                <div className="mt-2">
                  <WalletMultiButton className="bg-gradient-to-r from-purple-600 to-primary text-white hover:from-purple-500 hover:to-primary-focus py-2 px-6 rounded-lg transition-colors font-bold shadow-[0_0_15px_rgba(153,69,255,0.3)]" />
                </div>
              </div>
            ) : loading ? (
              <div className="flex flex-col items-center justify-center gap-4 bg-black/30 border border-white/5 p-10 rounded-xl">
                <svg className="animate-spin h-8 w-8 text-primary-focus" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="text-gray-400 font-medium">Loading your tokens...</p>
              </div>
            ) : tokens.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-4 bg-black/30 border border-white/5 p-10 rounded-xl">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-2">
                  <span className="material-symbols-outlined text-3xl text-gray-500">token</span>
                </div>
                <p className="text-gray-300 font-medium">No tokens found.</p>
                <p className="text-gray-500 text-sm text-center">You haven&lsquo;t created any SPL tokens yet with this wallet.</p>
                <a href="/tokencreator" className="mt-4 px-6 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white font-medium transition-all focus:outline-none">
                  Create a Token
                </a>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-white/5 bg-black/30">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-black/50 text-gray-400 font-medium tracking-wider uppercase text-[10px]">
                    <tr>
                      <th className="px-6 py-4">Name</th>
                      <th className="px-6 py-4">Symbol</th>
                      <th className="px-6 py-4">Supply</th>
                      <th className="px-6 py-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {tokens.map((token, index) => (
                      <tr key={index} className="hover:bg-white/5 transition-colors group">
                        <td className="px-6 py-4 text-white font-medium">{token.name}</td>
                        <td className="px-6 py-4 text-gray-400">
                          <span className="bg-white/5 border border-white/10 px-2 py-1 rounded text-xs font-mono">{token.symbol}</span>
                        </td>
                        <td className="px-6 py-4 text-gray-300">{Intl.NumberFormat('en-US').format(token.supply)}</td>
                        <td className="px-6 py-4">
                          <div className="flex gap-3 justify-center">
                            <a
                              href={`https://explorer.solana.com/tx/${token.transactionSignature}?cluster=${token.network}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 hover:text-primary-focus transition-all text-gray-400 border border-transparent hover:border-white/10"
                              title="View Transaction"
                            >
                              <span className="material-symbols-outlined text-[18px]">receipt_long</span>
                            </a>
                            <a
                              href={`https://explorer.solana.com/address/${token.mint}?cluster=${token.network}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 hover:text-primary-focus transition-all text-gray-400 border border-transparent hover:border-white/10"
                              title="View Token on Explorer"
                            >
                              <span className="material-symbols-outlined text-[18px]">open_in_new</span>
                            </a>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Instructions */}
        <div className="w-full lg:w-[40%] flex flex-col gap-6 lg:pl-6 text-gray-300">
          <div>
            <h2 className="text-xl font-bold text-white mb-2">Your Tokens</h2>
            <p className="text-sm leading-relaxed text-gray-400">
              This dashboard lists all the SPL tokens you&lsquo;ve created using SPLForge. You can view
              details like the token name, symbol, total supply, and direct links to the transaction and
              token address on the Solana Explorer.
            </p>
          </div>

          <div className="bg-black/30 border border-white/5 rounded-xl p-6">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center"><span className="material-symbols-outlined mr-2 text-primary-focus">list_alt</span>How to Use the Dashboard</h2>
            <ul className="space-y-3 text-sm text-gray-400 list-decimal pl-5 marker:text-primary-focus">
              <li className="leading-relaxed">Connect your Solana wallet in the top right.</li>
              <li className="leading-relaxed">View your created tokens in the list.</li>
              <li className="leading-relaxed">Click on <span className="material-symbols-outlined text-[14px] align-middle px-1">receipt_long</span> to view the creation transaction.</li>
              <li className="leading-relaxed">Click on <span className="material-symbols-outlined text-[14px] align-middle px-1">open_in_new</span> to view the token details.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TokenDashboard;