// src/services/reserveService.js

const ReserveManager = require('../artifacts/contracts/ReserveManager.sol/ReserveManager.json');
const config = require('../config');
const { ethers } = require('ethers');

class ReserveService {
    constructor() {
        this.provider = new ethers.providers.JsonRpcProvider(config.network.rpcUrl);
        this.wallet = new ethers.Wallet(config.wallet.privateKey, this.provider);
        this.reserveManager = new ethers.Contract(config.contracts.reserveManagerAddress, ReserveManager.abi, this.wallet);
    }

    async addReserve(assetAddress, amount, ratio) {
        try {
            const tx = await this.reserveManager.addReserve(assetAddress, ethers.utils.parseUnits(amount.toString(), 18), ratio);
            await tx.wait();
            console.log(`Reserve added: ${assetAddress}, Amount: ${amount}, Ratio: ${ratio}`);
        } catch (error) {
            console.error("Error adding reserve:", error);
        }
    }

    async updateReserve(assetAddress, newAmount, newRatio) {
        try {
            const tx = await this.reserveManager.updateReserve(assetAddress, ethers.utils.parseUnits(newAmount.toString(), 18), newRatio);
            await tx.wait();
            console.log(`Reserve updated: ${assetAddress}, New Amount: ${newAmount}, New Ratio: ${newRatio}`);
        } catch (error) {
            console.error("Error updating reserve:", error);
        }
    }

    async getReserve(assetAddress) {
        try {
            const reserve = await this.reserveManager.reserves(assetAddress);
            console.log(`Reserve details for ${assetAddress}:`, reserve);
            return reserve;
        } catch (error) {
            console.error("Error fetching reserve:", error);
        }
    }
}

module.exports = new ReserveService();
