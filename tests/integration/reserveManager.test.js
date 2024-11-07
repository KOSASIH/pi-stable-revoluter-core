// tests/integration/reserveManager.test.js

const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ReserveManager Integration Tests", function () {
    let stableCoin, reserveManager;
    let owner;

    before(async function () {
        [owner] = await ethers.getSigners();

        const StableCoin = await ethers.getContractFactory("StableCoin");
        stableCoin = await StableCoin.deploy();
        await stableCoin.deployed();

        const ReserveManager = await ethers.getContractFactory("ReserveManager");
        reserveManager = await ReserveManager.deploy(stableCoin.address);
        await reserveManager.deployed();
    });

    it("should add a reserve", async function () {
        const reserveAsset = "0xYourReserveAssetAddress"; // Replace with actual address
        const reserveAmount = ethers.utils.parseUnits("1000", 18);
        const reserveRatio = 50;

        await reserveManager.addReserve(reserveAsset, reserveAmount, reserveRatio);
        const reserve = await reserveManager.reserves(reserveAsset);
        expect(reserve.amount).to.equal(reserveAmount);
        expect(reserve.ratio).to.equal(reserveRatio);
    });
});
