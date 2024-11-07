// tests/ReserveManager.test.js
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ReserveManager Contract", function () {
    let reserveManager;
    let deployer;
    const reserveAsset = "0xYourReserveAssetAddress"; // Replace with actual asset address

    before(async function () {
        [deployer] = await ethers.getSigners();

        const ReserveManager = await ethers.getContractFactory("ReserveManager");
        reserveManager = await ReserveManager.deploy();
        await reserveManager.deployed();
    });

    it("should add a reserve correctly", async function () {
        const reserveAmount = ethers.utils.parseUnits("1000", 18); // 1000 units
        const reserveRatio = 50; // 50%

        await reserveManager.addReserve(reserveAsset, reserveAmount, reserveRatio);
        const reserve = await reserveManager.reserves(reserveAsset);
        expect(reserve.amount).to.equal(reserveAmount);
        expect(reserve.ratio).to.equal(reserveRatio);
    });

    it("should update a reserve correctly", async function () {
        const newReserveAmount = ethers.utils.parseUnits("2000", 18); // 2000 units
        const newReserveRatio = 60; // 60%

        await reserveManager.updateReserve(reserveAsset, newReserveAmount, newReserveRatio);
        const reserve = await reserveManager.reserves(reserveAsset);
        expect(reserve.amount).to.equal(newReserveAmount);
        expect(reserve.ratio).to.equal(newReserveRatio);
    });

    it("should fail to add a reserve with zero amount", async function () {
        await expect(reserveManager.addReserve(reserveAsset, 0, 50)).to.be.revertedWith("Amount must be greater than zero");
    });

    it("should fail to update a non-existent reserve", async function () {
        const nonExistentAsset = "0xNonExistentAssetAddress";
        const reserveAmount = ethers.utils.parseUnits("1000", 18); // 100 0 units
        const reserveRatio = 50; // 50%

        await expect(reserveManager.updateReserve(nonExistentAsset, reserveAmount, reserveRatio)).to.be.revertedWith("Reserve does not exist");
    });
});
