// analytics/dashboard/app.js

const provider = new ethers.providers.JsonRpcProvider("http://localhost:8545"); // Change to your network
const stableCoinAddress = "0xYourStableCoinAddress"; // Replace with your deployed contract address
const chainlinkOracleAddress = "0xYourChainlinkOracleAddress"; // Replace with your deployed contract address

async function fetchTokenBalance() {
    const signer = provider.getSigner();
    const stableCoin = new ethers.Contract(stableCoinAddress, [
        "function balanceOf(address owner) view returns (uint256)"
    ], signer);

    const address = await signer.getAddress();
    const balance = await stableCoin.balanceOf(address);
    document.getElementById("tokenBalance").innerText = `Token Balance: ${ethers.utils.formatUnits(balance, 18)} STC`;
}

async function fetchLatestPrice() {
    const chainlinkOracle = new ethers.Contract(chainlinkOracleAddress, [
        "function getLatestPrice() view returns (int256)"
    ], provider);

    const latestPrice = await chainlinkOracle.getLatestPrice();
    document.getElementById("latestPrice").innerText = `Latest Price: ${latestPrice.toString()}`;
}

async function fetchTransactionHistory() {
    // Placeholder for transaction history fetching logic
    // This could involve fetching logs or using a service like Etherscan API
    const history = [
        { txHash: "0x123...", amount: "50 STC", date: "2023-01-01" },
        { txHash: "0x456...", amount: "30 STC", date: "2023-01-02" }
    ];

    const historyDiv = document.getElementById("transactionHistory");
    historyDiv.innerHTML = "<h3>Transaction History</h3>";
    history.forEach(tx => {
        historyDiv.innerHTML += `<p>Hash: ${tx.txHash}, Amount: ${tx.amount}, Date: ${tx.date}</p>`;
    });
}

async function init() {
    await fetchTokenBalance();
    await fetchLatestPrice();
    await fetchTransactionHistory();
}

init();
