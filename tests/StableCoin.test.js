// tests/StableCoin.test.js
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("StableCoin Contract", function () {
    let stableCoin;
    let deployer, user1, user2;

    before(async function () {
        [deployer, user1, user2] = await ethers.getSigners();

        const StableCoin = await ethers.getContractFactory("StableCoin");
        stableCoin = await StableCoin.deploy("MyStableCoin", "MSC", 18);
        await stableCoin.deployed();
    });

    it("should have the correct name and symbol", async function () {
        expect(await stableCoin.name()).to.equal("MyStableCoin");
        expect(await stableCoin.symbol()).to.equal("MSC");
    });

    it("should mint tokens correctly", async function () {
        const mintAmount = ethers.utils.parseUnits("1000", 18);
        await stableCoin.mint(deployer.address, mintAmount);
        expect(await stableCoin.balanceOf(deployer.address)).to.equal(mintAmount);
    });

    it("should transfer tokens correctly", async function () {
        const transferAmount = ethers.utils.parseUnits("500", 18);
        await stableCoin.transfer(user1.address, transferAmount);
        expect(await stableCoin.balanceOf(user1.address)).to.equal(transferAmount);
        expect(await stableCoin.balanceOf(deployer.address)).to.equal(ethers.utils.parseUnits("500", 18));
    });

    it("should burn tokens correctly", async function () {
        const burnAmount = ethers.utils.parseUnits("200", 18);
        await stableCoin.burn(deployer.address, burnAmount);
        expect(await stableCoin.balanceOf(deployer.address)).to.equal(ethers.utils.parseUnits("300", 18));
    });

    it("should fail to transfer more than balance", async function () {
        const transferAmount = ethers.utils.parseUnits("1000", 18);
        await expect(stableCoin.transfer(user2.address, transferAmount)).to.be.revertedWith("Insufficient balance");
    });
});
