// src/services/peggingService.js

const { getLatestPrice } = require('../utils/priceFeed');
const StableCoin = require('../artifacts/contracts/StableCoin.sol/StableCoin.json');
const config = require('../config');
const { ethers } = require('ethers');

class PeggingService {
    constructor() {
        this.provider = new ethers.providers.JsonRpcProvider(config.network.rpcUrl);
        this.wallet = new ethers.Wallet(config.wallet.privateKey, this.provider);
        this.stableCoin = new ethers.Contract(config.contracts.stableCoinAddress, StableCoin.abi, this.wallet);
        this.targetPeg = 1; // Target peg value (e.g., $1 for a stablecoin)
    }

    async adjustSupply() {
        try {
            const currentPrice = await getLatestPrice();
            const priceDifference = this.targetPeg - currentPrice;

            if (Math.abs(priceDifference) > 0.01) { // Adjust threshold as needed
                const adjustmentAmount = Math.abs(priceDifference) * 1000; // Example adjustment logic
                if (priceDifference > 0) {
                    console.log(`Minting ${adjustmentAmount} tokens to increase supply.`);
                    await this.stableCoin.mint(this.wallet.address, ethers.utils.parseUnits(adjustmentAmount.toString(), 18));
                } else {
                    console.log(`Burning ${adjustmentAmount} tokens to decrease supply.`);
                    await this.stableCoin.burn(this.wallet.address, ethers.utils.parseUnits(adjustmentAmount.toString(), 18));
                }
            } else {
                console.log("No adjustment needed. Current price is within acceptable range.");
            }
        } catch (error) {
            console.error("Error adjusting supply:", error);
        }
    }
}

module.exports = new PeggingService();
