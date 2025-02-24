import React, { useState } from "react";
import ReactDOM from "react-dom";
import UploadFile from "./UploadFile";
import {createToken} from "../utils/createToken";

export const LiquidityPool = () => {
	const [toggleEnabled, setToggleEnabled] = useState(false);
	const [showMintInfo, setMintInfo] = useState(false);
	const [showFreezeInfo, setFreezeInfo] = useState(false);
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
				<div className="w-1/2 bg-indigo-950/50 backdrop-blur-sm p-6 rounded-xl border border-indigo-800/30">
					<div className="flex flex-col gap-5">
						<h1 className="text-3xl font-bold">Solana Token Creator</h1>
						<p className="text-base">
							The perfect tool to create Solana SPL tokens.
							<br />
							Simple, user friendly, and fast.
						</p>
						<br />
					</div>
					<div className="space-y-6">
						{/* Name and Symbol Inputs (Same Level) */}
						<div className="grid grid-cols-2 gap-4">
							{/* Token Name Input */}
							<div className="relative">
								<div className="flex justify-between items-center bg-indigo-900/50 border border-indigo-700/30 rounded-t-lg px-3 py-1">
									<span className="text-indigo-300 text-sm">Name</span>
								</div>
								<input
									type="text"
									placeholder="Enter token name"
									className="w-full bg-slate-700 px-4 py-3 rounded-b-lg text-white placeholder-gray-400 hover:bg-slate-600 transition-colors"
								/>
							</div>

							{/* Token Symbol Input */}
							<div className="relative">
								<div className="flex justify-between items-center bg-indigo-900/50 border border-indigo-700/30 rounded-t-lg px-3 py-1">
									<span className="text-indigo-300 text-sm">Symbol</span>
								</div>
								<input
									type="text"
									placeholder="Enter token symbol"
									className="w-full bg-slate-700 px-4 py-3 rounded-b-lg text-white placeholder-gray-400 hover:bg-slate-600 transition-colors"
								/>
							</div>
						</div>

						{/* Decimals and Supply Inputs */}
						<div className="grid grid-cols-2 gap-4">
							{/* Decimals Input */}
							<div className="relative">
								<div className="flex justify-between items-center bg-indigo-900/50 border border-indigo-700/30 rounded-t-lg px-3 py-1">
									<span className="text-indigo-300 text-sm">Decimals</span>
								</div>
								<input
									type="number"
									placeholder="Enter decimals (e.g., 6)"
									className="w-full bg-slate-700 px-4 py-3 rounded-b-lg text-white placeholder-gray-400 hover:bg-slate-600 transition-colors"
									min="0"
									max="9"
								/>
							</div>

							{/* Total Supply Input */}
							<div className="relative">
								<div className="flex justify-between items-center bg-indigo-900/50 border border-indigo-700/30 rounded-t-lg px-3 py-1">
									<span className="text-indigo-300 text-sm">Supply</span>
									<div className="flex items-center gap-2">
										<button
											onClick={() => console.log("50% clicked")}
											className="text-indigo-400 text-sm hover:text-white transition-colors"
										>
											50%
										</button>
										<button
											onClick={() => console.log("Max clicked")}
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
								/>
							</div>
						</div>

						{/* Token Image Upload (Same Size as Decimals + Supply) */}
						<div className="relative">
							<div className="flex justify-between items-center bg-indigo-900/50 border border-indigo-700/30 rounded-t-lg px-3 py-1">
								<span className="text-indigo-300 text-sm">Image</span>
							</div>
							<div className="w-full bg-slate-700 px-4 py-2 rounded-b-lg text-white placeholder-gray-400 hover:bg-slate-600 transition-colors">
								<div className="w-full h-24 flex items-center justify-center rounded-lg border-2 border-dashed border-indigo-700/30 cursor-pointer">
									<UploadFile />
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
							/>
						</div>

						{/* Revoke Freeze Authority (Required, Cannot Be Turned Off) */}
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-2">
								<span className="text-indigo-300 text-sm">Revoke Freeze Authority (Required)</span>
								<span
									className="material-symbols-outlined text-indigo-400 text-lg cursor-pointer"
									onClick={() => setFreezeInfo(true)}
									>
									info
								</span>
								{/* Info Label (Conditionally Rendered) */}
								{showFreezeInfo && (
									<div
									className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
									onClick={() => setFreezeInfo(false)}
								  >
									<div
									  className="bg-indigo-900/90 p-6 rounded-lg max-w-sm text-indigo-300 text-sm relative"
									  onClick={(e) => e.stopPropagation()} // Prevent modal from closing when clicking inside
									>
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
							<div className="text-indigo-400 text-sm">(0.1 SOL)</div>
						</div>

						{/* Revoke Mint Authority (Optional) */}
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-2">
								<span className="text-indigo-300 text-sm">Revoke Mint Authority</span>
								<span
									className="material-symbols-outlined text-indigo-400 text-lg cursor-pointer"
									onClick={() => setMintInfo(true)}
									>
									info
								</span>
								{/* Info Label (Conditionally Rendered) */}
								{showMintInfo && (
									<div
									className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
									onClick={() => setMintInfo(false)}
								  >
									<div
									  className="bg-indigo-900/90 p-6 rounded-lg max-w-sm text-indigo-300 text-sm relative"
									  onClick={(e) => e.stopPropagation()} // Prevent modal from closing when clicking inside
									>
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
									className={`w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform peer-checked:translate-x-4 ${
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
							onClick={() => console.log("Create Token clicked")}
						>
							Create Token
						</button>
					</div>
				</div>

				<div className="w-2/3 flex flex-col gap-5 mb-10">
					<h1 className="text-xl font-bold">Create Solana Token</h1>
					<p className="text-base">Effortlessly create your Solana SPL Token with our 7+1 step process – no coding required.</p>
					<p className="text-base">Customize your Solana Token exactly the way you envision it. Less than 5 minutes, at an affordable cost.</p><br></br>
					<h2 className="text-xl font-bold">How to use Solana Token Creator</h2>
					<p className="text-base">1. Connect your Solana wallet.</p>
					<p className="text-base">2. Specify the desired name for your Token</p>
					<p className="text-base">3. Indicate the symbol (max 8 characters).</p>
					<p className="text-base">4. Select the decimals quantity (default recommended 6 for all tokens)</p>
					<p className="text-base">5. Determine the Supply of your Token.</p>
					<p className="text-base">6. Upload the image for your token (PNG).</p>
					<p className="text-base">7. Provide a brief description for your SPL Token.</p>
					<p className="text-base">8. Click on create, accept the transaction and wait until your tokens ready.</p>
					<p className="text-base">The cost of Token creation is 0.3 SOL, covering all fees for SPL Token Creation.</p><br></br>
					<h2 className="text-xl font-bold">Revoke Freeze Authority:</h2>
					<p className="text-base text-indigo-300">If you want to create a liquidity pool you will need to "Revoke Freeze Authority" of the Token, you can do that here. The cost is 0.1 SOL.</p>
					<h2 className="text-xl font-bold">Revoke Mint Authority:</h2>
					<p className="text-base text-indigo-300">Revoking mint authority ensures that there can be no more tokens minted than the total supply. This provides security and peace of mind to buyers. The cost is 0.1 SOL</p><br></br>
					<p className="text-base">Once the creation process starts, it will only take a few seconds! Once complete, you will receive the total supply of the token in your wallet.</p>
					<p className="text-base">With our user-friendly platform, managing your tokens is simple and affordable.</p>
					<p className="text-base">You can choose to revoke mint authority later if you choose</p>
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
							<img
								src="https://cryptologos.cc/logos/solana-sol-logo.png"
								className="w-5 h-5"
								alt="SOL"
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
							<img
								src="https://assets.coingecko.com/coins/images/6319/thumb/USD_Coin_icon.png"
								className="w-5 h-5"
								alt="USDC"
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
							<img
								src="https://assets.coingecko.com/coins/images/325/thumb/Tether.png"
								className="w-5 h-5"
								alt="USDT"
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