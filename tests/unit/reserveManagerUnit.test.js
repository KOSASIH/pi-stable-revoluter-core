// tests/unit/reserveManagerUnit.test.js

const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ReserveManager Unit Tests", function () {
    let reserveManager;
    let owner;

    before(async function () {
        [owner] = await ethers.getSigners();

        const ReserveManager = await ethers.getContractFactory("ReserveManager");
        reserveManager = await ReserveManager.deploy("0xStableCoinAddress");
        await reserveManager.deployed();
    });

    it("should initialize with correct stable coin address", async function () {
        expect(await reserveManager.stableCoin()).to.equal("0xStableCoinAddress");
    });

    it("should not allow adding a reserve with zero amount", async function () {
        await expect(reserveManager.addReserve("0xAssetAddress", 0, 50))
            .to.be.revertedWith("Amount must be greater than zero");
    });
});
