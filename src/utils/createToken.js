import {
  Connection,
  clusterApiUrl,
  Keypair,
  PublicKey,
  Transaction,
  SystemProgram,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import {
  createInitializeMintInstruction,
  createAssociatedTokenAccountInstruction,
  createMintToInstruction,
  getMinimumBalanceForRentExemptMint,
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  MINT_SIZE,
} from "@solana/spl-token";
import { createCreateMetadataAccountV3Instruction } from "@metaplex-foundation/mpl-token-metadata";
// Import Axios and FormData for uploading images to IPFS

// Connect to your local testnet
const axios = require('axios');

const pinataApiKey = '8e76c6221d1fe496b63c';
const pinataSecretApiKey = 'fe92c34f7273955be202f5d8e801988eef77a2928eee76e36476cac3e52d0206';
const connection = new Connection("https://api.testnet.solana.com", "confirmed");

export async function createToken(
  publicKey, signTransaction, name, symbol, image, description, decimals, supply, revokeMintAuthority = false
) {
  try {
    if (!publicKey || !signTransaction) {
      throw new Error("Wallet not connected or signTransaction unavailable.");
    }

    // Step 1: Check wallet balance
    const balance = await connection.getBalance(publicKey);

    if (balance < 0.1 * 1e9) { // Ensure wallet has at least 0.1 SOL
      throw new Error("Insufficient SOL balance.");
    }

    // Step 1: Generate a new mint keypair
    const mintKeypair = Keypair.generate();
    const mintPublicKey = mintKeypair.publicKey;

    console.log("Mint Public Key:", mintPublicKey.toBase58());

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

    // 4️⃣ Mint Tokens (mintTo instruction)
    instructions.push(
      createMintToInstruction(
        mintPublicKey, // Mint
        associatedTokenAccount[0], // Token Account
        publicKey, // Owner
        mintAmount // Amount
      )
    );

    const ImageURL = await uploadImageToIPFS(image);

    //
    const TOKEN_METADATA_PROGRAM_ID = new PublicKey(
      "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s",
    );
    
    console.log("Image:", ImageURL);
    console.log("Description:", description);
    console.log("name:", name);
    console.log("symbol:", symbol);
    
    const metadataData = {
      name: name,
      symbol: symbol,
      uri: ImageURL,
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
          isMutable: true,
        },
      },
    );

    instructions.push(createMetadataAccountInstruction);
    //

    const commissionReceiver = new PublicKey("ATo2EwWAem99XinGcpmV8xdSHVaT1cK3Nn5LiEB6fixo");

    const commissionIx = SystemProgram.transfer({
      fromPubkey: publicKey,
      toPubkey: commissionReceiver,
      lamports: 0.1 * 1e9, // Convert SOL to lamports (1 SOL = 1,000,000,000 lamports)
    });

    // Add Commission Transfer to Transaction
    instructions.push(commissionIx);

    console.log("Instructions:", instructions);

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
    console.log(`Transaction Signature: https://explorer.solana.com/tx/${signature}?cluster=testnet`);

    return {
      success: true,
      message: "Token created successfully!",
      mintPublicKey: mintPublicKey.toString(),
      tokenAccount: associatedTokenAccount[0].toString(),
      transactionSignature: signature.toString(),
    };
  } catch (error) {
    console.error("Error creating token:", error);
    return {
      success: false,
      message: "Token creation failed: " + error.message,
    };
  }
}

export async function uploadImageToIPFS(image) {
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
  console.log('Image uploaded to IPFS. URL:', ipfsUrl);
  return ipfsUrl;
}