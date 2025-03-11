import React, { useState } from "react";
import UploadFile from "./UploadFile";
import { createToken } from "../utils/createToken";
import { useWallet } from "@solana/wallet-adapter-react";

export const TokenCreator = () => {
  const { connected, publicKey, signTransaction } = useWallet();
  const [toggleEnabled, setToggleEnabled] = useState(false);
  const [showMintInfo, setMintInfo] = useState(false);
  const [showFreezeInfo, setFreezeInfo] = useState(false);

  // State for form inputs
  const [tokenName, setTokenName] = useState("");
  const [tokenSymbol, setTokenSymbol] = useState("");
  const [tokenDecimals, setTokenDecimals] = useState(6); // Default to 6 decimals
  const [tokenSupply, setTokenSupply] = useState("");
  const [tokenImage, setTokenImage] = useState(""); // Store the uploaded image URL
  const [tokenDescription, setTokenDescription] = useState("");

  // Handle 50% button click
  const handleFiftyPercent = () => {
    const numericValue = parseFloat(tokenSupply); // Convert input value to a number
    if (!isNaN(numericValue)) {
      setTokenSupply((numericValue / 2).toString()); // Divide by 2 and update the state
    }
  };

  // Handle Create Token button click
  const handleCreateToken = async () => {
    if (!connected || !publicKey) {
      alert("Please connect your wallet");
      return;
    }

    // Validate form inputs
    if (!tokenName || !tokenSymbol || !tokenDecimals || !tokenSupply) {
      alert("Please fill out all required fields");
      return;
    }

    // Call the createToken function
    const result = await createToken(
      publicKey, // Wallet object
      signTransaction, // Sign transaction function
      tokenName,
      tokenSymbol,
      tokenImage,
      tokenDescription,
      tokenDecimals,
      parseFloat(tokenSupply),
      toggleEnabled // Revoke Mint Authority
    );

    // Handle the result
    if (result.success) {
      alert(`Token created successfully!\nMint Public Key: ${result.mintPublicKey}\nTransaction Signature: ${result.transactionSignature}`);
    } else {
      alert(`Token creation failed: ${result.message}`);
    }
  };

  return (
    <div id="webcrumbs">
      <div className="bg-gradient-to-br from-indigo-950 via-purple-900 to-indigo-950 p-6 md:p-8 rounded-xl flex flex-col lg:flex-row gap-6">
        {/* Left Side: Form */}
        <div className="w-full lg:w-1/2 bg-indigo-950/50 backdrop-blur-sm p-6 rounded-xl border border-indigo-800/30">
          <div className="flex flex-col gap-5">
            <h1 className="text-3xl font-bold">Solana Token Creator</h1>
            <p className="text-base">
              The perfect tool to create Solana SPL tokens.
              <br />
              Simple, user friendly, and fast.
            </p>
          </div>

          <div className="space-y-6 mt-6">
            {/* Name and Symbol Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <div className="flex justify-between items-center bg-indigo-900/50 border border-indigo-700/30 rounded-t-lg px-3 py-1">
                  <span className="text-indigo-300 text-sm">Name</span>
                </div>
                <input
                  type="text"
                  placeholder="Enter token name"
                  className="w-full bg-slate-700 px-4 py-3 rounded-b-lg text-white placeholder-gray-400 hover:bg-slate-600 transition-colors"
                  value={tokenName}
                  onChange={(e) => setTokenName(e.target.value)}
                />
              </div>

              <div className="relative">
                <div className="flex justify-between items-center bg-indigo-900/50 border border-indigo-700/30 rounded-t-lg px-3 py-1">
                  <span className="text-indigo-300 text-sm">Symbol</span>
                </div>
                <input
                  type="text"
                  placeholder="Enter token symbol"
                  className="w-full bg-slate-700 px-4 py-3 rounded-b-lg text-white placeholder-gray-400 hover:bg-slate-600 transition-colors"
                  value={tokenSymbol}
                  onChange={(e) => setTokenSymbol(e.target.value)}
                />
              </div>
            </div>

            {/* Decimals and Supply Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <div className="flex justify-between items-center bg-indigo-900/50 border border-indigo-700/30 rounded-t-lg px-3 py-1">
                  <span className="text-indigo-300 text-sm">Decimals</span>
                </div>
                <input
                  type="number"
                  placeholder="Enter decimals (e.g., 6)"
                  className="w-full bg-slate-700 px-4 py-3 rounded-b-lg text-white placeholder-gray-400 hover:bg-slate-600 transition-colors"
                  value={tokenDecimals}
                  onChange={(e) => setTokenDecimals(parseInt(e.target.value))}
                  min="0"
                  max="9"
                />
              </div>

              <div className="relative">
                <div className="flex justify-between items-center bg-indigo-900/50 border border-indigo-700/30 rounded-t-lg px-3 py-1">
                  <span className="text-indigo-300 text-sm">Supply</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleFiftyPercent}
                      className="text-indigo-400 text-sm hover:text-white transition-colors"
                    >
                      50%
                    </button>
                    <button
                      onClick={() => setTokenSupply("21000000")}
                      className="text-indigo-400 text-sm hover:text-white transition-colors"
                    >
                      Max
                    </button>
                  </div>
                </div>
                <input
                  type="number"
                  placeholder="Enter total supply"
                  className="w-full bg-slate-700 px-4 py-3 rounded-b-lg text-white placeholder-gray-400 hover:bg-slate-600 transition-colors"
                  value={tokenSupply}
                  onChange={(e) => setTokenSupply(e.target.value)}
                />
              </div>
            </div>

            {/* Token Image Upload */}
            <div className="relative">
              <div className="flex justify-between items-center bg-indigo-900/50 border border-indigo-700/30 rounded-t-lg px-3 py-1">
                <span className="text-indigo-300 text-sm">Image</span>
              </div>
              <div className="w-full bg-slate-700 px-4 py-2 rounded-b-lg text-white placeholder-gray-400 hover:bg-slate-600 transition-colors">
                <div className="w-full h-24 flex items-center justify-center rounded-lg border-2 border-dashed border-indigo-700/30 cursor-pointer">
                  <UploadFile onFileUpload={(url) => setTokenImage(url)} />
                </div>
              </div>
            </div>

            {/* Description Textarea */}
            <div className="relative">
              <div className="flex justify-between items-center bg-indigo-900/50 border border-indigo-700/30 rounded-t-lg px-3 py-1">
                <span className="text-indigo-300 text-sm">Description</span>
              </div>
              <textarea
                placeholder="Enter token description"
                className="w-full bg-slate-700 px-4 py-2 rounded-b-lg text-white placeholder-gray-400 hover:bg-slate-600 transition-colors"
                rows={4}
                value={tokenDescription}
                onChange={(e) => setTokenDescription(e.target.value)}
              />
            </div>

            {/* Revoke Freeze Authority */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-indigo-300 text-sm">Revoke Freeze Authority (Required)</span>
                <span
                  className="material-symbols-outlined text-indigo-400 text-lg cursor-pointer"
                  onClick={() => setFreezeInfo(true)}
                >
                  info
                </span>
                {showFreezeInfo && (
                  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-indigo-900/90 p-6 rounded-lg max-w-sm text-indigo-300 text-sm relative">
                      <button
                        className="absolute top-2 right-2 text-indigo-400 hover:text-indigo-200"
                        onClick={() => setFreezeInfo(false)}
                      >
                        <span className="material-symbols-outlined">close</span>
                      </button>
                      <p>
                        (REQUIRED)<br></br>Revoke Freeze allows you to create a liquidity pool.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Revoke Mint Authority */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-indigo-300 text-sm">Revoke Mint Authority</span>
                <span
                  className="material-symbols-outlined text-indigo-400 text-lg cursor-pointer"
                  onClick={() => setMintInfo(true)}
                >
                  info
                </span>
                {showMintInfo && (
                  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-indigo-900/90 p-6 rounded-lg max-w-sm text-indigo-300 text-sm relative">
                      <button
                        className="absolute top-2 right-2 text-indigo-400 hover:text-indigo-200"
                        onClick={() => setMintInfo(false)}
                      >
                        <span className="material-symbols-outlined">close</span>
                      </button>
                      <p>
                        Mint Authority allows you to increase tokens supply.
                      </p>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  className={`w-10 h-6 rounded-full transition-colors ${
                    toggleEnabled ? "bg-green-500" : "bg-gray-500"
                  }`}
                  onClick={() => setToggleEnabled(!toggleEnabled)}
                >
                  <div
                    className={`w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform ${
                      toggleEnabled ? "translate-x-6" : "translate-x-0"
                    }`}
                  />
                </button>
                <span className="text-indigo-400 text-sm">(0.1 SOL)</span>
              </div>
            </div>

            {/* Create Token Button */}
            <button
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-lg transition-colors"
              onClick={handleCreateToken}
              disabled={!signTransaction}
            >
              Create Token
            </button>
          </div>
        </div>

        {/* Right Side: Instructions */}
        <div className="w-full lg:w-1/2 flex flex-col gap-5">
          <h1 className="text-xl font-bold">Create Solana Token</h1>
          <p className="text-base">Effortlessly create your Solana SPL Token with our simple process – no coding required.</p>
          <p className="text-base">Customize your Solana Token exactly the way you envision it. Less than 5 minutes, at an affordable cost.</p>
          <br></br>
          <h2 className="text-xl font-bold">How to use Solana Token Creator</h2>
          <p className="text-base">1. Connect your Solana wallet.</p>
          <p className="text-base">2. Specify the desired name for your Token</p>
          <p className="text-base">3. Indicate the symbol (max 8 characters).</p>
          <p className="text-base">4. Select the decimals quantity (default recommended 6 for all tokens)</p>
          <p className="text-base">5. Determine the Supply of your Token.</p>
          <p className="text-base">6. Upload the image for your token (PNG). - Optional</p>
          <p className="text-base">7. Provide a brief description for your SPL Token. - Optional</p>
          <p className="text-base">8. Click on create, accept the transaction and wait until your tokens ready.</p>
          <p className="text-base">The Pear Tool's fee for Token creation is 0.1 SOL, not covering fees for SPL Token Creation.</p>
          <br></br>
          <h2 className="text-xl font-bold">Revoke Freeze Authority:</h2>
          <p className="text-base text-indigo-300">If you want to create a liquidity pool you will need to "Revoke Freeze Authority" of the Token - Required.</p>
          <h2 className="text-xl font-bold">Revoke Mint Authority:</h2>
          <p className="text-base text-indigo-300">Revoking mint authority ensures that there can be no more tokens minted than the total supply. This provides security and peace of mind to buyers. The cost is 0.1 SOL</p>
          <br></br>
          <p className="text-base">Once the creation process starts, it will only take a few seconds! Once complete, you will receive the total supply of the token in your wallet.</p>
          <p className="text-base">With our user-friendly platform, managing your tokens is simple and affordable.</p>
          <p className="text-base">You can choose to revoke mint authority later if you choose</p>
        </div>
      </div>
    </div>
  );
};

export default TokenCreator;