// tests/Governance.test.js
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Governance Contract", function () {
    let governance;
    let deployer, user1, user2;

    before(async function () {
        [deployer, user1, user2] = await ethers.getSigners();

        const Governance = await ethers.getContractFactory("Governance");
        governance = await Governance.deploy(20); // 20% quorum
        await governance.deployed();
    });

    it("should create a proposal correctly", async function () {
        const proposalTitle = "Increase Reserve Ratio";
        const proposalDescription = "Proposal to increase the reserve ratio for better stability.";

        await governance.createProposal(proposalTitle, proposalDescription);
        const proposal = await governance.proposals(1); // Assuming this is the first proposal
        expect(proposal.title).to.equal(proposalTitle);
        expect(proposal.description).to.equal(proposalDescription);
        expect(proposal.votesFor).to.equal(0);
        expect(proposal.votesAgainst).to.equal(0);
        expect(proposal.executed).to.be.false;
    });

    it("should allow voting on a proposal", async function () {
        await governance.createProposal("Test Proposal", "Description");
        const proposalId = 1; // Assuming this is the first proposal

        await governance.vote(proposalId, true); // Vote in favor
        const proposal = await governance.proposals(proposalId);
        expect(proposal.votesFor).to.equal(1);
    });

    it("should execute a proposal if quorum is met", async function () {
        const proposalId = 1; // Assuming this is the first proposal
        await governance.vote(proposalId, true); // Vote in favor
        await governance.vote(proposalId, false); // Vote against

        // Simulate reaching quorum
        await governance.executeProposal(proposalId);
        const proposal = await governance.proposals(proposalId);
        expect(proposal.executed).to.be.true;
    });

    it("should fail to execute a proposal if quorum is not met", async function () {
        await governance.createProposal("Another Proposal", "Description");
        const proposalId = 2; // Assuming this is the second proposal

        await expect(governance.executeProposal(proposalId)).to.be.revertedWith("Quorum not reached");
    });
});
