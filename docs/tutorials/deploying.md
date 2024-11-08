# How to Deploy Contracts

This tutorial will guide you through the process of deploying smart contracts for the **pi-stable-revoluter-core** project.

## Prerequisites

Before you begin, ensure you have completed the setup as described in the [Getting Started](getting-started.md) guide. You should have the following installed:

- [Node.js](https://nodejs.org/) (version 14 or higher)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [Hardhat](https://hardhat.org/getting-started/) (for smart contract development)
- [Metamask](https://metamask.io/) (for interacting with the Ethereum network)

## Installation

1. **Clone the Repository**:

   If you haven't already, clone the repository:

   ```bash
   1 git clone https://github.com/KOSASIH/pi-stable-revoluter-core.git
   2 cd pi-stable-revoluter-core
   ```

2. **Install Dependencies:**

Install the required dependencies:

   ```bash
   1 npm install
   ```

3. **Create a .env File:**

   Create a .env file in the root directory and add your environment variables. You can use the following template:

   ```plaintext
   1 RPC_URL=http://localhost:8545
   2 PRIVATE_KEY=your_private_key_here
   ```
   Make sure to replace your_private_key_here with your actual Ethereum wallet private key.

## Deploying the Contracts

1. **Start a Local Ethereum Network:**

   If you are using Hardhat, you can start a local Ethereum network by running:

   ```bash
   1 npx hardhat node
   ```
   This will start a local blockchain instance on your machine.

2. **Compile the Contracts:**

   Before deploying, compile the smart contracts to ensure everything is up to date:

   ```bash
   1 npx hardhat compile
   ```
   
3. **Deploy the Contracts:**

   Use the following command to deploy your contracts to the local Ethereum network:

   ```bash
   1 npx hardhat run scripts/deploy.js --network localhost
   ```
   This command will execute the deploy.js script located in the scripts directory. Ensure that this script is correctly set up to deploy all necessary contracts.

4. **Verify Deployment:**

   - After running the deployment script, you should see the contract addresses printed in the terminal. You can verify that the contracts are deployed by checking the local Ethereum network using Hardhat's console or a block explorer.

5. **Interacting with Deployed Contracts:**

   - Once deployed, you can interact with your contracts using the frontend dashboard or through scripts. Refer to the Interacting with Contracts tutorial for more details.

## Conclusion
You have successfully deployed the smart contracts for the pi-stable-revoluter-core project! For further interactions, refer to the Interacting with Contracts tutorial or explore the Contract Documentation for more information on the deployed contracts.
 
   

  
