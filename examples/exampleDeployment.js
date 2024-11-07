// examples/exampleDeployment.js

const { ethers } = require('hardhat'); // or 'truffle' if using Truffle
const config = require('../src/config');

async function main() {
    // Get the contract factories
    const StableCoin = await ethers.getContractFactory('StableCoin');
    const ReserveManager = await ethers.getContractFactory('ReserveManager');
    const Governance = await ethers.getContractFactory('Governance');

    // Deploy the contracts
    console.log("Deploying StableCoin...");
    const stableCoin = await StableCoin.deploy();
    await stableCoin.deployed();
    console.log(`StableCoin deployed to: ${stableCoin.address}`);

    console.log("Deploying ReserveManager...");
    const reserveManager = await ReserveManager.deploy(stableCoin.address);
    await reserveManager.deployed();
    console.log(`ReserveManager deployed to: ${reserveManager.address}`);

    console.log("Deploying Governance...");
    const governance = await Governance.deploy(stableCoin.address, reserveManager.address);
    await governance.deployed();
    console.log(`Governance deployed to: ${governance.address}`);

    // Save the contract addresses to the config file or a JSON file
    const fs = require('fs');
    const addresses = {
        stableCoinAddress: stableCoin.address,
        reserveManagerAddress: reserveManager.address,
        governanceAddress: governance.address,
    };
    fs.writeFileSync('./src/contractAddresses.json', JSON.stringify(addresses, null, 2));
    console.log("Contract addresses saved to src/contractAddresses.json");
}

main()
    .then(() => {
        console.log("Deployment completed successfully!");
        process.exit(0);
    })
    .catch((error) => {
        console.error("Error during deployment:", error);
        process.exit(1);
    });
