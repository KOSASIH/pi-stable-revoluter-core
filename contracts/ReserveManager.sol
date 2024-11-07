// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract ReserveManager is Ownable {
    using SafeMath for uint256;

    struct Reserve {
        uint256 amount;
        uint256 ratio; // Ratio of this reserve in relation to total reserves
    }

    mapping(address => Reserve) public reserves;
    address[] public reserveAssets;
    uint256 public totalReserves;

    event ReserveAdded(address indexed asset, uint256 amount, uint256 ratio);
    event ReserveRemoved(address indexed asset, uint256 amount);
    event ReserveRatioUpdated(address indexed asset, uint256 newRatio);
    event EmergencyWithdrawal(address indexed asset, uint256 amount);

    modifier onlyExistingReserve(address asset) {
        require(reserves[asset].amount > 0, "Reserve does not exist");
        _;
    }

    function addReserve(address asset, uint256 amount, uint256 ratio) external onlyOwner {
        require(asset != address(0), "Invalid asset address");
        require(amount > 0, "Amount must be greater than zero");
        require(ratio > 0, "Ratio must be greater than zero");

        if (reserves[asset].amount == 0) {
            reserveAssets.push(asset);
        }

        reserves[asset].amount = reserves[asset].amount.add(amount);
        reserves[asset].ratio = ratio;
        totalReserves = totalReserves.add(amount);

        emit ReserveAdded(asset, amount, ratio);
    }

    function removeReserve(address asset, uint256 amount) external onlyOwner onlyExistingReserve(asset) {
        require(reserves[asset].amount >= amount, "Insufficient reserve");
        
        reserves[asset].amount = reserves[asset].amount.sub(amount);
        totalReserves = totalReserves.sub(amount);

        emit ReserveRemoved(asset, amount);
    }

    function updateReserveRatio(address asset, uint256 newRatio) external onlyOwner onlyExistingReserve(asset) {
        require(newRatio > 0, "New ratio must be greater than zero");
        reserves[asset].ratio = newRatio;

        emit ReserveRatioUpdated(asset, newRatio);
    }

    function getReserve(address asset) external view returns (uint256 amount, uint256 ratio) {
        Reserve storage reserve = reserves[asset];
        return (reserve.amount, reserve.ratio);
    }

    function getAllReserves() external view returns (address[] memory) {
        return reserveAssets;
    }

    function emergencyWithdraw(address asset, uint256 amount) external onlyOwner onlyExistingReserve(asset) {
        require(reserves[asset].amount >= amount, "Insufficient reserve for withdrawal");
        
        reserves[asset].amount = reserves[asset].amount.sub(amount);
        totalReserves = totalReserves.sub(amount);

        // Logic to transfer the asset to the owner would go here
        // For example, if it's an ERC20 token, you would call the transfer function

        emit EmergencyWithdrawal(asset, amount);
    }
}
