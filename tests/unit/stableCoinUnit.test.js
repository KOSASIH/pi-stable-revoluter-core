// tests/unit/stableCoinUnit.test.js

const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("StableCoin Unit Tests", function () {
    let stableCoin;
    let owner;

    before(async function () {
        [owner] = await ethers.getSigners();

        const StableCoin = await ethers.getContractFactory("StableCoin");
        stableCoin = await StableCoin.deploy();
        await stableCoin.deployed();
    });

    it("should have correct initial supply", async function () {
        const totalSupply = await stableCoin.totalSupply();
        expect(totalSupply).to.equal(0); // Assuming initial supply is zero
    });

    it("should not allow minting by non-owners", async function () {
        const mintAmount = ethers.utils.parseUnits("1000", 18);
        await expect(stableCoin.connect(addr1).mint(addr1.address, mintAmount))
            .to.be.revertedWith("Only owner can mint");
    });
});
