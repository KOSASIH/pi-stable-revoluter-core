// examples/exampleInteraction.js

const { ethers } = require('hardhat'); // or 'truffle' if using Truffle
const config = require('../src/config');
const contractAddresses = require('../src/contractAddresses.json'); // Load contract addresses

async function main() {
    const provider = new ethers.providers.JsonRpcProvider(config.network.rpcUrl);
    const wallet = new ethers.Wallet(config.wallet.privateKey, provider);

    // Load contract instances
    const StableCoin = await ethers.getContractFactory('StableCoin');
    const ReserveManager = await ethers.getContractFactory('ReserveManager');
    const Governance = await ethers.getContractFactory('Governance');

    const stableCoin = StableCoin.attach(contractAddresses.stableCoinAddress);
    const reserveManager = ReserveManager.attach(contractAddresses.reserveManagerAddress);
    const governance = Governance.attach(contractAddresses.governanceAddress);

    // Example: Mint StableCoin
    const mintAmount = ethers.utils.parseUnits("1000", 18);
    console.log(`Minting ${mintAmount.toString()} tokens...`);
    const mintTx = await stableCoin.mint(wallet.address, mintAmount);
    await mintTx.wait();
    console.log(`Minted ${mintAmount.toString()} tokens to ${wallet.address}`);

    // Example: Add a reserve
    const reserveAsset = "0xYourReserveAssetAddress"; // Replace with actual asset address
    const reserveAmount = ethers.utils.parseUnits("500", 18); // 500 units
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
    const voteTx = await governance.vote(proposalId, true); // true for 'yes', false for 'no'
    await voteTx.wait();
    console.log(`Voted on proposal ID: ${proposalId}`);
}

main()
    .then(() => {
        console.log("Interaction completed successfully!");
        process.exit(0);
    })
    .catch((error) => {
        console.error("Error during interaction:", error);
        process.exit(1);
    });
