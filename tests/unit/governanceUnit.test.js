// tests/unit/governanceUnit.test.js

const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Governance Unit Tests", function () {
    let governance;
    let owner;

    before(async function () {
        [owner] = await ethers.getSigners();

        const Governance = await ethers.getContractFactory("Governance");
        governance = await Governance.deploy("0xStableCoinAddress", "0xReserveManagerAddress");
        await governance.deployed();
    });

    it("should initialize with correct parameters", async function () {
        expect(await governance.stableCoin()).to.equal("0xStableCoinAddress");
        expect(await governance.reserveManager()).to.equal("0xReserveManagerAddress");
    });

    it("should not allow non-owners to create proposals", async function () {
        await expect(governance.connect(addr1).createProposal("Test Proposal", "Description"))
            .to.be.revertedWith("Only owner can create proposals");
    });
});
