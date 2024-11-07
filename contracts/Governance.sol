// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract Governance is Ownable {
    using SafeMath for uint256;

    enum ProposalStatus { Pending, Active, Executed, Canceled }

    struct Proposal {
        uint256 id;
        string title;
        string description;
        uint256 votesFor;
        uint256 votesAgainst;
        uint256 endTime;
        ProposalStatus status;
        address proposer;
    }

    mapping(uint256 => Proposal) public proposals;
    mapping(address => mapping(uint256 => bool)) public votes; // user => proposalId => hasVoted
    uint256 public proposalCount;
    uint256 public quorum; // Minimum percentage of total supply required to vote

    event ProposalCreated(uint256 indexed id, string title, address indexed proposer);
    event Voted(uint256 indexed proposalId, address indexed voter, bool support);
    event ProposalExecuted(uint256 indexed proposalId);
    event ProposalCanceled(uint256 indexed proposalId);
    event QuorumChanged(uint256 newQuorum);

    constructor(uint256 _quorum) {
        require(_quorum > 0 && _quorum <= 100, "Quorum must be between 1 and 100");
        quorum = _quorum;
    }

    function createProposal(string memory title, string memory description) external onlyOwner {
        proposalCount++;
        proposals[proposalCount] = Proposal({
            id: proposalCount,
            title: title,
            description: description,
            votesFor: 0,
            votesAgainst: 0,
            endTime: block.timestamp + 7 days, // Voting period of 7 days
            status: ProposalStatus.Pending,
            proposer: msg.sender
        });

        emit ProposalCreated(proposalCount, title, msg.sender);
    }

    function vote(uint256 proposalId, bool support) external {
        require(proposalId > 0 && proposalId <= proposalCount, "Invalid proposal ID");
        Proposal storage proposal = proposals[proposalId];
        require(block.timestamp < proposal.endTime, "Voting period has ended");
        require(!votes[msg.sender][proposalId], "You have already voted on this proposal");

        votes[msg.sender][proposalId] = true;

        if (support) {
            proposal.votesFor++;
        } else {
            proposal.votesAgainst++;
        }

        emit Voted(proposalId, msg.sender, support);
    }

    function executeProposal(uint256 proposalId) external onlyOwner {
        Proposal storage proposal = proposals[proposalId];
        require(block.timestamp >= proposal.endTime, "Voting period has not ended");
        require(proposal.status == ProposalStatus.Pending, "Proposal already executed or canceled");

        uint256 totalVotes = proposal.votesFor.add(proposal.votesAgainst);
        require(totalVotes.mul(100).div(totalSupply()) >= quorum, "Quorum not reached");

        proposal.status = ProposalStatus.Executed;
        // Logic to execute the proposal goes here
        emit ProposalExecuted(proposalId);
    }

    function cancelProposal(uint256 proposalId) external onlyOwner {
        Proposal storage proposal = proposals[proposalId];
        require(proposal.status == ProposalStatus.Pending, "Proposal cannot be canceled");

        proposal.status = ProposalStatus.Canceled;
        emit ProposalCanceled(proposalId);
    }

    function setQuorum(uint256 newQuorum) external onlyOwner {
        require(newQuorum > 0 && newQuorum <= 100, "Quorum must be between 1 and 100");
        quorum = newQuorum;
        emit QuorumChanged(newQuorum);
    }

    function totalSupply() internal view returns (uint256) {
        // This function should return the total supply of the governance token
        // For example, if using an ERC20 token, you can call the token's totalSupply function
        // Placeholder for demonstration purposes
        return 1000000 * (10 ** 18); // Replace with actual total supply logic
    }
}
