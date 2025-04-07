import { Connection, clusterApiUrl, PublicKey} from "@solana/web3.js";
import {
  Raydium,
  TxVersion,
  ApiV3PoolInfoStandardItemCpmm,
  Percent,
  CpmmKeys} from "@raydium-io/raydium-sdk-v2"; // Ensure you're using the correct package
import BN from 'bn.js'
import { isValidCpmm } from './utils'

// Define a function to get the RPC endpoint based on the network configuration
const getRpcEndpoint = (networkConfiguration) => {
  switch (networkConfiguration) {
    case "mainnet-beta":
      return [
        process.env.NEXT_PUBLIC_MAINNET_CHAINSTACK,
        process.env.NEXT_PUBLIC_MAINNET_ALCHEMY,
      ];
    case "devnet":
      return [process.env.NEXT_PUBLIC_DEVNET];
    case "testnet":
      return ["https://api.testnet.solana.com"];
    default:
      throw new Error(`Unknown network: ${networkConfiguration}`);
  }
};

// Example function to demonstrate dynamic connection usage
const createConnection = async (networkConfiguration) => {
  const endpoints = getRpcEndpoint(networkConfiguration); // Always returns an array

  for (const endpoint of endpoints) {
    try {
      const connection = new Connection(endpoint, "confirmed");
      // Test the connection
      await connection.getEpochInfo(); // Simple request to check if the endpoint is working
      console.log("Connected to RPC endpoint:", endpoint);
      return connection;
    } catch (error) {
      console.error("Failed to connect to RPC endpoint:", endpoint, error);
      continue; // Try the next endpoint
    }
  }
  throw new Error("All RPC endpoints failed");
};

function toExactAmount(amount: number | string, decimals: number): BN {
  const amountStr = typeof amount === 'number' ? amount.toString() : amount;
  const [whole, fraction = ''] = amountStr.split('.');
  
  // Pad fraction to exact decimals and trim excess
  const paddedFraction = fraction.padEnd(decimals, '0').slice(0, decimals);
  
  // Combine whole + fraction and convert to BN
  return new BN(whole + paddedFraction);
}

export async function createPoolAndAddLiquidityWithFee(
  networkConfiguration,
  publicKey,
  signAllTransactions,
  quoteTokenMint,
  quoteTokenAmount,
  feeAmountLamports: number, // SOL fee amount in lamports
  feeRecipient: PublicKey // Your wallet address to receive fees
) {
  try {
    if (!publicKey || !signAllTransactions) {
      throw new Error("Wallet not connected or signTransaction unavailable.");
    }
    let poolId = "asdasdasdasdasdasdsad"
    // Create a connection dynamically with fallback
    const connection = await createConnection(networkConfiguration);
    
    // 1. Initialize Raydium SDK
    const raydium = await initSdk(connection, publicKey, networkConfiguration, signAllTransactions)

    const quoteTokenInfo = await raydium.token.getTokenInfo(quoteTokenMint.toString())
    
    const QuoteAtomic = await toExactAmount(quoteTokenAmount, quoteTokenInfo.decimals);

    // Validate amounts
    if (QuoteAtomic.lten(0)) {
      throw new Error("Amounts must be positive");
    }

    // Execute and wait for confirmation
    //console.log(extInfo.address.poolId.toString())
    // Wait for some time (optional)
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    let poolInfo: ApiV3PoolInfoStandardItemCpmm
    let poolKeys: CpmmKeys | undefined

    const data = await raydium.cpmm.getPoolInfoFromRpc(poolId)
    poolInfo = data.poolInfo
    poolKeys = data.poolKeys

    if (raydium.cluster === 'devnet') {
      if (!isValidCpmm(poolInfo.programId)) throw new Error('target pool is not CPMM pool')
    }

    if (!poolInfo) throw new Error('Pool not found after creation');

    // 3. Add liquidity in separate transaction
    const { execute: addLiquidityExecute } = await raydium.cpmm.addLiquidity({
      poolInfo,
      poolKeys,
      inputAmount: QuoteAtomic,
      slippage: new Percent(1, 100),
      baseIn: true,
      txVersion: TxVersion.V0
    });

    const { txId: liquidityTxId } = await addLiquidityExecute({ sendAndConfirm: true });
    console.log('pool deposited', { txId: `https://explorer.solana.com/tx/${liquidityTxId}?cluster=${networkConfiguration}` })
    
    return {
      success: true,
      liquidityTxId,
      poolId: poolId,
      AddedLiqID: liquidityTxId,
    };
  } catch (error) {
    console.error('Error in combined transaction:', error);
    return {
      success: false,
      error: error.message,
    };
  }
}

export const initSdk = async (connection, publicKey, networkConfiguration, signAllTransactions) => {
  if (connection.rpcEndpoint === clusterApiUrl('mainnet-beta'))
    console.warn('using free rpc node might cause unexpected error, strongly suggest uses paid rpc node')
  const raydium = await Raydium.load({
    connection,
    owner: publicKey, // Pass the wallet's public key
    cluster: networkConfiguration,
    signAllTransactions, // Pass the sign function
    disableFeatureCheck: true, // Optional: Disable feature checks
    disableLoadToken: true, // Optional: Disable token loading
  })

  return raydium
}