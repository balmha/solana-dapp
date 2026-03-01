import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import Image from 'next/image';
import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";
import { Metadata, PROGRAM_ID } from "@metaplex-foundation/mpl-token-metadata";
import { createPoolAndAddLiquidityWithFee } from '../utils/createLiquidityPool'; // Import the createLiquidityPool
import { useNetworkConfiguration } from '../contexts/NetworkConfigurationProvider';
import toast from 'react-hot-toast';
import { liquidityPoolInstructions } from '../content/instructions';

// Example usage
const mintAddresses = [
  new PublicKey("Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB"), // USDT mainnet and devnet
  new PublicKey("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"), // USDC Mainnet
  new PublicKey("So11111111111111111111111111111111111111112"), // SOL mainnet and devnet
  new PublicKey("4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU") // USDC DEVNET
];
const tokenDict = {
  USDT: mintAddresses[0],
  USDC: mintAddresses[1],
  SOL: mintAddresses[2],
  USDCDEV: mintAddresses[3]
};

export const LiquidityPool = () => {
  const { networkConfiguration } = useNetworkConfiguration();
  const { publicKey, signAllTransactions } = useWallet(); // Add signTransaction from useWallet
  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
  //const { networkConfiguration } = useNetworkConfiguration();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [BaseAmount, setBaseAmount] = useState("");
  const [currentBaseamount, setCurrentBaseAmount] = useState(0);
  const [currentBaseDecimals, setCurrentBaseDecimals] = useState(0);

  const [selectedToken, setSelectedToken] = useState({
    symbol: "",
    mint: "",
    balance: null,
    icon: "data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='12' cy='12' r='12' fill='%23404040'/%3E%3C/svg%3E"
  });

  const [isModalQuoteOpen, setIsModalQuoteOpen] = useState(false);
  const [QuoteAmount, setQuoteAmount] = useState("");
  const [currentQuoteamount, setCurrentQuoteAmount] = useState(0);

  const [selectedQuoteToken, setSelectedQuoteToken] = useState({
    symbol: "",
    mint: "",
    balance: null,
    icon: "data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='12' cy='12' r='12' fill='%23404040'/%3E%3C/svg%3E"
  });

  const [FeeTier, setFeeTier] = useState("0.25");
  const [isLoading, setIsLoading] = useState(false);
  const [showFeeInfo, setFeeInfo] = useState(false);
  const [showInitialPriceInfo, setInitialPriceInfo] = useState(false);


  function formatDynamicDecimal(value) {
    if (value === 0) return "0";

    // Numbers >= 1: Fixed 2 decimals (e.g., "1.23")
    if (value >= 1) return value.toFixed(2);

    // Numbers < 1e-15: Treat as zero
    if (value < 1e-15) return "0";

    // Convert to a precise string to avoid floating-point errors
    const preciseStr = value.toFixed(20);
    const [integerPart, decimalPart] = preciseStr.split('.');

    // Count leading zeros after the decimal
    const leadingZeros = (decimalPart || '').match(/^0*/)[0].length;

    // Ensure we show at least 2 significant digits
    const decimalPlaces = leadingZeros + 2;

    // Cap at 15 decimals to avoid absurdly long numbers
    const safeDecimalPlaces = Math.min(decimalPlaces, 15);

    return value.toFixed(safeDecimalPlaces);
  }

  const initialPrice = BaseAmount && QuoteAmount
    ? formatDynamicDecimal(parseFloat(QuoteAmount) / parseFloat(BaseAmount))
    : "0";

  // Handler for Token 1 selection
  const handleTokenSelect = async (token) => {
    //getTokenAccounts(connection, publicKey);
    setCurrentBaseAmount(token.balance);
    setCurrentBaseDecimals(token.decimals);
    setSelectedToken(token); // Update Token 1
    if (token.icon === "") {
      token.icon = "https://www.svgrepo.com/show/508699/landscape-placeholder.svg";
    }
    setIsModalOpen(false); // Close Modal 1
  };

  // Handler for Token 2 selection
  const handleQuoteTokenSelect = async (token) => {
    const currentQuoteAmount = await fetchTokenBalance(connection, publicKey, tokenDict[token.symbol]);
    setCurrentQuoteAmount(currentQuoteAmount);
    setSelectedQuoteToken(token); // Update Token 2
    setIsModalQuoteOpen(false); // Close Modal 2
  };

  const handleAmountChange = (e) => {
    const value = e.target.value;
    if (/^\d*\.?\d*$/.test(value)) {
      setBaseAmount(value);
    }
  };

  const handleQuoteAmountChange = (e) => {
    const value = e.target.value;
    if (/^\d*\.?\d*$/.test(value)) {
      setQuoteAmount(value);
    }
  };

  // Handle 50% button click
  const handleFiftyPercent = () => {
    setBaseAmount((currentBaseamount / 2).toString());
  };

  const handleQuoteFiftyPercent = () => {
    setQuoteAmount((currentQuoteamount / 2).toString());
  };

  // Handle 50% button click
  const handleBaseMax = () => {
    setBaseAmount(currentBaseamount.toString());
  };

  const handleQuoteMax = () => {
    setQuoteAmount(currentQuoteamount.toString());
  };

  // Handler for Initialize Liquidity Pool button
  const handleInitializeLiquidityPool = async () => {
    setIsLoading(true);

    try {
      // Validate input parameters
      if (!publicKey) {
        toast.error("Wallet not connected");
        return;
      }
      if (!signAllTransactions) {
        toast.error("Wallet doesn't support transaction signing");
        return;
      }
      if (!selectedToken?.symbol || !selectedQuoteToken?.symbol) {
        toast.error("Please select both base and quote tokens");
        return;
      }
      if (!BaseAmount || !QuoteAmount) {
        toast.error("Please enter amounts for both tokens");
        return;
      }
      if (!FeeTier) {
        toast.error("Please select a fee tier");
        return;
      }

      const baseTokenMint = new PublicKey(selectedToken.mint);
      const quoteTokenMint = tokenDict[selectedQuoteToken.symbol];

      const result = await createPoolAndAddLiquidityWithFee(
        networkConfiguration,
        publicKey,
        signAllTransactions,
        baseTokenMint,
        quoteTokenMint,
        currentBaseDecimals,
        parseFloat(BaseAmount),
        parseFloat(QuoteAmount),
        1000000000,
        new PublicKey(process.env.NEXT_PUBLIC_ADDRESS)
      );

      if (!result.success) {
        toast.error(result.error || "Failed to create liquidity pool");
        return;
      }

      toast.success(`Liquidity pool created! TX: ${result.txId}`);
      return result.txId;

    } catch (error) {
      const message = error instanceof Error ? error.message : "Transaction failed";
      toast.error(message);
      console.error("Liquidity pool error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div id="webcrumbs">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Side: Form */}
        <div className="w-full lg:w-[60%] bg-neutral/60 backdrop-blur-xl p-8 rounded-2xl border border-white/10 shadow-2xl">
          <div className="flex flex-col gap-3 mb-8">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">Initialize Liquidity</h1>
            <p className="text-gray-400 text-sm">Create a vibrant trading market for your Token in 1 click.</p>
          </div>
          <div className="space-y-6">
            <div className="relative">
              {/* Top Bar with Token Type, 50%, and Max */}
              <div className="flex justify-between items-center mb-2">
                <label className="text-gray-300 text-xs font-semibold tracking-wide uppercase">Base token</label>
                <div className="flex items-center gap-3">
                  {/* Mini Wallet Icon */}
                  <div className="flex items-center gap-1 text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-wallet-minimal">
                      <path d="M17 14h.01"></path>
                      <path d="M7 7h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14"></path>
                    </svg>
                    <span className="text-xs">{currentBaseamount}</span>
                  </div>
                  <button onClick={handleFiftyPercent} className="text-[10px] text-primary-focus hover:text-purple-300 font-semibold uppercase transition-colors">
                    50%
                  </button>
                  <button onClick={handleBaseMax} className="text-[10px] text-primary-focus hover:text-purple-300 font-semibold uppercase transition-colors">
                    Max
                  </button>
                </div>
              </div>

              {/* Token Selection Box */}
              <div className="w-full bg-black/50 border border-white/10 hover:border-primary-focus focus-within:ring-1 focus-within:ring-primary-focus transition-all rounded-lg p-2 flex items-center justify-between">
                <button
                  className="flex items-center gap-2 bg-white/5 px-3 py-2 rounded shadow-inner hover:bg-white/10 transition-colors w-[140px]"
                  onClick={() => setIsModalOpen(true)}
                >
                  <div className="flex-shrink-0 bg-black/50 rounded-full p-1">
                    <Image src={selectedToken.icon} className="w-5 h-5 rounded-full" alt={selectedToken.symbol} width={100} height={100} />
                  </div>
                  <span className="text-white text-sm font-semibold whitespace-nowrap overflow-hidden overflow-ellipsis">{selectedToken.symbol || "Select"}</span>
                  <span className="material-symbols-outlined text-gray-400 text-lg ml-auto">expand_more</span>
                </button>

                {/* Numeric Input */}
                <input
                  type="number"
                  value={BaseAmount}
                  onChange={handleAmountChange}
                  className="bg-transparent px-4 py-2 text-white placeholder-gray-600 outline-none w-full text-right font-medium text-lg"
                  placeholder="0.0"
                  disabled={!selectedToken.symbol}
                />
              </div>

              {/* Token Selection Modal */}
              {isModalOpen && (
                <LiquidityTokenSelec
                  onClose={() => setIsModalOpen(false)}
                  onSelectToken={handleTokenSelect}
                  connection={connection}
                  walletPublicKey={publicKey}
                />
              )}
            </div>

            <div className="flex justify-center -my-3 relative z-10">
              <div className="bg-black/80 rounded-full p-2 border border-white/5 shadow-[0_0_15px_rgba(153,69,255,0.2)]">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-plus text-primary-focus"><path d="M5 12h14"></path><path d="M12 5v14"></path></svg>
              </div>
            </div>

            <div className="relative">
              {/* Top Bar with Token Type, 50%, and Max */}
              <div className="flex justify-between items-center mb-2">
                <label className="text-gray-300 text-xs font-semibold tracking-wide uppercase">Quote token</label>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-wallet-minimal"><path d="M17 14h.01"></path><path d="M7 7h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14"></path></svg>
                    <span className="text-xs">{currentQuoteamount}</span>
                  </div>
                  <button onClick={handleQuoteFiftyPercent} className="text-[10px] text-primary-focus hover:text-purple-300 font-semibold uppercase transition-colors">
                    50%
                  </button>
                  <button onClick={handleQuoteMax} className="text-[10px] text-primary-focus hover:text-purple-300 font-semibold uppercase transition-colors">
                    Max
                  </button>
                </div>
              </div>

              {/* Token Selection Box */}
              <div className="w-full bg-black/50 border border-white/10 hover:border-primary-focus focus-within:ring-1 focus-within:ring-primary-focus transition-all rounded-lg p-2 flex items-center justify-between">
                <button
                  className="flex items-center gap-2 bg-white/5 px-3 py-2 rounded shadow-inner hover:bg-white/10 transition-colors w-[140px]"
                  onClick={() => setIsModalQuoteOpen(true)}
                >
                  <div className="flex-shrink-0 bg-black/50 rounded-full p-1">
                    <Image src={selectedQuoteToken.icon} className="w-5 h-5 rounded-full" alt={selectedQuoteToken.symbol} width={100} height={100} />
                  </div>
                  <span className="text-white text-sm font-semibold whitespace-nowrap overflow-hidden overflow-ellipsis">{selectedQuoteToken.symbol || "Select"}</span>
                  <span className="material-symbols-outlined text-gray-400 text-lg ml-auto">expand_more</span>
                </button>

                {/* Numeric Input */}
                <input
                  type="number"
                  value={QuoteAmount}
                  onChange={handleQuoteAmountChange}
                  className="bg-transparent px-4 py-2 text-white placeholder-gray-600 outline-none w-full text-right font-medium text-lg"
                  placeholder="0.0"
                  disabled={!selectedQuoteToken.symbol}
                />

                {/* Token Quote Selection Modal */}
                {isModalQuoteOpen && (
                  <LiquidityTokenQuoteSelec
                    onClose={() => setIsModalQuoteOpen(false)}
                    onSelectToken={handleQuoteTokenSelect}
                  />
                )}
              </div>
            </div>

            <div className="bg-black/30 border border-white/5 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <label className="text-gray-300 text-sm font-medium flex items-center gap-1">
                  Initial price
                  <button
                    className="material-symbols-outlined text-gray-500 hover:text-primary-focus text-lg transition-colors focus:outline-none"
                    onClick={() => setInitialPriceInfo(true)}
                  >
                    info
                  </button>
                </label>
                {showInitialPriceInfo && (
                  <div className="fixed inset-0 flex items-center justify-center bg-black/80 z-[100] backdrop-blur-sm" onClick={() => setInitialPriceInfo(false)}>
                    <div className="bg-neutral p-6 rounded-xl border border-white/10 max-w-sm text-gray-300 text-sm relative shadow-2xl" onClick={e => e.stopPropagation()}>
                      <button
                        className="absolute top-3 right-3 text-gray-500 hover:text-white transition-colors"
                        onClick={() => setInitialPriceInfo(false)}
                      >
                        <span className="material-symbols-outlined">close</span>
                      </button>
                      <h4 className="font-bold text-white mb-2 text-lg">Initial Price</h4>
                      <p>Is determined by the ratio of tokens deposited for initial liquidity.</p>
                    </div>
                  </div>
                )}
                <span className="text-white font-semibold">{initialPrice} {selectedQuoteToken.symbol && selectedToken.symbol ? `${selectedQuoteToken.symbol}/${selectedToken.symbol}` : ""}</span>
              </div>
            </div>

            <button
              className={`w-full font-bold py-4 rounded-xl transition-all duration-300 text-base flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(153,69,255,0.3)]
                ${(isLoading || !selectedToken.symbol || !selectedQuoteToken.symbol || !BaseAmount || !QuoteAmount)
                  ? "bg-gray-800 text-gray-500 cursor-not-allowed border border-white/5"
                  : "bg-gradient-to-r from-purple-600 to-primary text-white hover:from-purple-500 hover:to-primary-focus hover:shadow-[0_0_30px_rgba(153,69,255,0.5)] border border-white/10 relative overflow-hidden group"
                }`}
              disabled={isLoading || !selectedToken.symbol || !selectedQuoteToken.symbol || !BaseAmount || !QuoteAmount}
              onClick={handleInitializeLiquidityPool}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Initializing...
                </>
              ) : (
                <>
                  <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-white rounded-full group-hover:w-56 group-hover:h-56 opacity-10"></span>
                  Initialize Liquidity Pool
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Side: Instructions */}
        <div className="w-full lg:w-[40%] flex flex-col gap-6 lg:pl-6 text-gray-300">
          <div>
            <h2 className="text-xl font-bold text-white mb-2">Create Solana Liquidity Pool</h2>
            <p className="text-sm leading-relaxed text-gray-400">Easily create a liquidity pool for your Solana token. The fastest way to deploy Solana tokens and launch your project with SPLForge.</p>
          </div>

          <div className="bg-black/30 border border-white/5 rounded-xl p-6">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center"><span className="material-symbols-outlined mr-2 text-primary-focus">list_alt</span>How To Create a Liquidity Pool</h2>
            <ul className="space-y-3 text-sm text-gray-400 list-decimal pl-5 marker:text-primary-focus">
              {liquidityPoolInstructions.map((instruction, idx) => (
                <li key={idx} className="leading-relaxed">{instruction}</li>
              ))}
            </ul>
          </div>

          <div className="bg-primary/5 border border-primary-focus/20 rounded-xl p-6 relative overflow-hidden mt-2">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-focus/10 rounded-full blur-3xl"></div>
            <h2 className="text-sm font-bold text-primary-focus mb-2 uppercase tracking-wide">Important Notes</h2>
            <ul className="space-y-2 text-xs text-gray-400 list-disc pl-4">
              <li>In return for creating the pool, you will receive <span className="text-white font-semibold text-xs">Liquidity pool tokens</span>.</li>
              <li>To burn liquidity so it shows locked, head to <a href="https://sol-incinerator.com" target="_blank" rel="noreferrer" className="text-primary-focus hover:underline">sol-incinerator.com</a>.</li>
              <li>The amount of base token (SOL/USDC) you enter as your starting LP determines the starting price of your token.</li>
              <li className="text-red-400">USDC Token pairing doesn&apos;t work on Devnet.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export const LiquidityTokenSelec = ({ onClose, onSelectToken, connection, walletPublicKey }) => {
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch token accounts and metadata
  useEffect(() => {
    const fetchTokens = async () => {
      try {
        // Fetch parsed token accounts
        const tokenAccounts = await connection.getParsedTokenAccountsByOwner(walletPublicKey, {
          programId: new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"), // Token Program ID
        });

        // Fetch metadata for all tokens in parallel
        const tokenPromises = tokenAccounts.value.map(async (account) => {
          const mintAddress = new PublicKey(account.account.data.parsed.info.mint);
          const tokenDecimals = account.account.data.parsed.info.tokenAmount.decimals;

          // Fetch metadata URI for the token
          const uri = await fetchMetadataUri(connection, mintAddress);
          if (uri) {
            // Fetch metadata JSON
            const metadataResponse = await fetch(uri);
            const metadata = await metadataResponse.json();

            return {
              symbol: metadata.symbol,
              icon: metadata.image,
              mint: mintAddress.toBase58(),
              decimals: tokenDecimals,
              balance: account.account.data.parsed.info.tokenAmount.uiAmount,
            };
          } else {
            // Provide default values if metadata is not available
            return null;
          }
        });

        // Wait for all metadata fetches to complete
        const tokenList = (await Promise.all(tokenPromises)).filter(Boolean);
        setTokens(tokenList);
      } catch (error) {
        console.error("Failed to fetch tokens:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTokens();
  }, [connection, walletPublicKey]);

  // Handle token selection
  const handleTokenSelect = (token) => {
    onSelectToken(token); // Update the parent component with the selected token
    onClose(); // Close the modal
  };

  return ReactDOM.createPortal(
    <div className="fixed inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 z-[100]">
      <div className="bg-neutral rounded-2xl p-6 w-full max-w-sm border border-white/10 shadow-2xl flex flex-col max-h-[70vh]">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-white">Select a token</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-white transition-colors focus:outline-none"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="mb-4 relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">search</span>
          <input
            type="text"
            placeholder="Search tokens..."
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-black/50 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-primary-focus focus:ring-1 focus:ring-primary-focus transition-all"
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Token List with Scroll */}
        <div className="overflow-y-auto" style={{ maxHeight: '50vh' }}>
          {loading ? (
            <p className="text-sm text-gray-400">Loading tokens...</p>
          ) : (
            <div className="space-y-2">
              {tokens
                .filter((token) =>
                  token.symbol.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((token) => (
                  <button
                    key={token.mint}
                    onClick={() => handleTokenSelect(token)}
                    className="w-full flex items-center gap-3 bg-black/30 px-4 py-3 rounded-xl hover:bg-white/10 transition-colors border border-transparent hover:border-white/5"
                  >
                    <Image
                      src={token.icon || "https://www.svgrepo.com/show/508699/landscape-placeholder.svg"}
                      className="w-8 h-8 rounded-full"
                      alt={token.symbol}
                      width={100}
                      height={100}
                    />
                    <span className="text-white font-semibold text-sm">{token.symbol}</span>
                    <span className="text-gray-400 text-xs font-medium ml-auto">
                      {token.balance}
                    </span>
                  </button>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};

export const LiquidityTokenQuoteSelec = ({ onClose, onSelectToken }) => {
  const handleTokenSelect = (token) => {
    onSelectToken(token); // Update the parent component with the selected token
    onClose(); // Close the modal
  };

  return ReactDOM.createPortal(
    <div className="fixed inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 z-[100]">
      <div className="bg-neutral rounded-2xl p-6 w-full max-w-sm border border-white/10 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-white">Select Quote Token</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors focus:outline-none">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="mb-2">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">Popular tokens</p>
          <div className="flex flex-col gap-2">
            <button
              onClick={() => handleTokenSelect({ symbol: "SOL", icon: "https://cryptologos.cc/logos/solana-sol-logo.png" })}
              className="flex items-center gap-3 bg-black/30 px-4 py-3 rounded-xl hover:bg-white/10 transition-colors border border-transparent hover:border-white/5"
            >
              <Image src="https://cryptologos.cc/logos/solana-sol-logo.png" className="w-8 h-8 rounded-full" alt="SOL" width={100} height={100} />
              <span className="text-white font-semibold text-sm">SOL</span>
            </button>
            <button
              onClick={() => handleTokenSelect({ symbol: "USDC", icon: "https://assets.coingecko.com/coins/images/6319/thumb/USD_Coin_icon.png" })}
              className="flex items-center gap-3 bg-black/30 px-4 py-3 rounded-xl hover:bg-white/10 transition-colors border border-transparent hover:border-white/5"
            >
              <Image src="https://assets.coingecko.com/coins/images/6319/thumb/USD_Coin_icon.png" className="w-8 h-8 rounded-full" alt="USDC" width={100} height={100} />
              <span className="text-white font-semibold text-sm">USDC</span>
            </button>
            <button
              onClick={() => handleTokenSelect({ symbol: "USDT", icon: "https://assets.coingecko.com/coins/images/325/thumb/Tether.png" })}
              className="flex items-center gap-3 bg-black/30 px-4 py-3 rounded-xl hover:bg-white/10 transition-colors border border-transparent hover:border-white/5"
            >
              <Image src="https://assets.coingecko.com/coins/images/325/thumb/Tether.png" className="w-8 h-8 rounded-full" alt="USDT" width={100} height={100} />
              <span className="text-white font-semibold text-sm">USDT</span>
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

// Function to fetch metadata URI
export const fetchMetadataUri = async (connection, mintAddress) => {
  try {
    // Derive the metadata account address
    const metadataPda = await PublicKey.findProgramAddress(
      [
        Buffer.from("metadata"),
        PROGRAM_ID.toBuffer(),
        mintAddress.toBuffer(),
      ],
      PROGRAM_ID
    );

    // Fetch the metadata account
    const metadataAccount = await connection.getAccountInfo(metadataPda[0]);

    if (!metadataAccount) {
      //console.warn(`Metadata account not found for mint: ${mintAddress.toBase58()}`);
      return null; // Return null if metadata account does not exist
    }

    // Decode the metadata account
    const metadata = Metadata.deserialize(metadataAccount.data);

    // Extract the URI
    const uri = metadata[0].data.uri;
    return uri;
  } catch (error) {
    console.error("Failed to fetch metadata URI:", error);
    return null; // Return null if an error occurs
  }
};

export const fetchTokenBalance = async (connection, walletPublicKey, mintAddress) => {
  try {
    // Check if the mint address is SOL
    if (mintAddress.toBase58() === "So11111111111111111111111111111111111111112") {
      // Fetch SOL balance
      const solBalance = await connection.getBalance(walletPublicKey);
      return solBalance / 1e9; // Convert lamports to SOL
    }

    // Fetch SPL token balance
    const tokenAccounts = await connection.getParsedTokenAccountsByOwner(walletPublicKey, {
      programId: new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"),
    });

    // Find the token account for the requested mint address
    const tokenAccount = tokenAccounts.value.find((account) =>
      account.account.data.parsed.info.mint === mintAddress.toBase58()
    );

    // Return the balance or 0 if no token account is found
    return tokenAccount ? tokenAccount.account.data.parsed.info.tokenAmount.uiAmount : 0;
  } catch (error) {
    console.error("Failed to fetch token balance:", error);
    return null;
  }
};

export default LiquidityPool;