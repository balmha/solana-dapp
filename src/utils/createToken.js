import {
  Connection,
  Keypair,
  PublicKey,
  Transaction,
  SystemProgram,
} from "@solana/web3.js";
import {
  createInitializeMintInstruction,
  createAssociatedTokenAccountInstruction,
  createMintToInstruction,
  getMinimumBalanceForRentExemptMint,
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  MINT_SIZE,
  createSetAuthorityInstruction,  
  AuthorityType,
} from "@solana/spl-token";
import { createCreateMetadataAccountV3Instruction } from "@metaplex-foundation/mpl-token-metadata";

// Import Axios for uploading images to IPFS
const axios = require('axios');

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
      return connection;
    } catch (error) {
      continue; // Try the next endpoint
    }
  }
  throw new Error("All RPC endpoints failed");
};

export async function createToken(
  networkConfiguration, publicKey, signTransaction, name, symbol, image, description="", decimals, supply, revokeMintAuthority = false, website="", twitter="", telegram=""
) {
  try {
    if (!publicKey || !signTransaction) {
      throw new Error("Wallet not connected or signTransaction unavailable.");
    }

    // Base fee commission in SOL
    const BASE_FEE_COMMISSION = 0.1;
    // Calculate the total fee commission
    let feeComission = BASE_FEE_COMMISSION;
    if (revokeMintAuthority) {
      feeComission += 0.1; // Add 0.1 SOL if revokeMintAuthority is true
    }
    
    // Create a connection dynamically with fallback
    const connection = await createConnection(networkConfiguration);

    // Step 1: Check wallet balance
    const balance = await connection.getBalance(publicKey);
    if (balance < feeComission * 1e9) { // Ensure wallet has minimum balance
      throw new Error("Insufficient SOL balance.");
    }

    //Upload Image and Metadata to Pinata
    const ImageURL = await uploadImageToIPFS(image, networkConfiguration);

    // Step 2: Create the metadata JSON
    const metadata = {
      name: name,
      symbol: symbol,
      image: ImageURL, // Use the image URI from Pinata
      description: description,
      extensions: {
        website: website, // Replace with your website
        twitter: twitter, // Replace with your Twitter
        telegram: telegram // Replace with your Telegram
      },
      creator: {
        name: "SPLForge", // Replace with your creator name
        site: "https://splforge.xyz" // Replace with your creator site
      }
    };

    // Step 3: Upload the metadata JSON to Pinata
    const metadataUri = await uploadMetadataToIPFS(metadata, networkConfiguration);

    // Step 1: Generate a new mint keypair
    const mintKeypair = Keypair.generate();
    const mintPublicKey = mintKeypair.publicKey;

    // Step 2: Get minimum rent exemption for mint account
    const lamports = await getMinimumBalanceForRentExemptMint(connection);

    // Step 3: Create transaction instructions
    const instructions = [];

    // 1️⃣ Create Mint Account (SystemProgram.createAccount)
    instructions.push(
      SystemProgram.createAccount({
        fromPubkey: publicKey,
        newAccountPubkey: mintPublicKey,
        space: MINT_SIZE,
        lamports,
        programId: TOKEN_PROGRAM_ID,
      })
    );

    // 2️⃣ Initialize Mint (createInitializeMintInstruction)
    instructions.push(
      createInitializeMintInstruction(mintPublicKey, decimals, publicKey, publicKey)
    );

    // 3️⃣ Create Token Account for Mint (Associated Token Account)
    const associatedTokenAccount = await PublicKey.findProgramAddress(
      [publicKey.toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), mintPublicKey.toBuffer()],
      ASSOCIATED_TOKEN_PROGRAM_ID
    );

    instructions.push(
      createAssociatedTokenAccountInstruction(
        publicKey, // Payer
        associatedTokenAccount[0], // Associated Token Account
        publicKey, // Token Owner
        mintPublicKey, // Mint Address
        TOKEN_PROGRAM_ID,
        ASSOCIATED_TOKEN_PROGRAM_ID
      )
    );

    const mintAmount = BigInt(Number(supply) * Math.pow(10, Number(decimals)));

    // 4 Mint Tokens (mintTo instruction)
    instructions.push(
      createMintToInstruction(
        mintPublicKey, // Mint
        associatedTokenAccount[0], // Token Account
        publicKey, // Owner
        mintAmount // Amount
      )
    );

    // 5 Create Token Metadata
    const TOKEN_METADATA_PROGRAM_ID = new PublicKey(
      "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s",
    );
    
    const metadataData = {
      name: name,
      symbol: symbol,
      uri: metadataUri,
      sellerFeeBasisPoints: 0,
      creators: null,
      collection: null,
      uses: null,
    };

    const metadataPDAAndBump = PublicKey.findProgramAddressSync(
      [
        Buffer.from("metadata"),
        TOKEN_METADATA_PROGRAM_ID.toBuffer(),
        mintPublicKey.toBuffer(),
      ],
      TOKEN_METADATA_PROGRAM_ID,
    );
    const metadataPDA = metadataPDAAndBump[0];

    const createMetadataAccountInstruction = createCreateMetadataAccountV3Instruction({
        metadata: metadataPDA,
        mint: mintPublicKey,
        mintAuthority: publicKey,
        payer: publicKey,
        updateAuthority: publicKey,
      },
      {
        createMetadataAccountArgsV3: {
          collectionDetails: null,
          data: metadataData,
          isMutable: false,
        },
      },
    );

    instructions.push(createMetadataAccountInstruction);
    //

    // 6 Revoke Mint Authority (if revokeMintAuthority is true)
    if (revokeMintAuthority) {
      instructions.push(
        createSetAuthorityInstruction(
          mintPublicKey, // Mint account
          publicKey, // Current mint authority
          AuthorityType.MintTokens, // Authority type
          null // New authority (null to revoke)
        )
      );
    }

    // 7 Revoke Freeze Authority
    instructions.push(
      createSetAuthorityInstruction(
        mintPublicKey, // Mint account
        publicKey, // Current freeze authority
        AuthorityType.FreezeAccount, // Authority type
        null // New authority (null to revoke)
      )
    );

    // 8 Add Commission Transfer Instruction
    const commissionReceiver = new PublicKey("3ywTFVHbbpVQK6qajYH3hpmZYC2TKQLUYvgeGvFp3myN");

    const commissionIx = SystemProgram.transfer({
      fromPubkey: publicKey,
      toPubkey: commissionReceiver,
      lamports: Math.round(feeComission * 1e9), // Convert SOL to lamports (1 SOL = 1,000,000,000 lamports)
    });

    // Add Commission Transfer to Transaction
    instructions.push(commissionIx);

    // Step 4: Create transaction
    const transaction = new Transaction().add(...instructions);
    transaction.feePayer = publicKey;
    transaction.recentBlockhash = (await connection.getRecentBlockhash()).blockhash;

    // ✅ SIGN WITH MINT KEYPAIR FIRST
    transaction.sign(mintKeypair);

    // Step 5: Sign transaction using wallet adapter
    const signedTransaction = await signTransaction(transaction);

    // Step 6: Send the signed transaction
    const signature = await connection.sendRawTransaction(signedTransaction.serialize(), {
      skipPreflight: false,
      preflightCommitment: "confirmed",
    });

    // Step 7: Confirm transaction
    await connection.confirmTransaction(signature, "confirmed");

    console.log("Token created successfully!");
    console.log(`Transaction Signature: https://explorer.solana.com/tx/${signature}?cluster=${networkConfiguration}`);

    return {
      success: true,
      message: "Token created successfully!",
      networkConfiguration: networkConfiguration.toString(),
      transactionSignature: signature.toString(),
      mintAddress: mintPublicKey.toString(),
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }
}

export async function uploadImageToIPFS(image, networkConfiguration) {
  if (!image) {
    return "";
  }

  // Determine the correct Pinata API keys based on the network configuration
  const pinataApiKey = networkConfiguration === "mainnet-beta"
    ? process.env.NEXT_PUBLIC_PINATA_API_KEY_PROD
    : process.env.NEXT_PUBLIC_PINATA_API_KEY;

  const pinataSecretApiKey = networkConfiguration === "mainnet-beta"
    ? process.env.NEXT_PUBLIC_PINATA_SECRET_KEY_PROD
    : process.env.NEXT_PUBLIC_PINATA_SECRET_KEY;

  const base64Data = image.split(',')[1];
  const binaryData = Buffer.from(base64Data, 'base64');
  
  // Create a Blob from the binary data
  const blob = new Blob([binaryData], { type: 'image/webp' });

  const url = 'https://api.pinata.cloud/pinning/pinFileToIPFS';
  const data = new FormData();
  data.append('file', blob, 'image.webp');

  const response = await axios.post(url, data, {
    maxContentLength: 'Infinity',
    headers: {
      'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
      'pinata_api_key': pinataApiKey,
      'pinata_secret_api_key': pinataSecretApiKey,
    },
  });

  const ipfsHash = response.data.IpfsHash;
  const ipfsUrl = `https://ipfs.io/ipfs/${ipfsHash}`;
  return ipfsUrl;
}

export async function uploadMetadataToIPFS(metadata, networkConfiguration) {
  try {
    // Determine the correct Pinata API keys based on the network configuration
    const pinataApiKey = networkConfiguration === "mainnet-beta"
      ? process.env.NEXT_PUBLIC_PINATA_API_KEY_PROD
      : process.env.NEXT_PUBLIC_PINATA_API_KEY;

    const pinataSecretApiKey = networkConfiguration === "mainnet-beta"
      ? process.env.NEXT_PUBLIC_PINATA_SECRET_KEY_PROD
      : process.env.NEXT_PUBLIC_PINATA_SECRET_KEY;

    // Convert metadata JSON to a Buffer
    const jsonBuffer = Buffer.from(JSON.stringify(metadata));

    // Create a Blob from the JSON Buffer
    const blob = new Blob([jsonBuffer], { type: 'application/json' });

    const url = 'https://api.pinata.cloud/pinning/pinFileToIPFS';
    const data = new FormData();
    data.append('file', blob, 'metadata.json');

    const response = await axios.post(url, data, {
      maxContentLength: 'Infinity',
      headers: {
        'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
        'pinata_api_key': pinataApiKey,
        'pinata_secret_api_key': pinataSecretApiKey,
      },
    });

    const ipfsHash = response.data.IpfsHash;
    const ipfsUrl = `https://ipfs.io/ipfs/${ipfsHash}`;
    return ipfsUrl;
  } catch (error) {
    throw error;
  }
}