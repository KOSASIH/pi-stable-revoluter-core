// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ChainlinkOracle is Ownable {
    AggregatorV3Interface internal priceFeed;

    event PriceUpdated(int256 price);
    event PriceFeedUpdated(address indexed newPriceFeed);

    constructor(address _priceFeed) {
        require(_priceFeed != address(0), "Invalid price feed address");
        priceFeed = AggregatorV3Interface(_priceFeed);
    }

    function getLatestPrice() public view returns (int256) {
        (
            uint80 roundID, 
            int256 price, 
            uint256 startedAt, 
            uint256 timeStamp, 
            uint80 answeredInRound
        ) = priceFeed.latestRoundData();

        // Ensure the price is valid and the round is valid
        require(price > 0, "Invalid price");
        require(timeStamp > 0, "Price not updated yet");
        require(answeredInRound >= roundID, "Stale price data");

        emit PriceUpdated(price);
        return price;
    }

    function getPriceFeedAddress() external view returns (address) {
        return address(priceFeed);
    }

    function updatePriceFeed(address _newPriceFeed) external onlyOwner {
        require(_newPriceFeed != address(0), "Invalid price feed address");
        priceFeed = AggregatorV3Interface(_newPriceFeed);
        emit PriceFeedUpdated(_newPriceFeed);
    }

    // Fallback function to receive Ether
    receive() external payable {
        // Accept Ether for any reason, if needed
    }

    // Function to withdraw Ether from the contract
    function withdrawEther(address payable _to, uint256 _amount) external onlyOwner {
        require(_to != address(0), "Invalid address");
        require(address(this).balance >= _amount, "Insufficient balance");
        _to.transfer(_amount);
    }
}
