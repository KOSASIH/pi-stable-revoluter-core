// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ChainlinkOracle is Ownable {
    AggregatorV3Interface internal priceFeed;

    event PriceUpdated(int256 price);

    constructor(address _priceFeed) {
        priceFeed = AggregatorV3Interface(_priceFeed);
    }

    function getLatestPrice() public view returns (int256) {
        (
            , 
            int256 price, 
            , 
            , 
        ) = priceFeed.latestRoundData();
        return price;
    }

    function getPriceFeedAddress() external view returns (address) {
        return address(priceFeed);
    }

    function updatePriceFeed(address _newPriceFeed) external onlyOwner {
        priceFeed = AggregatorV3Interface(_newPriceFeed);
    }
}
