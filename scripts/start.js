// scripts/start.js

const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

// Load environment variables from a .env file
require("dotenv").config();

async function main() {
    // Connect to the Ethereum network
    const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
    const signer = provider.getSigner();

    console.log("Connecting to Ethereum network...");

    // Load contract addresses from a configuration file
    const configPath = path.join(__dirname, "../config.json");
    const config = JSON.parse(fs.readFileSync(configPath, "utf8"));

    // Interact with StableCoin contract
    const stableCoinAddress = config.contracts.StableCoin;
    const StableCoin = await ethers.getContractFactory("StableCoin");
    const stableCoin = StableCoin.attach(stableCoinAddress);

    // Fetch the total supply of the stablecoin
    const totalSupply = await stableCoin.totalSupply();
    console.log(`Total Supply of StableCoin: ${ethers.utils.formatUnits(totalSupply, 18)} STC`);

    // Example: Minting new tokens
    const mintAmount = ethers.utils.parseUnits("100", 18); // Mint 100 STC
    const mintTx = await stableCoin.mint(await signer.getAddress(), mintAmount);
    await mintTx.wait();
    console.log(`Minted ${ethers.utils.formatUnits(mintAmount, 18)} STC to ${await signer.getAddress()}`);

    // Interact with Chainlink Oracle contract
    const chainlinkOracleAddress = config.contracts.ChainlinkOracle;
    const ChainlinkOracle = await ethers.getContractFactory("ChainlinkOracle");
    const chainlinkOracle = ChainlinkOracle.attach(chainlinkOracleAddress);

    // Fetch the latest price from Chainlink Oracle
    const latestPrice = await chainlinkOracle.getLatestPrice();
    console.log(`Latest Price from Chainlink Oracle: ${latestPrice.toString()}`);

    // Example: Using GasOptimizer contract
    const gasOptimizerAddress = config.contracts.GasOptimizer;
    const GasOptimizer = await ethers.getContractFactory("GasOptimizer");
    const gasOptimizer = GasOptimizer.attach(gasOptimizerAddress);

    // Example: Batch execution
    const targets = [stableCoinAddress, chainlinkOracleAddress]; // Replace with actual target addresses
    const data = [
        stableCoin.interface.encodeFunctionData("mint", [await signer.getAddress(), mintAmount]),
        chainlinkOracle.interface.encodeFunctionData("getLatestPrice")
    ];

    const batchTx = await gasOptimizer.batchExecute(targets, data);
    await batchTx.wait();
    console.log(`Batch executed successfully: ${batchTx.hash}`);
}

// Start the application
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("Error starting the application:", error);
        process.exit(1);
    });
