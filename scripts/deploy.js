// scripts/deploy.js
const Web3 = require('web3');
const { ethers } = require('hardhat');
const StableCoin = artifacts.require("StableCoin");
const ReserveManager = artifacts.require("ReserveManager");
const Governance = artifacts.require("Governance");

async function main() {
    const accounts = await ethers.getSigners();
    const deployer = accounts[0];

    console.log("Deploying contracts with account:", deployer.address);

    // Deploy StableCoin
    const stableCoin = await StableCoin.deploy("MyStableCoin", "MSC", 18);
    await stableCoin.deployed();
    console.log("StableCoin deployed to:", stableCoin.address);

    // Deploy ReserveManager
    const reserveManager = await ReserveManager.deploy();
    await reserveManager.deployed();
    console.log("ReserveManager deployed to:", reserveManager.address);

    // Deploy Governance with a quorum of 20%
    const governance = await Governance.deploy(20);
    await governance.deployed();
    console.log("Governance deployed to:", governance.address);

    // Optionally, you can initialize contracts or set up relationships here
    // e.g., await reserveManager.initialize(stableCoin.address);

    console.log("All contracts deployed successfully!");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
