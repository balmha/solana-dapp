import React, { useState } from "react";
import UploadFile from "./UploadFile";
import { createToken } from "../utils/createToken";
import { useWallet } from "@solana/wallet-adapter-react";
import { useNetworkConfiguration } from '../contexts/NetworkConfigurationProvider';
import { dynamoDB } from "../utils/tokentable";

export const TokenCreator = () => {
  const { networkConfiguration } = useNetworkConfiguration();
  const { connected, publicKey, signTransaction } = useWallet();
  const [toggleEnabled, setToggleEnabled] = useState(false);
  const [showMintInfo, setMintInfo] = useState(false);
  const [showFreezeInfo, setFreezeInfo] = useState(false);
  const [showMoreOptions, setShowMoreOptions] = useState(false);

  // State for form inputs
  const [tokenName, setTokenName] = useState("");
  const [tokenSymbol, setTokenSymbol] = useState("");
  const [tokenDecimals, setTokenDecimals] = useState(""); // No default value
  const [tokenSupply, setTokenSupply] = useState(""); // No default value
  const [tokenImage, setTokenImage] = useState("");
  const [tokenDescription, setTokenDescription] = useState("");
  const [telegramLink, setTelegramLink] = useState("");
  const [websiteLink, setWebsiteLink] = useState("");
  const [twitterLink, setTwitterLink] = useState("");
  const [resetImage, setResetImage] = useState(false);

  // State for validation errors
  const [tokenNameError, setTokenNameError] = useState("");
  const [tokenSymbolError, setTokenSymbolError] = useState("");
  const [tokenDecimalsError, setTokenDecimalsError] = useState("");
  const [tokenSupplyError, setTokenSupplyError] = useState("");
  const [telegramLinkError, setTelegramLinkError] = useState("");
  const [websiteLinkError, setWebsiteLinkError] = useState("");
  const [twitterLinkError, setTwitterLinkError] = useState("");
  const [tokenDescriptionError, setTokenDescriptionError] = useState("");

  // Constants
  const MAX_DESCRIPTION_LENGTH = 500;

  // Regex validation functions
  const validateTelegramLink = (link: string) => {
    const telegramRegex = /^https:\/\/t\.me\/[a-zA-Z0-9_]+$/;
    return telegramRegex.test(link);
  };

  const validateWebsiteLink = (link: string) => {
    const websiteRegex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
    return websiteRegex.test(link);
  };

  const validateTwitterLink = (link: string) => {
    const twitterRegex = /^https:\/\/(twitter\.com|x\.com)\/[a-zA-Z0-9_]+$/;
    return twitterRegex.test(link);
  };

  // Handle input changes with validation
  const handleTokenNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTokenName(value);
    setTokenNameError(value ? "" : "Token name is required.");
  };

  const handleTokenSymbolChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
  
    // Validate symbol
    if (!value) {
      setTokenSymbolError("Token symbol is required.");
    } else if (value.length > 8) {
      setTokenSymbolError("Token symbol must be 8 characters or less.");
    } else {
      setTokenSymbolError("");
    }
  
    // Update the state with the new value
    setTokenSymbol(value);
  };

  const handleTokenDecimalsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTokenDecimals(value);
    setTokenDecimalsError(value ? (Number(value) >= 1 && Number(value) <= 9 ? "" : "Decimals must be between 1 and 9.") : "");
  };

  const handleTokenSupplyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTokenSupply(value);
    setTokenSupplyError(value ? (Number(value) >= 1 ? "" : "Supply must be at least 1.") : "");
  };

  const handleTelegramLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTelegramLink(value);
  };

  const handleWebsiteLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setWebsiteLink(value);
  };

  const handleTwitterLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTwitterLink(value);
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= MAX_DESCRIPTION_LENGTH) {
      setTokenDescription(value);
      setTokenDescriptionError("");
    } else {
      setTokenDescriptionError(`Description must be ${MAX_DESCRIPTION_LENGTH} characters or less.`);
    }
  };

  // Handle blur events for optional links
  const handleTelegramLinkBlur = () => {
    if (telegramLink) {
      const fullUrl = telegramLink.startsWith("https://") ? telegramLink : `https://${telegramLink}`;
      setTelegramLink(fullUrl);
      setTelegramLinkError(validateTelegramLink(fullUrl) ? "" : "Invalid Telegram link.");
    } else {
      setTelegramLinkError("");
    }
  };

  const handleWebsiteLinkBlur = () => {
    if (websiteLink) {
      const fullUrl = websiteLink.startsWith("https://") ? websiteLink : `https://${websiteLink}`;
      setWebsiteLink(fullUrl);
      setWebsiteLinkError(validateWebsiteLink(fullUrl) ? "" : "Invalid website link.");
    } else {
      setWebsiteLinkError("");
    }
  };

  const handleTwitterLinkBlur = () => {
    if (twitterLink) {
      const fullUrl = twitterLink.startsWith("https://") ? twitterLink : `https://${twitterLink}`;
      setTwitterLink(fullUrl);
      setTwitterLinkError(validateTwitterLink(fullUrl) ? "" : "Invalid X (Twitter) link.");
    } else {
      setTwitterLinkError("");
    }
  };

  // Function to reset the form
  const resetForm = () => {
    setTokenName("");
    setTokenSymbol("");
    setTokenDecimals(""); // Reset to empty string
    setTokenImage("");
    setTokenDescription("");
    setTokenSupply(""); // Reset to empty string
    setTelegramLink("");
    setWebsiteLink("");
    setTwitterLink("");
    setToggleEnabled(false);
    setResetImage(true);
    setTimeout(() => setResetImage(false), 100);

    // Reset validation errors
    setTokenNameError("");
    setTokenSymbolError("");
    setTokenDecimalsError("");
    setTokenSupplyError("");
    setTelegramLinkError("");
    setWebsiteLinkError("");
    setTwitterLinkError("");
    setTokenDescriptionError("");
  };

  const storeToken = async (creator, mint, name, symbol, supply, transactionSignature, network) => {
    const params = {
      TableName: "Tokens",
      Item: {
        creator,
        mint,
        name,
        symbol,
        supply,
        transactionSignature,
        network,
      },
    };
  
    try {
      await dynamoDB.put(params).promise();
      console.log("Token stored successfully!");
    } catch (error) {
      console.error("Error storing token:", error);
    }
  };

  // Handle Create Token button click
  const handleCreateToken = async () => {
    if (!connected || !publicKey) {
      alert("Please connect your wallet");
      return;
    }

    // Validate form inputs
    let isValid = true;
    if (!tokenName) {
      setTokenNameError("Token name is required.");
      isValid = false;
    }
    if (!tokenSymbol) {
      setTokenSymbolError("Token symbol is required.");
      isValid = false;
    }
    if (!tokenDecimals || Number(tokenDecimals) < 1 || Number(tokenDecimals) > 9) {
      setTokenDecimalsError("Decimals must be between 1 and 9.");
      isValid = false;
    }
    if (!tokenSupply || Number(tokenSupply) < 1) {
      setTokenSupplyError("Supply must be at least 1.");
      isValid = false;
    }
    if (telegramLink && !validateTelegramLink(telegramLink)) {
      setTelegramLinkError("Invalid Telegram link.");
      isValid = false;
    }
    if (websiteLink && !validateWebsiteLink(websiteLink)) {
      setWebsiteLinkError("Invalid website link.");
      isValid = false;
    }
    if (twitterLink && !validateTwitterLink(twitterLink)) {
      setTwitterLinkError("Invalid X (Twitter) link.");
      isValid = false;
    }
    if (tokenDescription.length > MAX_DESCRIPTION_LENGTH) {
      setTokenDescriptionError(`Description must be ${MAX_DESCRIPTION_LENGTH} characters or less.`);
      isValid = false;
    }

    if (!isValid) {
      return;
    }

    // Call the createToken function
    const result = await createToken(
      networkConfiguration,
      publicKey,
      signTransaction,
      tokenName,
      tokenSymbol,
      tokenImage,
      tokenDescription,
      Number(tokenDecimals), // Convert to number
      Number(tokenSupply), // Convert to number
      toggleEnabled,
      websiteLink,
      twitterLink,
      telegramLink
    );

    // Handle the result
    if (result.success) {
      alert(`Token created successfully - See your transaction in: https://explorer.solana.com/tx/${result.transactionSignature}?cluster=${result.networkConfiguration}`);
      await storeToken(publicKey.toBase58(),result.mintAddress,tokenName,tokenSymbol,tokenSupply,result.transactionSignature,result.networkConfiguration);
      resetForm();
    } else {
      alert(`Token creation failed: ${result.message}`);
      resetForm();
    }
  };

  return (
    <div id="webcrumbs">
      <div className="p-6 md:p-8 rounded-xl flex flex-col lg:flex-row gap-6">
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
                  onChange={handleTokenNameChange}
                />
                {tokenNameError && <p className="text-red-500 text-sm mt-1">{tokenNameError}</p>}
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
                  onChange={handleTokenSymbolChange}
                />
                {tokenSymbolError && <p className="text-red-500 text-sm mt-1">{tokenSymbolError}</p>}
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
                  onChange={handleTokenDecimalsChange}
                  min="1"
                  max="9"
                  step="1"
                />
                {tokenDecimalsError && <p className="text-red-500 text-sm mt-1">{tokenDecimalsError}</p>}
              </div>

              <div className="relative">
                <div className="flex justify-between items-center bg-indigo-900/50 border border-indigo-700/30 rounded-t-lg px-3 py-1">
                  <span className="text-indigo-300 text-sm">Supply</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setTokenSupply("21000000")}
                      className="text-indigo-400 text-sm hover:text-white transition-colors"
                    >
                      Recommended
                    </button>
                  </div>
                </div>
                <input
                  type="number"
                  placeholder="Enter total supply"
                  className="w-full bg-slate-700 px-4 py-3 rounded-b-lg text-white placeholder-gray-400 hover:bg-slate-600 transition-colors"
                  value={tokenSupply}
                  onChange={handleTokenSupplyChange}
                  min="1"
                  step="1"
                />
                {tokenSupplyError && <p className="text-red-500 text-sm mt-1">{tokenSupplyError}</p>}
              </div>
            </div>

            {/* Token Image Upload */}
            <div className="relative">
              <div className="flex justify-between items-center bg-indigo-900/50 border border-indigo-700/30 rounded-t-lg px-3 py-1">
                <span className="text-indigo-300 text-sm">Image</span>
              </div>
              <div className="w-full bg-slate-700 px-4 py-2 rounded-b-lg text-white placeholder-gray-400 hover:bg-slate-600 transition-colors">
                <div className="w-full h-24 flex items-center justify-center rounded-lg border-2 border-dashed border-indigo-700/30 cursor-pointer">
                  <UploadFile onFileUpload={(url) => setTokenImage(url)} resetImage={resetImage} />
                </div>
              </div>
            </div>

            {/* Description Textarea */}
            <div className="relative">
              <div className="flex justify-between items-center bg-indigo-900/50 border border-indigo-700/30 rounded-t-lg px-3 py-1">
                <span className="text-indigo-300 text-sm">Description</span>
                <span className="text-indigo-400 text-sm">
                  {tokenDescription.length}/{MAX_DESCRIPTION_LENGTH}
                </span>
              </div>
              <textarea
                placeholder="Enter token description"
                className="w-full bg-slate-700 px-4 py-2 rounded-b-lg text-white placeholder-gray-400 hover:bg-slate-600 transition-colors"
                rows={4}
                value={tokenDescription}
                onChange={handleDescriptionChange}
              />
              {tokenDescriptionError && <p className="text-red-500 text-sm mt-1">{tokenDescriptionError}</p>}
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

            {/* Show More Options Button */}
            <div className="flex justify-start">
              <button
                className="flex items-center text-indigo-400 hover:text-indigo-300 transition-colors"
                onClick={() => setShowMoreOptions(!showMoreOptions)}
              >
                <span className="mr-2">Show more options</span>
                <span className="material-symbols-outlined">
                  {showMoreOptions ? "arrow_drop_up" : "arrow_drop_down"}
                </span>
              </button>
            </div>

            {/* Optional Fields (Telegram, Website, X) */}
            {showMoreOptions && (
              <div className="space-y-4">
                {/* Telegram Link */}
                <div className="relative">
                  <div className="flex justify-between items-center bg-indigo-900/50 border border-indigo-700/30 rounded-t-lg px-3 py-1">
                    <span className="text-indigo-300 text-sm">Telegram Link</span>
                  </div>
                  <div className="flex items-center bg-slate-700 px-4 py-3 rounded-b-lg text-white placeholder-gray-400 hover:bg-slate-600 transition-colors">
                    <span className="text-gray-400">https://</span>
                    <input
                      type="text"
                      placeholder="t.me/username"
                      className="w-full bg-transparent outline-none"
                      value={telegramLink.replace("https://", "")}
                      onChange={handleTelegramLinkChange}
                      onBlur={handleTelegramLinkBlur}
                    />
                  </div>
                  {telegramLinkError && <p className="text-red-500 text-sm mt-1">{telegramLinkError}</p>}
                </div>

                {/* Website Link */}
                <div className="relative">
                  <div className="flex justify-between items-center bg-indigo-900/50 border border-indigo-700/30 rounded-t-lg px-3 py-1">
                    <span className="text-indigo-300 text-sm">Website Link</span>
                  </div>
                  <div className="flex items-center bg-slate-700 px-4 py-3 rounded-b-lg text-white placeholder-gray-400 hover:bg-slate-600 transition-colors">
                    <span className="text-gray-400">https://</span>
                    <input
                      type="text"
                      placeholder="example.com"
                      className="w-full bg-transparent outline-none"
                      value={websiteLink.replace("https://", "")}
                      onChange={handleWebsiteLinkChange}
                      onBlur={handleWebsiteLinkBlur}
                    />
                  </div>
                  {websiteLinkError && <p className="text-red-500 text-sm mt-1">{websiteLinkError}</p>}
                </div>

                {/* X (Twitter) Link */}
                <div className="relative">
                  <div className="flex justify-between items-center bg-indigo-900/50 border border-indigo-700/30 rounded-t-lg px-3 py-1">
                    <span className="text-indigo-300 text-sm">X (Twitter) Link</span>
                  </div>
                  <div className="flex items-center bg-slate-700 px-4 py-3 rounded-b-lg text-white placeholder-gray-400 hover:bg-slate-600 transition-colors">
                    <span className="text-gray-400">https://</span>
                    <input
                      type="text"
                      placeholder="twitter.com/username"
                      className="w-full bg-transparent outline-none"
                      value={twitterLink.replace("https://", "")}
                      onChange={handleTwitterLinkChange}
                      onBlur={handleTwitterLinkBlur}
                    />
                  </div>
                  {twitterLinkError && <p className="text-red-500 text-sm mt-1">{twitterLinkError}</p>}
                </div>
              </div>
            )}
            <br></br>

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
          <p className="text-base">The SPLForge&lsquo;s fee for Token creation is 0.2 SOL, not covering fees for SPL Token Creation.</p>
          <br></br>
          <h2 className="text-xl font-bold">Revoke Freeze Authority:</h2>
          <p className="text-base text-indigo-300">If you want to create a liquidity pool you will need to &lsquo;Revoke Freeze Authority&rsquo; of the Token - Required.</p>
          <h2 className="text-xl font-bold">Revoke Mint Authority:</h2>
          <p className="text-base text-indigo-300">Revoking mint authority ensures that there can be no more tokens minted than the total supply. This provides security and peace of mind to buyers. The cost is 0.1 SOL</p>
          <br></br>
          <p className="text-base">Once the creation process starts, it will only take a few seconds! Once complete, you will receive the total supply of the token in your wallet.</p>
          <p className="text-base">With our user-friendly platform, managing your tokens is simple and affordable.</p>
        </div>
      </div>
    </div>
  );
};

export default TokenCreator;