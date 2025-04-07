import { Connection, clusterApiUrl, PublicKey} from "@solana/web3.js";
import {
  Raydium,
  TxVersion,
  CREATE_CPMM_POOL_PROGRAM,
  CREATE_CPMM_POOL_FEE_ACC,
  DEVNET_PROGRAM_ID,
  getCpmmPdaAmmConfigId} from "@raydium-io/raydium-sdk-v2"; // Ensure you're using the correct package
import BN from 'bn.js'

// Define a function to get the RPC endpoint based on the network configuration
const getRpcEndpoint = (networkConfiguration) => {
  switch (networkConfiguration) {
    case "mainnet-beta":
      return [
        process.env.NEXT_PUBLIC_MAINNET_ALCHEMY,
        process.env.NEXT_PUBLIC_MAINNET_CHAINSTACK,
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
  baseTokenMint,
  quoteTokenMint,
  baseTokenDecimals,
  baseTokenAmount,
  quoteTokenAmount,
  feeAmountLamports: number, // SOL fee amount in lamports
  feeRecipient: PublicKey // Your wallet address to receive fees
) {
  try {
    if (!publicKey || !signAllTransactions) {
      throw new Error("Wallet not connected or signTransaction unavailable.");
    }
    // Create a connection dynamically with fallback
    const connection = await createConnection(networkConfiguration);
    
    // 1. Initialize Raydium SDK
    const raydium = await initSdk(connection, publicKey, networkConfiguration, signAllTransactions)

    // 2. Prepare token info
    const baseTokenInfo = {
      address: baseTokenMint.toString(),
      programId: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
      decimals: baseTokenDecimals,
    };
    const quoteTokenInfo = await raydium.token.getTokenInfo(quoteTokenMint.toString())

    // Convert amounts with perfect precision
    const baseAtomic = await toExactAmount(baseTokenAmount, baseTokenDecimals);
    const QuoteAtomic = await toExactAmount(quoteTokenAmount, quoteTokenInfo.decimals);

    // Validate amounts
    if (baseAtomic.lten(0) || QuoteAtomic.lten(0)) {
      throw new Error("Amounts must be positive");
    }

    // 3. Get fee config
    const feeConfigs = await raydium.api.getCpmmConfigs()
    if (raydium.cluster === 'devnet') {
      feeConfigs.forEach((config) => {
        config.id = getCpmmPdaAmmConfigId(DEVNET_PROGRAM_ID.CREATE_CPMM_POOL_PROGRAM, config.index).publicKey.toBase58()
      })
    }

    const txTipConfig = {
      feePayer: publicKey,
      address: feeRecipient,
      amount: feeAmountLamports,
    }

    // 4. Create pool instruction
    const { execute: createPoolExecute, extInfo } = await raydium.cpmm.createPool({
      programId: (raydium.cluster == 'devnet') ? DEVNET_PROGRAM_ID.CREATE_CPMM_POOL_PROGRAM : CREATE_CPMM_POOL_PROGRAM,
      poolFeeAccount: (raydium.cluster == 'devnet') ? DEVNET_PROGRAM_ID.CREATE_CPMM_POOL_FEE_ACC : CREATE_CPMM_POOL_FEE_ACC,
      mintA: baseTokenInfo, // Use `mintA` instead of `baseTokenInfo`
      mintB: quoteTokenInfo, // Use `mintB` instead of `quoteTokenInfo`
      mintAAmount: baseAtomic,
      mintBAmount: QuoteAtomic,
      startTime: new BN(0),
      feeConfig: feeConfigs[0],
      associatedOnly: false,
      ownerInfo: {
        useSOLBalance: true,
      },
      txTipConfig: txTipConfig,
      txVersion: TxVersion.V0,
    });

    // 5. Get the unsigned transaction (FIXED VERSION)
    const { txId, signedTx } = await createPoolExecute({ sendAndConfirm: true });

    console.log('pool created', {
      txId,
      poolKeys: Object.keys(extInfo.address).reduce(
        (acc, cur) => ({
          ...acc,
          [cur]: extInfo.address[cur as keyof typeof extInfo.address].toString(),
        }),
        {}
      ),
    })
    console.log('Pool created at', { txId: `https://explorer.solana.com/tx/${txId}?cluster=${networkConfiguration}` })
    
    return {
      success: true,
      txId,
      poolId: extInfo.address.poolId.toString(),
    };
  } catch (error) {
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