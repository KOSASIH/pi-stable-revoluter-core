// src/index.js

const Web3 = require('web3');
const { ethers } = require('ethers');
const config = require('./config');
const StableCoin = require('../artifacts/contracts/StableCoin.sol/StableCoin.json');
const ReserveManager = require('../artifacts/contracts/ReserveManager.sol/ReserveManager.json');
const Governance = require('../artifacts/contracts/Governance.sol/Governance.json');

async function main() {
    // Initialize Web3 and ethers
    const web3 = new Web3(new Web3.providers.HttpProvider(config.network.rpcUrl));
    const provider = new ethers.providers.JsonRpcProvider(config.network.rpcUrl);
    const wallet = new ethers.Wallet(config.wallet.privateKey, provider);

    // Initialize contract instances
    const stableCoin = new ethers.Contract(config.contracts.stableCoinAddress, StableCoin.abi, wallet);
    const reserveManager = new ethers.Contract(config.contracts.reserveManagerAddress, ReserveManager.abi, wallet);
    const governance = new ethers.Contract(config.contracts.governanceAddress, Governance.abi, wallet);

    console.log(`Connected to ${config.network.name} at ${config.network.rpcUrl}`);
    console.log(`Using wallet address: ${wallet.address}`);

    // Example: Mint StableCoin
    const mintAmount = ethers.utils.parseUnits("1000", 18);
    console.log(`Minting ${mintAmount.toString()} tokens...`);
    const mintTx = await stableCoin.mint(wallet.address, mintAmount);
    await mintTx.wait();
    console.log(`Minted ${mintAmount.toString()} tokens to ${wallet.address}`);

    // Example: Add a reserve
    const reserveAsset = "0xYourReserveAssetAddress"; // Replace with actual asset address
    const reserveAmount = ethers.utils.parseUnits("1000", 18); // 1000 units
    const reserveRatio = 50; // 50%
    console.log(`Adding reserve: ${reserveAsset}, Amount: ${reserveAmount.toString()}, Ratio: ${reserveRatio}`);
    const addReserveTx = await reserveManager.addReserve(reserveAsset, reserveAmount, reserveRatio);
    await addReserveTx.wait();
    console.log(`Reserve added successfully!`);

    // Example: Create a governance proposal
    const proposalTitle = "Increase Reserve Ratio";
    const proposalDescription = "Proposal to increase the reserve ratio for better stability.";
    console.log(`Creating proposal: ${proposalTitle}`);
    const createProposalTx = await governance.createProposal(proposalTitle, proposalDescription);
    await createProposalTx.wait();
    console.log(`Proposal created successfully!`);

    // Example: Vote on a proposal
    const proposalId = 1; // Replace with actual proposal ID
    console.log(`Voting on proposal ID: ${proposalId}`);
    const voteTx = await governance.vote(proposalId, true); // Vote in favor
    await voteTx.wait();
    console.log(`Vote cast successfully!`);

    // Example: Execute a proposal
    console.log(`Executing proposal ID: ${proposalId}`);
    const executeTx = await governance.executeProposal(proposalId);
    await executeTx.wait();
    console.log(`Proposal executed successfully!`);
}

main()
    .then (() => {
        console.log("Application executed successfully!");
    })
    .catch((error) => {
        console.error("Error executing application:", error);
    });
