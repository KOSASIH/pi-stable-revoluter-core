// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Governance is Ownable {
    struct Proposal {
        uint256 id;
        address proposer;
        string description;
        uint256 voteCount;
        uint256 endTime;
        bool executed;
    }

    IERC20 public governanceToken;
    mapping(uint256 => Proposal) public proposals;
    mapping(address => mapping(uint256 => bool)) public votes; // user => proposalId => hasVoted
    uint256 public proposalCount;
    uint256 public votingDuration;

    event ProposalCreated(uint256 id, address proposer, string description, uint256 endTime);
    event Voted(uint256 proposalId, address voter);
    event ProposalExecuted(uint256 proposalId);

    constructor(IERC20 _governanceToken, uint256 _votingDuration) {
        governanceToken = _governanceToken;
        votingDuration = _votingDuration;
    }

    function createProposal(string memory description) external {
        proposalCount++;
        uint256 endTime = block.timestamp + votingDuration;

        proposals[proposalCount] = Proposal({
            id: proposalCount,
            proposer: msg.sender,
            description: description,
            voteCount: 0,
            endTime: endTime,
            executed: false
        });

        emit ProposalCreated(proposalCount, msg.sender, description, endTime);
    }

    function vote(uint256 proposalId) external {
        Proposal storage proposal = proposals[proposalId];
        require(block.timestamp < proposal.endTime, "Voting has ended");
        require(!votes[msg.sender][proposalId], "Already voted");

        uint256 voterBalance = governanceToken.balanceOf(msg.sender);
        require(voterBalance > 0, "No voting power");

        votes[msg.sender][proposalId] = true;
        proposal.voteCount += voterBalance;

        emit Voted(proposalId, msg.sender);
    }

    function executeProposal(uint256 proposalId) external {
        Proposal storage proposal = proposals[proposalId];
        require(block.timestamp >= proposal.endTime, "Voting is still ongoing");
        require(!proposal.executed, "Proposal already executed");
        require(proposal.voteCount > (governanceToken.totalSupply() / 2), "Not enough votes");

        // Execute the proposal logic here (e.g., change a state variable, etc.)

        proposal.executed = true;
        emit ProposalExecuted(proposalId);
    }
}
