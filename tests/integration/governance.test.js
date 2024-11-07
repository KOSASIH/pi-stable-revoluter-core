// tests/integration/governance.test.js

const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Governance Integration Tests", function () {
    let stableCoin, reserveManager, governance;
    let owner, addr1, addr2;

    before(async function () {
        [owner, addr1, addr2] = await ethers.getSigners();

        const StableCoin = await ethers.getContractFactory("StableCoin");
        stableCoin = await StableCoin.deploy();
        await stableCoin.deployed();

        const ReserveManager = await ethers.getContractFactory("ReserveManager");
        reserveManager = await ReserveManager.deploy(stableCoin.address);
        await reserveManager.deployed();

        const Governance = await ethers.getContractFactory("Governance");
        governance = await Governance.deploy(stableCoin.address, reserveManager.address);
        await governance.deployed();
    });

    it("should create a proposal", async function () {
        const proposalTx = await governance.createProposal("Increase Minting Rate", "Proposal to increase the minting rate.");
        await proposalTx.wait();

        const proposal = await governance.proposals(0);
        expect(proposal.title).to.equal("Increase Minting Rate");
    });

    it("should allow voting on a proposal", async function () {
        await governance.vote(0, true);
        const proposal = await governance.proposals(0);
        expect(proposal.votesYes).to.equal(1);
    });

    it("should execute a proposal if it passes", async function () {
        await governance.executeProposal(0);
        const proposal = await governance.proposals(0);
        expect(proposal.executed).to.be.true;
    });
});
