// src/services/reserveService.js

const ReserveManager = require('../artifacts/contracts/ReserveManager.sol/ReserveManager.json');
const config = require('../config');
const { ethers } = require('ethers');
const { schedule } = require('node-cron');
const { logError, logInfo } = require('../utils/logger'); // Custom logger for structured logging

class ReserveService {
    constructor() {
        this.provider = new ethers.providers.JsonRpcProvider(config.network.rpcUrl);
        this.wallet = new ethers.Wallet(config.wallet.privateKey, this.provider);
        this.reserveManager = new ethers.Contract(config.contracts.reserveManagerAddress, ReserveManager.abi, this.wallet);

        // Schedule reserve monitoring every 5 minutes
        schedule('*/5 * * * *', () => this.monitorReserves());
    }

    async addReserve(assetAddress, amount, ratio) {
        try {
            const tx = await this.reserveManager.addReserve(assetAddress, ethers.utils.parseUnits(amount.toString(), 18), ratio);
            await tx.wait();
            logInfo(`Reserve added: ${assetAddress}, Amount: ${amount}, Ratio: ${ratio}`);
        } catch (error) {
            logError("Error adding reserve:", error);
        }
    }

    async updateReserve(assetAddress, newAmount, newRatio) {
        try {
            const tx = await this.reserveManager.updateReserve(assetAddress, ethers.utils.parseUnits(newAmount.toString(), 18), newRatio);
            await tx.wait();
            logInfo(`Reserve updated: ${assetAddress}, New Amount: ${newAmount}, New Ratio: ${newRatio}`);
        } catch (error) {
            logError("Error updating reserve:", error);
        }
    }

    async getReserve(assetAddress) {
        try {
            const reserve = await this.reserveManager.reserves(assetAddress);
            logInfo(`Reserve details for ${assetAddress}:`, reserve);
            return reserve;
        } catch (error) {
            logError("Error fetching reserve:", error);
        }
    }

    async monitorReserves() {
        try {
            const reserves = await this.getAllReserves();
            reserves.forEach(reserve => {
                this.checkReserveThreshold(reserve);
            });
        } catch (error) {
            logError("Error monitoring reserves:", error);
        }
    }

    async getAllReserves() {
        // Fetch all reserves from the ReserveManager contract
        // This is a placeholder for actual implementation
        const reserveCount = await this.reserveManager.getReserveCount(); // Assuming this function exists
        const reserves = [];
        for (let i = 0; i < reserveCount; i++) {
            const assetAddress = await this.reserveManager.getReserveAsset(i); // Assuming this function exists
            const reserveDetails = await this.getReserve(assetAddress);
            reserves.push({ assetAddress, reserveDetails });
        }
        return reserves;
    }

    checkReserveThreshold(reserve) {
        const { assetAddress, reserveDetails } = reserve;
        const { amount, ratio } = reserveDetails; // Assuming reserveDetails has these properties

        // Example threshold check
        if (ethers.utils.formatUnits(amount, 18) < 1000) { // Example threshold
            logInfo(`Alert: Reserve for ${assetAddress} is below threshold. Current Amount: ${ethers.utils.formatUnits(amount, 18)}`);
            // Additional actions can be taken here, such as notifying an admin
        }
    }
}

module.exports = new ReserveService();
