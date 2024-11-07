// scripts/interact.js
const Web3 = require('web3');
const { ethers } = require('hardhat');
const StableCoin = artifacts.require("StableCoin");
const ReserveManager = artifacts.require("ReserveManager");
const Governance = artifacts.require("Governance");

async function main() {
    const accounts = await ethers.getSigners();
    const deployer = accounts[0];

    const stableCoin = await StableCoin.deployed();
    const reserveManager = await ReserveManager.deployed();
    const governance = await Governance.deployed();

    // Example: Add a reserve
    const reserveAsset = "0xYourReserveAssetAddress"; // Replace with actual asset address
    const reserveAmount = ethers.utils.parseUnits("1000", 18); // 1000 units
    const reserveRatio = 50; // 50%

    console.log("Adding reserve...");
    await reserveManager.addReserve(reserveAsset, reserveAmount, reserveRatio);
    console.log("Reserve added!");

    // Example: Create a governance proposal
    const proposalTitle = "Increase Reserve Ratio";
    const proposalDescription = "Proposal to increase the reserve ratio for better stability.";
    console.log("Creating proposal...");
    await governance.createProposal(proposalTitle, proposalDescription);
    console.log("Proposal created!");

    // Example: Vote on a proposal
    const proposalId = 1; // Replace with actual proposal ID
    console.log("Voting on proposal...");
    await governance.vote(proposalId, true); // Vote in favor
    console.log("Vote cast!");

    // Example: Execute a proposal
    console.log("Executing proposal...");
    await governance.executeProposal(proposalId);
    console.log("Proposal executed!");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
