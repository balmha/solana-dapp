import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import Image from 'next/image';
import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";
import { Metadata, PROGRAM_ID } from "@metaplex-foundation/mpl-token-metadata";
import { createPoolAndAddLiquidityWithFee } from '../utils/createLiquidityPool'; // Import the createLiquidityPool
import { useNetworkConfiguration } from '../contexts/NetworkConfigurationProvider';
import toast from 'react-hot-toast';

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
			<div className="p-6 md:p-8 rounded-xl flex flex-col lg:flex-row gap-6">
        {/* Left Side: Form */}
        <div className="w-full lg:w-1/2 bg-indigo-950/50 backdrop-blur-sm p-6 rounded-xl border border-indigo-800/30">
					<h2 className="text-white text-2xl font-semibold mb-6">Initialize Liquidity</h2>
					<div className="space-y-6">
          <div className="relative">
              {/* Top Bar with Token Type, 50%, and Max */}
              <div className="flex justify-between items-center bg-indigo-900/50 border border-indigo-700/30 rounded-t-lg px-3 py-2">
                <span className="text-indigo-300 text-sm">Base token</span>
                <div className="flex items-center gap-2">
                  {/* Mini Wallet Icon */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-wallet-minimal"
                  >
                    <path d="M17 14h.01"></path>
                    <path d="M7 7h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14"></path>
                  </svg>
                  <button className="text-indigo-400 text-sm hover:text-white transition-colors">
                    {currentBaseamount}
                  </button>
                  <button
                    onClick={handleFiftyPercent}
                    className="text-indigo-400 text-sm hover:text-white transition-colors"
                  >
                    50%
                  </button>
                  <button
                    onClick={handleBaseMax}
                    className="text-indigo-400 text-sm hover:text-white transition-colors"
                  >
                    Max
                  </button>
                </div>
              </div>

              {/* Token Selection Box */}
              <details className="w-full">
                <summary className="w-full bg-indigo-900/50 border border-indigo-700/30 border-t-0 rounded-b-lg p-3 flex items-center justify-between cursor-pointer hover:bg-indigo-900/70 transition-colors">
                  <div className="w-full flex items-center gap-2">
                    <button
                      className="w-52 flex items-center gap-2 bg-slate-700 px-4 py-2 rounded-lg hover:bg-slate-600 transition-colors"
                      onClick={() => setIsModalOpen(true)}
                    >
                      {/* Token Image */}
                      <div className="flex-shrink-0">
                        <Image
                          src={selectedToken.icon}
                          className="w-6 h-6"
                          alt={selectedToken.symbol}
                          width={100}
                          height={100}
                        />
                      </div>
                      {/* Token Symbol */}
                      <span className="text-white whitespace-nowrap overflow-hidden overflow-ellipsis">
                        {selectedToken.symbol}
                      </span>
                      {/* Expand Icon */}
                      <span className="material-symbols-outlined text-indigo-300 flex-shrink-0">
                        expand_more
                      </span>
                    </button>

                    {/* Numeric Input */}
                    <input
                      type="number"
                      value={BaseAmount}
                      onChange={handleAmountChange}
                      className="bg-slate-700 px-4 py-2 rounded-lg text-white placeholder-gray-400 hover:bg-slate-600 transition-colors w-full text-right"
                      placeholder="0"
                      disabled={!selectedToken.symbol}
                    />
                  </div>
                </summary>
              </details>

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

						<div className="flex items-center justify-center py-2"><div className="rounded-full bg-[#abc4ff]"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1C245E" className="lucide lucide-plus"><path d="M5 12h14"></path><path d="M12 5v14"></path></svg></div></div>

						<div className="relative">
							{/* Top Bar with Token Type, 50%, and Max */}
							<div className="flex justify-between items-center bg-indigo-900/50 border border-indigo-700/30 rounded-t-lg px-3 py-2">
								<span className="text-indigo-300 text-sm">Quote token</span>
								<div className="flex items-center gap-2">
                  {/* Mini Wallet Icon */}
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-wallet-minimal"><path d="M17 14h.01"></path><path d="M7 7h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14"></path></svg>
                  <button
									className="text-indigo-400 text-sm hover:text-white transition-colors">
										{currentQuoteamount}
									</button>
									<button 
										onClick={handleQuoteFiftyPercent}
										className="text-indigo-400 text-sm hover:text-white transition-colors">
											50%
									</button>
									<button
                  onClick={handleQuoteMax}
                  className="text-indigo-400 text-sm hover:text-white transition-colors">
                    Max
                  </button>
								</div>
							</div>

							{/* Token Selection Box */}
							<details className="w-full">
								<summary className="w-full bg-indigo-900/50 border border-indigo-700/30 border-t-0 rounded-b-lg p-3 flex items-center justify-between cursor-pointer hover:bg-indigo-900/70 transition-colors">
									<div className="w-full flex items-center gap-2">
										<button
											className="w-52 flex items-center gap bg-slate-700 px-4 py-2 rounded-lg hover:bg-slate-600 transition-colors"
											onClick={() => setIsModalQuoteOpen(true)}
										>
											<Image src={selectedQuoteToken.icon} className="w-6 h-6" alt={selectedQuoteToken.symbol} width={100} height={100}/>
											<span className="text-white">&nbsp; {selectedQuoteToken.symbol}</span>
											<span className="material-symbols-outlined text-indigo-300">expand_more</span>
										</button>

										{/* Numeric Input */}
										<input
											type="number"
											value={QuoteAmount}
											onChange={handleQuoteAmountChange}
											className="bg-slate-700 px-4 py-2 rounded-lg text-white placeholder-gray-400 hover:bg-slate-600 transition-colors w-full text-right"
											placeholder="0"
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
								</summary>
							</details>
						</div>

						<div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-indigo-300 text-sm flex items-center gap-1">
                  Initial price
                  <span
                  className="material-symbols-outlined text-indigo-400 text-lg cursor-pointer"
                  onClick={() => setInitialPriceInfo(true)}
                  >
                  info
                </span>
								</label>
                {showInitialPriceInfo && (
                  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-indigo-900/90 p-6 rounded-lg max-w-sm text-indigo-300 text-sm relative">
                      <button
                        className="absolute top-2 right-2 text-indigo-400 hover:text-indigo-200"
                        onClick={() => setInitialPriceInfo(false)}
                      >
                        <span className="material-symbols-outlined">close</span>
                      </button>
                      <p>
                        Initial Price<br></br>is set by the ratio of tokens deposited for initial liquidity.
                      </p>
                    </div>
                  </div>
                )}
                <span className="text-indigo-400 text-sm">{initialPrice} {selectedQuoteToken.symbol}/{selectedToken.symbol}</span>
              </div>
            </div>
            
            <button
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-lg transition-colors"
              disabled={isLoading || !selectedToken.symbol || !selectedQuoteToken.symbol || !BaseAmount || !QuoteAmount}
              onClick={handleInitializeLiquidityPool}
            >
              {isLoading ? "Initializing..." : "Initialize Liquidity Pool"}
            </button>
					</div>
				</div>

				<div className="flex flex-col gap-5 mb-10">
					<h1 className="text-2xl font-bold">How To Create a Liquidity Pool</h1>
					<p className="text-base">1. Select the token that you just created.</p>
					<p className="text-base">2. Enter the amount tokens you would like to include in your liquidity pool. (Recommended 95% or more)</p>
					<p className="text-base">3. Select a base token, SOL is recommended.</p>
					<p className="text-base">4. Enter the amount of SOL you would like to pair with your token. (Recommended 10+ SOL)</p>
					<p className="text-base">6. Click &lsquo;Initialize Liquidity Pool&rsquo; and approve transaction. The cost to create a liquidity pool is 1 SOL + SPL Fees (aprox 1 SOL).</p>
					<p className="text-base">In return, you will receive Liquidity pool tokens. To burn liquidity so it shows locked, head to <a href="https://sol-incinerator.com" target="_blank" rel="noreferrer" className="text-indigo-400 hover:text-indigo-300 transition-colors">sol-incinerator.com</a></p>
					<p className="text-sm text-indigo-300">Note: The amount of SOL you enter as your starting LP determines the starting price of your token.</p>
          <p className="text-sm text-indigo-300">USDC Token doesn&apos;t work on Devnet.</p>
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
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
      <div className="bg-slate-800 rounded-2xl p-6 max-w-md md:max-w-lg lg:max-w-xl mx-auto" style={{ maxHeight: '70vh',width: '40vh', overflow: 'hidden' }}>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl">Select a token</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
  
        {/* Search Bar */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="&#128269;"
            className="w-full p-2 rounded-lg bg-slate-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                    className="w-full flex items-center gap-2 bg-slate-700 px-4 py-2 rounded-lg hover:bg-slate-600 transition-colors"
                  >
                    <Image
                      src={token.icon || "https://www.svgrepo.com/show/508699/landscape-placeholder.svg"}
                      className="w-5 h-5"
                      alt={token.symbol}
                      width={100}
                      height={100}
                    />
                    <span className="text-white">{token.symbol}</span>
                    <span className="text-indigo-400 text-sm ml-auto">
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
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
      <div className="bg-slate-800 rounded-2xl p-6 max-w-md mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl">Select a token</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray-400 mb-3">Popular tokens</p>
          <div className="flex gap-2">
            <button
              onClick={() =>
                handleTokenSelect({
                  symbol: "SOL",
                  icon: "https://cryptologos.cc/logos/solana-sol-logo.png",
                })
              }
              className="flex items-center gap-2 bg-slate-700 px-4 py-2 rounded-lg hover:bg-slate-600 transition-colors"
            >
              <Image
                src="https://cryptologos.cc/logos/solana-sol-logo.png"
                className="w-5 h-5"
                alt="SOL"
                width={100}
                height={100}
              />
              SOL
            </button>
            <button
              onClick={() =>
                handleTokenSelect({
                  symbol: "USDC",
                  icon: "https://assets.coingecko.com/coins/images/6319/thumb/USD_Coin_icon.png",
                })
              }
              className="flex items-center gap-2 bg-slate-700 px-4 py-2 rounded-lg hover:bg-slate-600 transition-colors"
            >
              <Image
                src="https://assets.coingecko.com/coins/images/6319/thumb/USD_Coin_icon.png"
                className="w-5 h-5"
                alt="USDC"
                width={100}
                height={100}
              />
              USDC
            </button>
            <button
              onClick={() =>
                handleTokenSelect({
                  symbol: "USDT",
                  icon: "https://assets.coingecko.com/coins/images/325/thumb/Tether.png",
                })
              }
              className="flex items-center gap-2 bg-slate-700 px-4 py-2 rounded-lg hover:bg-slate-600 transition-colors"
            >
              <Image
                src="https://assets.coingecko.com/coins/images/325/thumb/Tether.png"
                className="w-5 h-5"
                alt="USDT"
                width={100}
                height={100}
              />
              USDT
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