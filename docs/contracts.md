# Contract Documentation

## Overview

This document provides an overview of the smart contracts used in the Blockchain Project. Each contract is designed to fulfill specific functionalities within the ecosystem.

## Contracts

### 1. StableCoin

- **Description**: A stablecoin contract that allows users to mint, transfer, and burn tokens.
- **Key Functions**:
  - `mint(address to, uint256 amount)`: Mints new tokens to the specified address.
  - `burn(uint256 amount)`: Burns tokens from the caller's balance.
  - `balanceOf(address owner)`: Returns the token balance of the specified address.

### 2. ChainlinkOracle

- **Description**: A contract that fetches price data from Chainlink oracles.
- **Key Functions**:
  - `getLatestPrice()`: Returns the latest price from the Chainlink oracle.

### 3. GasOptimizer

- **Description**: A contract that optimizes gas usage for batch transactions.
- **Key Functions**:
  - `batchExecute(address[] targets, bytes[] data)`: Executes multiple transactions in a single call.

## Conclusion

For more detailed information on each contract, refer to the source code in the `contracts` directory.
