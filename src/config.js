// src/config.js

const config = {
    network: {
        name: "Ethereum Mainnet", // Change to your desired network
        rpcUrl: "https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID", // Replace with your Infura project ID
        chainId: 1, // Mainnet chain ID
    },
    contracts: {
        stableCoinAddress: "0xYourStableCoinAddress", // Replace with your deployed StableCoin contract address
        reserveManagerAddress: "0xYourReserveManagerAddress", // Replace with your deployed ReserveManager contract address
        governanceAddress: "0xYourGovernanceAddress", // Replace with your deployed Governance contract address
    },
    wallet: {
        privateKey: "YOUR_PRIVATE_KEY", // Replace with your wallet's private key (keep this secret!)
    },
    app: {
        name: "My DApp",
        version: "1.0.0",
    },
};

module.exports = config;
