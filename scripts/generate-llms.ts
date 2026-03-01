import * as fs from 'fs';
import * as path from 'path';
import { faqItems } from '../src/content/faq';
import { tokenCreatorInstructions, liquidityPoolInstructions } from '../src/content/instructions';
import { aboutContent } from '../src/content/about';

const publicDir = path.join(__dirname, '../public');

// --- Generate about.md ---
let aboutMd = `# About SPLForge\n\n`;
aboutMd += `Empowering the Solana community to create custom SPL tokens effortlessly.\n\n`;
aboutMd += `## Our Mission\n\n`;
aboutContent.mission.forEach(paragraph => { aboutMd += `${paragraph}\n\n`; });
aboutMd += `## Why Choose SPLForge?\n\n`;
aboutContent.whyChooseUs.forEach(item => { aboutMd += `### ${item.title}\n${item.description}\n\n`; });
aboutMd += `## Frequently Asked Questions\n\n`;
faqItems.forEach(item => { aboutMd += `### ${item.question}\n${item.answer}\n\n`; });
fs.writeFileSync(path.join(publicDir, 'about.md'), aboutMd);

// --- Generate tokencreator.md ---
let tokenCreatorMd = `# Create Solana Token\n\n`;
tokenCreatorMd += `Effortlessly create your Solana SPL Token with our simple process – no coding required. Customize your Solana Token exactly the way you envision it. Less than 5 minutes, at an affordable cost.\n\n`;
tokenCreatorMd += `## How to use Solana Token Creator\n\n`;
tokenCreatorInstructions.forEach(instruction => { tokenCreatorMd += `${instruction}\n`; });
tokenCreatorMd += `\n*The SPLForge's fee for Token creation is 0.1 SOL, not covering fees for SPL Token Creation.*\n\n`;
tokenCreatorMd += `## Revoke Freeze Authority:\n\n`;
tokenCreatorMd += `If you want to create a liquidity pool you will need to 'Revoke Freeze Authority' of the Token - Required.\n\n`;
tokenCreatorMd += `## Revoke Mint Authority:\n\n`;
tokenCreatorMd += `Revoking mint authority ensures that there can be no more tokens minted than the total supply. This provides security and peace of mind to buyers. The cost is 0.1 SOL\n\n`;
tokenCreatorMd += `Once the creation process starts, it will only take a few seconds! Once complete, you will receive the total supply of the token in your wallet. With our user-friendly platform, managing your tokens is simple and affordable.\n\n`;
tokenCreatorMd += `## Frequently Asked Questions\n\n`;
faqItems.forEach(item => { tokenCreatorMd += `### ${item.question}\n${item.answer}\n\n`; });
fs.writeFileSync(path.join(publicDir, 'tokencreator.md'), tokenCreatorMd);

// --- Generate liquiditypool.md ---
let liquidityMd = `# Create Solana Liquidity Pool\n\n`;
liquidityMd += `Easily create a liquidity pool for your Solana token. The fastest way to deploy Solana tokens and launch your project with SPLForge.\n\n`;
liquidityMd += `## How To Create a Liquidity Pool\n\n`;
liquidityPoolInstructions.forEach(instruction => { liquidityMd += `${instruction}\n`; });
liquidityMd += `\nIn return, you will receive Liquidity pool tokens. To burn liquidity so it shows locked, head to sol-incinerator.com.\n\n`;
liquidityMd += `*Note: The amount of SOL you enter as your starting LP determines the starting price of your token.*\n`;
liquidityMd += `*USDC Token doesn't work on Devnet.*\n`;
fs.writeFileSync(path.join(publicDir, 'liquiditypool.md'), liquidityMd);

// --- Generate llms-full.txt ---
let fullTxt = `# splforge Full Documentation\n\n`;
fullTxt += `> SPLForge is a fast, cheap Next.js webDapp for creating Solana (SPL) tokens and liquidity pools without coding.\n\n`;
fullTxt += `## About SPLForge\n\n`;
aboutContent.mission.forEach(paragraph => { fullTxt += `${paragraph}\n\n`; });
fullTxt += `### Why Choose Us\n\n`;
aboutContent.whyChooseUs.forEach(item => { fullTxt += `- **${item.title.replace(/[^\w\s]/gi, '').trim()}**: ${item.description}\n`; });
fullTxt += `\n## How to Create a Solana Token\n\n`;
tokenCreatorInstructions.forEach(instruction => { fullTxt += `${instruction}\n`; });
fullTxt += `\n*The SPLForge's fee for Token creation is 0.1 SOL.*\n\n`;
fullTxt += `## How to Create a Liquidity Pool\n\n`;
liquidityPoolInstructions.forEach(instruction => { fullTxt += `${instruction}\n`; });
fullTxt += `\n## Frequently Asked Questions\n\n`;
faqItems.forEach(item => { fullTxt += `### ${item.question}\n${item.answer}\n\n`; });
fs.writeFileSync(path.join(publicDir, 'llms-full.txt'), fullTxt);

console.log('Successfully generated static LLM endpoints and text outputs.');
