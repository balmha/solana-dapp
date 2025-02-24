import { Connection, Keypair, PublicKey, Transaction, SystemProgram, sendAndConfirmTransaction } from '@solana/web3.js';
import { createMint, getOrCreateAssociatedTokenAccount, mintTo, setAuthority, AuthorityType, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { createCreateMetadataAccountV2Instruction, DataV2 } from '@metaplex-foundation/mpl-token-metadata';

// Connect to your local testnet
const connection = new Connection('http://localhost:8899', 'confirmed');

// Replace with your dApp owner's wallet public key
const dAppOwnerWallet = new PublicKey('ATo2EwWAem99XinGcpmV8xdSHVaT1cK3Nn5LiEB6fixo');

// Metaplex Token Metadata Program ID
const METAPLEX_PROGRAM_ID = new PublicKey('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s');

export async function createToken(wallet, name, symbol, image, description, decimals, supply, revokeMintAuthority = false) {
    try {
        // Fund the wallet with SOL (for local testnet only)
        await fundWallet(wallet.publicKey);

        // Step 1: Create the Mint Account
        const mintKeypair = Keypair.generate();
        const mintPublicKey = mintKeypair.publicKey;

        const lamports = await connection.getMinimumBalanceForRentExemption(82); // Mint account size

        const createMintAccountIx = SystemProgram.createAccount({
            fromPubkey: wallet.publicKey,
            newAccountPubkey: mintPublicKey,
            lamports,
            space: 82,
            programId: TOKEN_PROGRAM_ID,
        });

        const initMintIx = createMint(
            connection,
            wallet,
            mintPublicKey,
            wallet.publicKey,
            wallet.publicKey,
            decimals
        );

        // Step 2: Create the Token Account
        const tokenAccount = await getOrCreateAssociatedTokenAccount(
            connection,
            wallet,
            mintPublicKey,
            wallet.publicKey
        );

        // Step 3: Mint Tokens to the Token Account
        await mintTo(
            connection,
            wallet,
            mintPublicKey,
            tokenAccount.address,
            wallet.publicKey,
            supply * Math.pow(10, decimals)
        );

        // Step 4: Revoke Freeze Authority
        await setAuthority(
            connection,
            wallet,
            mintPublicKey,
            wallet.publicKey,
            AuthorityType.FreezeAccount,
            null
        );

        // Step 5: Optionally Revoke Mint Authority
        if (revokeMintAuthority) {
            await setAuthority(
                connection,
                wallet,
                mintPublicKey,
                wallet.publicKey,
                AuthorityType.MintTokens,
                null
            );
        }

        // Step 6: Create Token Metadata
        const metadataAccount = await getMetadataAccount(mintPublicKey);
        const metadataData = new DataV2({
            name: name,
            symbol: symbol,
            uri: image, // Use the image URL as the URI
            sellerFeeBasisPoints: 0, // No royalties
            creators: null, // No additional creators
            collection: null, // No collection
            uses: null, // No uses
        });

        const createMetadataIx = createCreateMetadataAccountV2Instruction({
            metadata: metadataAccount,
            mint: mintPublicKey,
            mintAuthority: wallet.publicKey,
            payer: wallet.publicKey,
            updateAuthority: wallet.publicKey,
        }, {
            createMetadataAccountArgsV2: {
                data: metadataData,
                isMutable: true, // Allow metadata to be updated later
            },
        });

        // Step 7: Send Commission Fee to dApp Owner
        const commissionFee = 0.1 * 1e9; // 0.1 SOL in lamports
        const transferIx = SystemProgram.transfer({
            fromPubkey: wallet.publicKey,
            toPubkey: dAppOwnerWallet,
            lamports: commissionFee,
        });

        // Combine all instructions into a single transaction
        const transaction = new Transaction().add(createMintAccountIx, initMintIx, createMetadataIx, transferIx);
        const signature = await sendAndConfirmTransaction(connection, transaction, [wallet, mintKeypair]);

        return {
            success: true,
            message: 'Token created successfully!',
            mintPublicKey: mintPublicKey.toString(),
            tokenAccount: tokenAccount.address.toString(),
            metadataAccount: metadataAccount.toString(),
            transactionSignature: signature,
        };
    } catch (error) {
        return {
            success: false,
            message: 'Token creation failed: ' + error.message,
        };
    }
}

// Helper function to fund the wallet (for local testnet only)
async function fundWallet(walletPublicKey) {
    const airdropSignature = await connection.requestAirdrop(
        walletPublicKey,
        1e9 // 1 SOL in lamports
    );
    await connection.confirmTransaction(airdropSignature);
}

// Helper function to derive the metadata account address
async function getMetadataAccount(mintPublicKey) {
    return (await PublicKey.findProgramAddress(
        [
            Buffer.from('metadata'),
            METAPLEX_PROGRAM_ID.toBuffer(),
            mintPublicKey.toBuffer(),
        ],
        METAPLEX_PROGRAM_ID
    ))[0];
}