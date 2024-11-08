# How to Interact with Contracts

This tutorial will guide you through the process of interacting with the deployed smart contracts for the **pi-stable-revoluter-core** project.

## Prerequisites

Ensure you have completed the deployment of the contracts as described in the [How to Deploy Contracts](deploying.md) tutorial. You should also have the following:

- A local Ethereum network running (e.g., using Hardhat).
- The Ethers.js library included in your project (already included in the dashboard).

## Setting Up Ethers.js

To interact with the smart contracts, you will use the Ethers.js library. If you are using the dashboard, it should already be included in the `index.html` file. If you are working in a different environment, make sure to install Ethers.js:

```bash
1 npm install ethers
```

## Connecting to the Ethereum Network
Use the following code snippet to connect to the Ethereum network:

```javascript
1 const { ethers } = require("ethers");
2 
3 // Connect to the local Ethereum network
4. const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
5 const signer = provider.getSigner();
```

## Creating Contract Instances
You will need to create instances of your deployed contracts using their addresses and ABI (Application Binary Interface). Here’s how to do it:

1. Import the ABI: Make sure you have the ABI for your contracts. You can usually find this in the artifacts directory after compiling your contracts.

2. Create Contract Instances:

```javascript
1 // Replace with your deployed contract addresses
2 const stableCoinAddress = "0xYourStableCoinAddress"; // StableCoin contract address
3 const stableCoinABI = [ /* ABI array here */ ]; // Replace with actual ABI
4 
5 const stableCoin = new ethers.Contract(stableCoinAddress, stableCoinABI, signer
```

## Calling Contract Functions
You can now call functions on your contract. Here are some common interactions:

1. Get Token Balance
To get the balance of a user:

```javascript
1 async function getBalance() {
2     const address = await signer.getAddress();
3     const balance = await stableCoin.balanceOf(address);
4     console.log(`Balance: ${ethers.utils.formatUnits(balance, 18)} STC`);
5 }
6 
7 getBalance();
```

2. Mint Tokens
To mint new tokens, you can use the following function:

```javascript
1 async function mintTokens(amount) {
2     const tx = await stableCoin.mint(signer.getAddress(), ethers.utils.parseUnits(amount, 18));
3     await tx.wait();
4     console.log("Tokens minted!");
5 }
6 
7 mintTokens("100"); // Replace "100" with the desired amount
```

3. Transfer Tokens
To transfer tokens to another address:

```javascript
1 async function transferTokens(to, amount) {
2     const tx = await stableCoin.transfer(to, ethers.utils.parseUnits(amount, 18));
3     await tx.wait();
4     console.log(`Transferred ${amount} STC to ${to}`);
5 }
6 
7 transferTokens("0xRecipientAddress", "50"); // Replace with recipient address
```
