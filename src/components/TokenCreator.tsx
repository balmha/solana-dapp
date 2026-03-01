// TokenCreator.tsx
import React, { useState } from "react";
import UploadFile from "./UploadFile";
import { createToken } from "../utils/createToken";
import { useWallet } from "@solana/wallet-adapter-react";
import { useNetworkConfiguration } from '../contexts/NetworkConfigurationProvider';
import { dynamoDB } from "../utils/tokentable";
import toast from "react-hot-toast";
import { tokenCreatorInstructions } from "../content/instructions";

export const TokenCreator = () => {

  const { networkConfiguration } = useNetworkConfiguration();
  const { connected, publicKey, signTransaction } = useWallet();
  const [toggleEnabled, setToggleEnabled] = useState(false);
  const [showMintInfo, setMintInfo] = useState(false);
  const [showFreezeInfo, setFreezeInfo] = useState(false);
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [isCreating, setIsCreating] = useState(false); // Track transaction state

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

  // State for FAQ collapse/expand functionality
  const [openIndex, setOpenIndex] = useState<number | null>(null);

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
      toast.error("Please connect your wallet");
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

    setIsCreating(true); // Disable the button and show loading spinner

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
      toast.success(`Token created successfully.`);
      await storeToken(publicKey.toBase58(), result.mintAddress, tokenName, tokenSymbol, tokenSupply, result.transactionSignature, result.networkConfiguration);
      resetForm();
    } else {
      toast.error(`Token creation failed: ${result.message}`);
      resetForm();
    }
    setIsCreating(false); // Re-enable the button
  };

  // FAQ data
  // Removed local duplicate of faqItems to use shared content where needed.

  // Function to toggle FAQ items
  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div id="webcrumbs">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Side: Form */}
        <div className="w-full lg:w-[60%] bg-neutral/60 backdrop-blur-xl p-8 rounded-2xl border border-white/10 shadow-2xl">
          <div className="flex flex-col gap-3 mb-8">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">Solana Token Creator</h1>
            <p className="text-gray-400 text-sm">
              The perfect tool to create Solana SPL tokens. Simple, user friendly, and fast.
            </p>
          </div>

          <div className="space-y-6">
            {/* Name and Symbol Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="relative">
                <label className="block text-gray-300 text-xs font-semibold mb-2 tracking-wide uppercase">Name</label>
                <input
                  type="text"
                  placeholder="Enter token name"
                  className="w-full bg-black/50 border border-white/10 focus:border-primary-focus focus:ring-1 focus:ring-primary-focus transition-all rounded-lg px-4 py-3 text-white placeholder-gray-500 outline-none"
                  value={tokenName}
                  onChange={handleTokenNameChange}
                />
                {tokenNameError && <p className="text-red-500 text-xs mt-2">{tokenNameError}</p>}
              </div>

              <div className="relative">
                <label className="block text-gray-300 text-xs font-semibold mb-2 tracking-wide uppercase">Symbol</label>
                <input
                  type="text"
                  placeholder="Enter token symbol"
                  className="w-full bg-black/50 border border-white/10 focus:border-primary-focus focus:ring-1 focus:ring-primary-focus transition-all rounded-lg px-4 py-3 text-white placeholder-gray-500 outline-none"
                  value={tokenSymbol}
                  onChange={handleTokenSymbolChange}
                />
                {tokenSymbolError && <p className="text-red-500 text-xs mt-2">{tokenSymbolError}</p>}
              </div>
            </div>

            {/* Decimals and Supply Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="relative">
                <label className="block text-gray-300 text-xs font-semibold mb-2 tracking-wide uppercase">Decimals</label>
                <input
                  type="number"
                  placeholder="e.g. 6 (Recommended)"
                  className="w-full bg-black/50 border border-white/10 focus:border-primary-focus focus:ring-1 focus:ring-primary-focus transition-all rounded-lg px-4 py-3 text-white placeholder-gray-500 outline-none"
                  value={tokenDecimals}
                  onChange={handleTokenDecimalsChange}
                  min="1"
                  max="9"
                  step="1"
                />
                {tokenDecimalsError && <p className="text-red-500 text-xs mt-2">{tokenDecimalsError}</p>}
              </div>

              <div className="relative">
                <div className="flex justify-between items-end mb-2">
                  <label className="block text-gray-300 text-xs font-semibold tracking-wide uppercase">Supply</label>
                  <button
                    onClick={() => setTokenSupply("21000000")}
                    className="text-[10px] text-primary-focus hover:text-purple-300 font-semibold uppercase transition-colors"
                  >
                    Recommended
                  </button>
                </div>
                <input
                  type="number"
                  placeholder="1000000"
                  className="w-full bg-black/50 border border-white/10 focus:border-primary-focus focus:ring-1 focus:ring-primary-focus transition-all rounded-lg px-4 py-3 text-white placeholder-gray-500 outline-none"
                  value={tokenSupply}
                  onChange={handleTokenSupplyChange}
                  min="1"
                  step="1"
                />
                {tokenSupplyError && <p className="text-red-500 text-xs mt-2">{tokenSupplyError}</p>}
              </div>
            </div>

            {/* Token Image Upload */}
            <div className="relative">
              <label className="block text-gray-300 text-xs font-semibold mb-2 tracking-wide uppercase">Image</label>
              <div className="w-full bg-black/50 border border-white/10 focus-within:border-primary-focus focus-within:ring-1 focus-within:ring-primary-focus transition-all rounded-lg p-2">
                <div className="w-full h-24 flex items-center justify-center rounded-lg border-2 border-dashed border-white/20 hover:border-primary-focus transition-colors cursor-pointer bg-white/5">
                  <UploadFile onFileUpload={(url) => setTokenImage(url)} resetImage={resetImage} />
                </div>
              </div>
            </div>

            {/* Description Textarea */}
            <div className="relative">
              <div className="flex justify-between items-end mb-2">
                <label className="block text-gray-300 text-xs font-semibold tracking-wide uppercase">Description</label>
                <span className="text-[10px] text-gray-500 font-semibold uppercase">
                  {tokenDescription.length}/{MAX_DESCRIPTION_LENGTH}
                </span>
              </div>
              <textarea
                placeholder="Enter token description"
                className="w-full bg-black/50 border border-white/10 focus:border-primary-focus focus:ring-1 focus:ring-primary-focus transition-all rounded-lg px-4 py-3 text-white placeholder-gray-500 outline-none resize-none"
                rows={4}
                value={tokenDescription}
                onChange={handleDescriptionChange}
              />
              {tokenDescriptionError && <p className="text-red-500 text-xs mt-2">{tokenDescriptionError}</p>}
            </div>

            {/* Revoke Freeze Authority */}
            <div className="flex items-center justify-between p-4 bg-black/30 border border-white/5 rounded-xl">
              <div className="flex items-center gap-2">
                <span className="text-gray-300 text-sm font-medium">Revoke Freeze Authority (Required)</span>
                <button
                  className="material-symbols-outlined text-gray-500 hover:text-primary-focus text-lg transition-colors focus:outline-none"
                  onClick={() => setFreezeInfo(true)}
                >
                  info
                </button>
                {showFreezeInfo && (
                  <div className="fixed inset-0 flex items-center justify-center bg-black/80 z-[100] backdrop-blur-sm" onClick={() => setFreezeInfo(false)}>
                    <div className="bg-neutral p-6 rounded-xl border border-white/10 max-w-sm text-gray-300 text-sm relative shadow-2xl" onClick={e => e.stopPropagation()}>
                      <button
                        className="absolute top-3 right-3 text-gray-500 hover:text-white transition-colors"
                        onClick={() => setFreezeInfo(false)}
                      >
                        <span className="material-symbols-outlined">close</span>
                      </button>
                      <h4 className="font-bold text-white mb-2 text-lg">Freeze Authority</h4>
                      <p>
                        <span className="text-primary-focus font-bold uppercase text-xs tracking-wider">Required</span><br />
                        Revoking freeze authority is absolutely mandatory if you plan to create a liquidity pool on Solana DEXs.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Revoke Mint Authority */}
            <div className="flex items-center justify-between p-4 bg-black/30 border border-white/5 rounded-xl">
              <div className="flex items-center gap-2">
                <span className="text-gray-300 text-sm font-medium">Revoke Mint Authority</span>
                <button
                  className="material-symbols-outlined text-gray-500 hover:text-primary-focus text-lg transition-colors focus:outline-none"
                  onClick={() => setMintInfo(true)}
                >
                  info
                </button>
                {showMintInfo && (
                  <div className="fixed inset-0 flex items-center justify-center bg-black/80 z-[100] backdrop-blur-sm" onClick={() => setMintInfo(false)}>
                    <div className="bg-neutral p-6 rounded-xl border border-white/10 max-w-sm text-gray-300 text-sm relative shadow-2xl" onClick={e => e.stopPropagation()}>
                      <button
                        className="absolute top-3 right-3 text-gray-500 hover:text-white transition-colors"
                        onClick={() => setMintInfo(false)}
                      >
                        <span className="material-symbols-outlined">close</span>
                      </button>
                      <h4 className="font-bold text-white mb-2 text-lg">Mint Authority</h4>
                      <p>
                        Revoking mint authority ensures the supply is permanently capped. This is essential for investor trust.
                      </p>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-3">
                <button
                  className={`w-11 h-6 rounded-full transition-colors relative focus:outline-none shadow-inner ${toggleEnabled ? "bg-primary-focus" : "bg-white/20"
                    }`}
                  onClick={() => setToggleEnabled(!toggleEnabled)}
                >
                  <div
                    className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform ${toggleEnabled ? "translate-x-5" : "translate-x-0"
                      }`}
                  />
                </button>
                <span className="text-gray-400 text-sm font-semibold">+ 0.1 SOL</span>
              </div>
            </div>

            {/* Show More Options Button */}
            <div className="flex justify-start">
              <button
                className="flex items-center text-gray-400 hover:text-white transition-colors text-sm font-medium tracking-wide focus:outline-none"
                onClick={() => setShowMoreOptions(!showMoreOptions)}
              >
                <span className="mr-1">Show more options</span>
                <span className="material-symbols-outlined text-xl transition-transform duration-200" style={{ transform: showMoreOptions ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                  expand_more
                </span>
              </button>
            </div>

            {/* Optional Fields (Telegram, Website, X) */}
            {showMoreOptions && (
              <div className="space-y-5 animate-in fade-in slide-in-from-top-2 duration-300">
                {/* Telegram Link */}
                <div className="relative">
                  <label className="block text-gray-300 text-xs font-semibold mb-2 tracking-wide uppercase">Telegram Link</label>
                  <div className="flex items-center bg-black/50 border border-white/10 focus-within:border-primary-focus focus-within:ring-1 focus-within:ring-primary-focus transition-all rounded-lg px-4 py-3 text-white placeholder-gray-500">
                    <span className="text-gray-500 mr-1 select-none">https://</span>
                    <input
                      type="text"
                      placeholder="t.me/username"
                      className="w-full bg-transparent outline-none"
                      value={telegramLink.replace("https://", "")}
                      onChange={handleTelegramLinkChange}
                      onBlur={handleTelegramLinkBlur}
                    />
                  </div>
                  {telegramLinkError && <p className="text-red-500 text-xs mt-2">{telegramLinkError}</p>}
                </div>

                {/* Website Link */}
                <div className="relative">
                  <label className="block text-gray-300 text-xs font-semibold mb-2 tracking-wide uppercase">Website Link</label>
                  <div className="flex items-center bg-black/50 border border-white/10 focus-within:border-primary-focus focus-within:ring-1 focus-within:ring-primary-focus transition-all rounded-lg px-4 py-3 text-white placeholder-gray-500">
                    <span className="text-gray-500 mr-1 select-none">https://</span>
                    <input
                      type="text"
                      placeholder="example.com"
                      className="w-full bg-transparent outline-none"
                      value={websiteLink.replace("https://", "")}
                      onChange={handleWebsiteLinkChange}
                      onBlur={handleWebsiteLinkBlur}
                    />
                  </div>
                  {websiteLinkError && <p className="text-red-500 text-xs mt-2">{websiteLinkError}</p>}
                </div>

                {/* X (Twitter) Link */}
                <div className="relative">
                  <label className="block text-gray-300 text-xs font-semibold mb-2 tracking-wide uppercase">X (Twitter) Link</label>
                  <div className="flex items-center bg-black/50 border border-white/10 focus-within:border-primary-focus focus-within:ring-1 focus-within:ring-primary-focus transition-all rounded-lg px-4 py-3 text-white placeholder-gray-500">
                    <span className="text-gray-500 mr-1 select-none">https://</span>
                    <input
                      type="text"
                      placeholder="x.com/username"
                      className="w-full bg-transparent outline-none"
                      value={twitterLink.replace("https://", "")}
                      onChange={handleTwitterLinkChange}
                      onBlur={handleTwitterLinkBlur}
                    />
                  </div>
                  {twitterLinkError && <p className="text-red-500 text-xs mt-2">{twitterLinkError}</p>}
                </div>
              </div>
            )}
            <br></br>

            {/* Create Token Button */}
            <button
              className={`w-full font-bold py-4 rounded-xl transition-all duration-300 text-base flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(153,69,255,0.3)]
                ${(!signTransaction || isCreating)
                  ? "bg-gray-800 text-gray-500 cursor-not-allowed border border-white/5"
                  : "bg-gradient-to-r from-purple-600 to-primary text-white hover:from-purple-500 hover:to-primary-focus hover:shadow-[0_0_30px_rgba(153,69,255,0.5)] border border-white/10 relative overflow-hidden group"
                }`}
              onClick={handleCreateToken}
              disabled={!signTransaction || isCreating}
            >
              {isCreating ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Token...
                </>
              ) : (
                <>
                  <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-white rounded-full group-hover:w-56 group-hover:h-56 opacity-10"></span>
                  Create Token
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Side: Instructions */}
        <div className="w-full lg:w-[40%] flex flex-col gap-6 lg:pl-6 text-gray-300">
          <div>
            <h2 className="text-xl font-bold text-white mb-2">Create Solana Token</h2>
            <p className="text-sm leading-relaxed text-gray-400">Effortlessly create your Solana SPL Token with our simple process – no coding required. Customize your Solana Token exactly the way you envision it. Less than 5 minutes, at an affordable cost.</p>
          </div>

          <div className="bg-black/30 border border-white/5 rounded-xl p-6">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center"><span className="material-symbols-outlined mr-2 text-primary-focus">list_alt</span>How to use Solana Token Creator</h2>
            <ul className="space-y-3 text-sm text-gray-400 list-decimal pl-5 marker:text-primary-focus">
              {tokenCreatorInstructions.map((instruction, idx) => (
                <li key={idx} className="leading-relaxed">{instruction}</li>
              ))}
            </ul>
          </div>

          <div className="bg-primary/5 border border-primary-focus/20 rounded-xl p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-focus/10 rounded-full blur-3xl"></div>
            <h2 className="text-sm font-bold text-primary-focus mb-2 uppercase tracking-wide">Pricing</h2>
            <p className="text-2xl font-bold text-white mb-1">0.1 SOL</p>
            <p className="text-xs text-gray-400">The SPLForge fee for Token creation is 0.1 SOL. This does not cover the native Solana network fees for SPL Token Creation, which cost roughly 0.01 SOL.</p>
          </div>

          <div className="space-y-4">
            <div>
              <h2 className="text-sm font-bold text-white mb-1">Revoke Freeze Authority:</h2>
              <p className="text-xs text-gray-400">If you want to create a liquidity pool you will need to &lsquo;Revoke Freeze Authority&rsquo; of the Token - Required.</p>
            </div>
            <div>
              <h2 className="text-sm font-bold text-white mb-1">Revoke Mint Authority:</h2>
              <p className="text-xs text-gray-400">Revoking mint authority ensures that there can be no more tokens minted than the total supply. This provides security and peace of mind to buyers. The cost is 0.1 SOL</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TokenCreator;