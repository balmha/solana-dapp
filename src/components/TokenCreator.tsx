import React, { useState } from "react";
import ReactDOM from "react-dom";

export const LiquidityPool = () => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedToken, setSelectedToken] = useState({
		symbol: "",
		icon: "data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='12' cy='12' r='12' fill='%23404040'/%3E%3C/svg%3E"
	});

	const [isModalQuoteOpen, setIsModalQuoteOpen] = useState(false);
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

	  return (
		<div className="pb-5 mt-10 px-3 max-w-screen-lg mx-auto grid gap-24">
		  <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
			<div className="flex flex-col gap-16">
			  <div className="grid grid-cols-1 mb-10 sm:mb-16 mx-auto w-[min(468px,100%)]">
				<div className="flex flex-col gap-5 mb-8">
				  <h1 className="text-3xl font-bold">Initialize Liquidity</h1>
				</div>
				<div
				  className="relative cyberpunk-bg-light"
				  style={{
					borderRadius: "21.2px",
					padding: "1.2px",
					backgroundImage:
					  "linear-gradient(var(--gradient-rotate, 246deg), #da2eef 7.97%, #2b6aff 49.17%, #39d0d8 92.1%)",
				  }}
				>
				  <div
					className="flex flex-col relative overflow-hidden height-auto text-foreground box-border outline-none shadow-medium transition-transform-background z-10 bg-cyberpunk-card-bg rounded-[21.2px]"
				  >
					<div className="relative flex w-full flex-auto flex-col place-content-inherit align-items-inherit h-auto break-words text-left overflow-y-auto subpixel-antialiased p-6 mobile:p-4">
					  <form action="#" noValidate>
						<div className="text-sm font-medium mb-4">Initial liquidity</div>
						<div className="bg-[#18174D] rounded-xl">
						  <div className="px-4 py-3 flex justify-between">
							<span className="text-sm text-[rgba(171,196,255,.5)]">Base token</span>
							<div className="flex gap-1">
							  <button
								className="z-0 group relative inline-flex items-center justify-center box-border appearance-none select-none whitespace-nowrap font-normal subpixel-antialiased overflow-hidden outline-none transition-transform-colors-opacity frosted-glass-teal text-xs h-5 min-w-0 px-2 rounded-sm bg-[rgba(20,16,65)] text-[rgba(171,196,255,.5)]"
								type="button"
							  >
								50%
							  </button>
							  <button
								className="z-0 group relative inline-flex items-center justify-center box-border appearance-none select-none whitespace-nowrap font-normal subpixel-antialiased overflow-hidden outline-none transition-transform-colors-opacity frosted-glass-teal text-xs h-5 min-w-0 px-2 rounded-sm bg-[rgba(20,16,65)] text-[rgba(171,196,255,.5)]"
								type="button"
							  >
								Max
							  </button>
							</div>
						  </div>
						  <div className="px-4 py-2 bg-[rgba(20,16,65)] rounded-xl flex">
							<div className="grid items-center bg-[#18174D] rounded-xl py-2 mobile:py-1.5 cursor-pointer px-3 mobile:px-2">
							  <div>
								<div className="text-xs mobile:text-2xs text-[#abc4ff80] mb-1"></div>
								<div className="Row flex items-center gap-2 mobile:gap-1">
								  <div className="CoinAvatar flex items-center">
									<div
									  className="h-8 w-8 relative rounded-full"
									  style={{
										background:
										  "linear-gradient(126.6deg, rgba(171, 196, 255, 0.2) 28.69%, rgba(171, 196, 255, 0) 100%)",
									  }}
									></div>
								  </div>
								  <div className="Icon grid h-max w-max text-[#abc4ff] ml-auto">
									<svg
									  xmlns="http://www.w3.org/2000/svg"
									  fill="none"
									  viewBox="0 0 24 24"
									  strokeWidth="1.5"
									  stroke="currentColor"
									  aria-hidden="true"
									  className="select-none h-4 w-4"
									>
									  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
									</svg>
								  </div>
								</div>
							  </div>
							</div>
							<div className="grow flex items-center justify-center">
							  <input
								className="w-full bg-transparent !outline-none text-2xl font-medium text-right"
								type="number"
								value="343423423422"
							  />
							</div>
						  </div>
						</div>
					  </form>
					</div>
				  </div>
				</div>
			  </div>
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