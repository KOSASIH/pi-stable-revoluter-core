// src/utils/priceFeed.js

const { ethers } = require('ethers');
const config = require('../config');

const priceFeedAddress = "0xYourPriceFeedAddress"; // Replace with actual Chainlink price feed address
const priceFeedABI = [
    // Minimal ABI to get the latest price
    "function latestRoundData() view returns (uint80, int256, uint256, uint256, uint80)"
];

async function getLatestPrice() {
    const provider = new ethers.providers.JsonRpcProvider(config.network.rpcUrl);
    const priceFeed = new ethers.Contract(priceFeedAddress, priceFeedABI, provider);

    try {
        const [roundId, price, startedAt, timeStamp, answeredInRound] = await priceFeed.latestRoundData();
        console.log(`Latest price: ${ethers.utils.formatUnits(price, 18)} (in 18 decimals)`);
        return ethers.utils.formatUnits(price, 18); // Adjust decimals as needed
    } catch (error) {
        console.error("Error fetching price:", error);
        throw new Error("Failed to fetch price from price feed");
    }
}

module.exports = {
    getLatestPrice,
};
