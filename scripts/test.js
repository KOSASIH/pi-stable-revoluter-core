// scripts/test.js
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Smart Contracts Tests", function () {
    let stableCoin, reserveManager, governance;
    let deployer, user1;

    before(async function () {
        [deployer, user1] = await ethers.getSigners();

        const StableCoin = await ethers.getContractFactory("StableCoin");
        stableCoin = await StableCoin.deploy("MyStableCoin", "MSC", 18);
        await stableCoin.deployed();

        const ReserveManager = await ethers.getContractFactory("ReserveManager");
        reserveManager = await ReserveManager.deploy();
        await reserveManager.deployed();

        const Governance = await ethers.getContractFactory("Governance");
        governance = await Governance.deploy(20);
        await governance.deployed();
    });

    it("should deploy StableCoin contract", async function () {
        expect(await stableCoin.name()).to.equal("MyStableCoin");
        expect(await stableCoin.symbol()).to.equal("MSC");
    });

    it("should deploy ReserveManager contract", async function () {
        expect(reserveManager.address).to.not.be.null;
    });

    it("should deploy Governance contract", async function () {
        expect(await governance.quorum()).to.equal(20);
    });

    it("should add a reserve", async function () {
        const reserveAsset = "0xYourReserveAssetAddress"; // Replace with actual asset address
        const reserveAmount = ethers.utils.parseUnits("1000", 18); // 1000 units
        const reserveRatio = 50; // 50%

        await reserveManager.addReserve(reserveAsset, reserveAmount, reserveRatio);
        const reserve = await reserveManager.reserves(reserveAsset);
        expect(reserve.amount).to.equal(reserveAmount);
        expect(reserve.ratio).to.equal(reserveRatio);
    });

    it("should create and execute a governance proposal", async function () {
        const proposalTitle = "Increase Reserve Ratio";
        const proposalDescription = "Proposal to increase the reserve ratio for better stability.";

        await governance.createProposal(proposalTitle, proposalDescription);
        const proposalId = 1; // Assuming this is the first proposal

        await governance.vote(proposalId, true); // Vote in favor
        await governance.executeProposal(proposalId);

        const proposal = await governance.proposals(proposalId);
        expect(proposal.executed).to.be.true;
    });
}); 
