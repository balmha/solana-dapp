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
      <div className="p-6 md:p-8 rounded-xl flex flex-col lg:flex-row gap-6">
        {/* Left Side: Token List */}
        <div className="w-full lg:w-1/2 bg-indigo-950/50 backdrop-blur-sm p-6 rounded-xl border border-indigo-800/30">
          <div className="flex flex-col gap-5">
            <h1 className="text-3xl font-bold">Token Dashboard</h1>
            <p className="text-base">
              View and manage all the SPL tokens you&lsquo;ve created with SPLForge.
            </p>
          </div>

          <div className="space-y-6 mt-6">
            {!publicKey ? (
              <div className="flex flex-col items-center justify-center gap-4">
                <p className="text-indigo-300">Please connect your wallet to view your tokens.</p>
                <WalletMultiButton className="bg-indigo-600 hover:bg-indigo-500 text-white py-2 px-4 rounded-lg transition-colors" />
              </div>
            ) : loading ? (
              <p className="text-indigo-300">Loading tokens...</p>
            ) : tokens.length === 0 ? (
              <p className="text-indigo-300">No tokens found.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full bg-slate-700/50 backdrop-blur-sm rounded-lg">
                  <thead>
                    <tr className="border-b border-indigo-800/30">
                      <th className="px-4 py-3 text-left text-indigo-300">Name</th>
                      <th className="px-4 py-3 text-left text-indigo-300">Symbol</th>
                      <th className="px-4 py-3 text-left text-indigo-300">Supply</th>
                      <th className="px-20 py-3 text-left text-indigo-300">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tokens.map((token, index) => (
                      <tr key={index} className="hover:bg-slate-700/30 transition-colors">
                        <td className="px-4 py-3 text-white">{token.name}</td>
                        <td className="px-4 py-3 text-indigo-300">{token.symbol}</td>
                        <td className="px-4 py-3 text-indigo-300">{token.supply}</td>
                        <td className="px-4 py-3">
                          <div className="flex gap-4">
                            <a
                              href={`https://explorer.solana.com/tx/${token.transactionSignature}?cluster=${token.network}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-indigo-400 hover:text-indigo-300 transition-colors"
                            >
                              Transaction
                            </a>
                            <a
                              href={`https://explorer.solana.com/address/${token.mint}?cluster=${token.network}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-indigo-400 hover:text-indigo-300 transition-colors whitespace-nowrap"
                            >
                              Token Address
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
        <div className="w-full lg:w-1/2 flex flex-col gap-5">
          <h1 className="text-xl font-bold">Your Tokens</h1>
          <p className="text-base">
            This dashboard lists all the SPL tokens you&lsquo;ve created using SPLForge. You can view
            details like the token name, symbol, total supply, and links to the transaction and
            token address on the Solana Explorer.
          </p>
          <br></br>
          <h2 className="text-xl font-bold">How to Use the Dashboard</h2>
          <p className="text-base">1. Connect your Solana wallet.</p>
          <p className="text-base">2. View your created tokens in the list.</p>
          <p className="text-base">3. Click on &ldquo;Transaction&rdquo; to view the creation transaction.</p>
          <p className="text-base">4. Click on &ldquo;Token Address&rdquo; to view the token details.</p>
        </div>
      </div>
    </div>
  );
};

export default TokenDashboard;