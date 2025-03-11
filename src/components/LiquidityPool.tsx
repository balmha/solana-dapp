import React, { useState } from "react";
import ReactDOM from "react-dom";
import Image from 'next/image';

export const LiquidityPool = () => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [amount, setAmount] = useState("");

	const [selectedToken, setSelectedToken] = useState({
		symbol: "",
		icon: "data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='12' cy='12' r='12' fill='%23404040'/%3E%3C/svg%3E"
	});

	const [isModalQuoteOpen, setIsModalQuoteOpen] = useState(false);
	const [QuoteAmount, setQuoteAmount] = useState("");
	const [selectedQuoteToken, setSelectedQuoteToken] = useState({
		symbol: "SOL",
		icon: "https://cryptologos.cc/logos/solana-sol-logo.png",
	});

	// Handler for Token 1 selection
	const handleTokenSelect = (token) => {
		setSelectedToken(token); // Update Token 1
		setIsModalOpen(false); // Close Modal 1
	};

	// Handler for Token 2 selection
	const handleQuoteTokenSelect = (token) => {
		setSelectedQuoteToken(token); // Update Token 2
		setIsModalQuoteOpen(false); // Close Modal 2
	};

	const handleAmountChange = (e) => {
		const value = e.target.value;
		if (/^\d*\.?\d*$/.test(value)) {
		  setAmount(value);
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
		const numericValue = parseFloat(amount); // Convert input value to a number
		if (!isNaN(numericValue)) {
			setAmount((numericValue / 2).toString()); // Divide by 2 and update the state
		}
	  };
	
	  const handleQuoteFiftyPercent = () => {
		const numericValue = parseFloat(QuoteAmount); // Convert input value to a number
		if (!isNaN(numericValue)) {
			setQuoteAmount((numericValue / 2).toString()); // Divide by 2 and update the state
		}
	  };

	return (
		<div id="webcrumbs">
			<div className="bg-gradient-to-br from-indigo-950 via-purple-900 to-indigo-950 p-8 rounded-xl flex gap-8">
				<div className="w-3/2 bg-indigo-950/50 backdrop-blur-sm p-6 rounded-xl border border-indigo-800/30">
					<h2 className="text-white text-2xl font-semibold mb-6">Initialize Liquidity</h2>
					<div className="space-y-6">
						<div className="relative">
							{/* Top Bar with Token Type, 50%, and Max */}
							<div className="flex justify-between items-center bg-indigo-900/50 border border-indigo-700/30 rounded-t-lg px-3 py-2">
								<span className="text-indigo-300 text-sm">Base token</span>
								<div className="flex items-center gap-2">
									<button 
									onClick={handleFiftyPercent}
									className="text-indigo-400 text-sm hover:text-white transition-colors">
										50%
									</button>
									<button className="text-indigo-400 text-sm hover:text-white transition-colors">Max</button>
								</div>
							</div>

							{/* Token Selection Box */}
							<details className="w-full">
								<summary className="w-full bg-indigo-900/50 border border-indigo-700/30 border-t-0 rounded-b-lg p-3 flex items-center justify-between cursor-pointer hover:bg-indigo-900/70 transition-colors">
									<div className="w-full flex items-center gap-2">
										<button
											className="w-52 flex items-center gap bg-slate-700 px-4 py-2 rounded-lg hover:bg-slate-600 transition-colors"
											onClick={() => setIsModalOpen(true)}
										>
											<Image src={selectedToken.icon} className="w-6 h-6" alt={selectedToken.symbol} width={100} height={100}/>
											<span className="text-white">&nbsp; {selectedToken.symbol}</span>
											<span className="material-symbols-outlined text-indigo-300">expand_more</span>
										</button>

										{/* Numeric Input */}
										<input
											type="number"
											value={amount}
											onChange={handleAmountChange}
											className="bg-slate-700 px-4 py-2 rounded-lg text-white placeholder-gray-400 hover:bg-slate-600 transition-colors w-full text-right"
											placeholder="0"
											disabled={!selectedToken.symbol}
										/>

										{isModalOpen && (
											<LiquidityTokenSelec
												onClose={() => setIsModalOpen(false)}
												onSelectToken={handleTokenSelect}
											/>
										)}
									</div>
								</summary>
							</details>
						</div>

						<div className="flex items-center justify-center py-2"><div className="rounded-full bg-[#abc4ff]"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1C245E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-plus"><path d="M5 12h14"></path><path d="M12 5v14"></path></svg></div></div>

						<div className="relative">
							{/* Top Bar with Token Type, 50%, and Max */}
							<div className="flex justify-between items-center bg-indigo-900/50 border border-indigo-700/30 rounded-t-lg px-3 py-2">
								<span className="text-indigo-300 text-sm">Quote token</span>
								<div className="flex items-center gap-2">
									<button 
										onClick={handleQuoteFiftyPercent}
										className="text-indigo-400 text-sm hover:text-white transition-colors">
											50%
									</button>
									<button className="text-indigo-400 text-sm hover:text-white transition-colors">Max</button>
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
										/>

										{isModalQuoteOpen && (
											<LiquidityTokenSelec
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
									<span className="material-symbols-outlined text-indigo-400 text-lg">info</span>
								</label>
								<span className="text-indigo-400 text-sm">SOL/</span>
							</div>
						</div>

						<div>
							<div className="flex items-center justify-between mb-2">
								<label className="text-indigo-300 text-sm flex items-center gap-1">
									Fee Tier
									<span className="material-symbols-outlined text-indigo-400 text-lg">info</span>
								</label>
							</div>
							<details className="w-full">
								<summary className="w-full bg-indigo-900/50 border border-indigo-700/30 rounded-lg p-3 flex items-center justify-between cursor-pointer hover:bg-indigo-900/70 transition-colors">
									<span className="text-white">0.25%</span>
									<span className="material-symbols-outlined text-indigo-300">expand_more</span>
								</summary>
							</details>
						</div>

						<button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-lg transition-colors">
							Initialize Liquidity Pool
						</button>
					</div>
				</div>

				<div className="w-2/3 flex flex-col gap-5 mb-10">
					<h1 className="text-2xl font-bold">How To Create a Liquidity Pool</h1>
					<p className="text-base">Select the token that you just created.</p>
					<p className="text-base">Enter the amount tokens you would like to include in your liquidity pool. (Recommended 95% or more)</p>
					<p className="text-base">Select a base token, SOL is recommended.</p>
					<p className="text-base">Enter the amount of SOL you would like to pair with your token. (Recommended 10+ SOL)</p>
					<p className="text-base">Select your LP fees. This is a small amount of each transaction that goes back to growing your tokens liquidity pool. (Recommended 0.25%)</p>
					<p className="text-base">Click &lsquo;Initialize Liquidity Pool&rsquo; and approve transaction. The cost to create a liquidity pool is 5 SOL.</p>
					<p className="text-base">In return, you will receive Liquidity pool tokens. To burn liquidity so it shows locked, head to <a href="https://sol-incinerator.com" target="_blank" rel="noreferrer" className="text-indigo-400 hover:text-indigo-300 transition-colors">sol-incinerator.com</a></p>
					<p className="text-sm text-indigo-300">Note: The amount of SOL you enter as your starting LP determines the starting price of your token.</p>
				</div>
			</div>
		</div>
	);
};

export const LiquidityTokenSelec = ({ onClose, onSelectToken }) => {
	const handleTokenSelect = (token) => {
		onSelectToken(token); // Update the parent component with the selected token
		onClose(); // Close the modal
	};

	return ReactDOM.createPortal(
		<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
			<div className="bg-slate-800 rounded-2xl p-6 max-w-md mx-auto">
				<div className="flex justify-between items-center mb-6">
					<h3 className="text-xl">Select a token</h3>
					<button
						onClick={onClose}
						className="text-gray-400 hover:text-white transition-colors"
					>
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

export default LiquidityPool;