// migrations/2_deploy_contracts.js

const StableCoin = artifacts.require("StableCoin");
const ReserveManager = artifacts.require("ReserveManager");
const Governance = artifacts.require("Governance");

module.exports = async function (deployer) {
    try {
        // Deploy StableCoin
        console.log("Deploying StableCoin...");
        await deployer.deploy(StableCoin);
        const stableCoinInstance = await StableCoin.deployed();
        console.log(`StableCoin deployed at: ${stableCoinInstance.address}`);

        // Deploy ReserveManager with the address of StableCoin
        console.log("Deploying ReserveManager...");
        await deployer.deploy(ReserveManager, stableCoinInstance.address);
        const reserveManagerInstance = await ReserveManager.deployed();
        console.log(`ReserveManager deployed at: ${reserveManagerInstance.address}`);

        // Deploy Governance with the addresses of StableCoin and ReserveManager
        console.log("Deploying Governance...");
        await deployer.deploy(Governance, stableCoinInstance.address, reserveManagerInstance.address);
        const governanceInstance = await Governance.deployed();
        console.log(`Governance deployed at: ${governanceInstance.address}`);

        // Set initial parameters for StableCoin (if applicable)
        const initialMintingRate = ethers.utils.parseUnits("0.01", 18); // Example initial minting rate
        console.log(`Setting initial minting rate to: ${initialMintingRate.toString()}`);
        await stableCoinInstance.setMintingRate(initialMintingRate);

        // Set initial reserves in ReserveManager (if applicable)
        const initialReserves = [
            { asset: "0xYourReserveAssetAddress1", amount: ethers.utils.parseUnits("1000", 18), ratio: 50 },
            { asset: "0xYourReserveAssetAddress2", amount: ethers.utils.parseUnits("500", 18), ratio: 30 },
        ];

        for (const reserve of initialReserves) {
            console.log(`Adding reserve: ${reserve.asset}, Amount: ${reserve.amount.toString()}, Ratio: ${reserve.ratio}`);
            await reserveManagerInstance.addReserve(reserve.asset, reserve.amount, reserve.ratio);
        }

        console.log("All contracts deployed and initialized successfully!");
    } catch (error) {
        console.error("Error during contract deployment:", error);
        throw error; // Rethrow to stop the migration process
    }
};
