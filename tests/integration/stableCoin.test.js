// tests/integration/stableCoin.test.js

const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("StableCoin Integration Tests", function () {
    let stableCoin;
    let owner, addr1;

    before(async function () {
        [owner, addr1] = await ethers.getSigners();

        const StableCoin = await ethers.getContractFactory("StableCoin");
        stableCoin = await StableCoin.deploy();
        await stableCoin.deployed();
    });

    it("should mint tokens", async function () {
        const mintAmount = ethers.utils.parseUnits("1000", 18);
        await stableCoin.mint(addr1.address, mintAmount);
        const balance = await stableCoin.balanceOf(addr1.address);
        expect(balance).to.equal(mintAmount);
    });
});
