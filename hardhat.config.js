require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-ganache");
require("dotenv").config();
require("hardhat-gas-reporter");
require("hardhat-abi-exporter");
require("hardhat-deploy");
require("hardhat-docgen");

// Custom task to print the balance of an account
task("balance", "Prints an account's balance", async (taskArgs, hre) => {
    const { ethers } = hre;
    const balance = await ethers.provider.getBalance(taskArgs.account);
    console.log(ethers.utils.formatEther(balance), "ETH");
}).addParam("account", "The account's address");

// Hardhat configuration
module.exports = {
    solidity: {
        version: "0.8.4", // Specify the Solidity version
        settings: {
            optimizer: {
                enabled: true,
                runs: 200, // Optimize for how many times you intend to run the code
            },
        },
    },
    networks: {
        hardhat: {
            chainId: 1337, // Default Hardhat network chain ID
        },
        localhost: {
            url: "http://127.0.0.1:8545",
            accounts: [process.env.PRIVATE_KEY], // Use the private key from .env
        },
        ropsten: {
            url: process.env.ROPSTEN_URL, // Infura or Alchemy URL for Ropsten
            accounts: [process.env.PRIVATE_KEY],
            gas: 5000000,
            gasPrice: 20000000000, // 20 gwei
        },
        mainnet: {
            url: process.env.MAINNET_URL, // Infura or Alchemy URL for Mainnet
            accounts: [process.env.PRIVATE_KEY],
            gas: 5000000,
            gasPrice: 20000000000, // 20 gwei
        },
    },
    gasReporter: {
        enabled: true,
        currency: "USD",
        gasPrice: 21, // Set gas price in gwei
        outputFile: "gas-report.txt",
        noColors: true,
    },
    abiExporter: {
        path: './abi', // Output directory for ABI files
        clear: true, // Clear the output directory before exporting
        flat: true, // Export all ABIs into a single file
        only: [":MyContract$"], // Only export specific contracts
    },
    docgen: {
        path: "./docs", // Output directory for documentation
        clear: true, // Clear the output directory before generating
        runOnCompile: true, // Generate docs on every compile
    },
    mocha: {
        timeout: 20000, // Set timeout for tests
    },
};
