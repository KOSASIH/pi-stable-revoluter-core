// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract MultiSigWallet is Ownable {
    event Deposit(address indexed sender, uint256 amount);
    event SubmitTransaction(address indexed owner, uint256 indexed txIndex);
    event ApproveTransaction(address indexed owner, uint256 indexed txIndex);
    event RevokeTransaction(address indexed owner, uint256 indexed txIndex);
    event ExecuteTransaction(address indexed owner, uint256 indexed txIndex);

    struct Transaction {
        address to;
        uint256 value;
        bytes data;
        bool executed;
        uint256 approvalCount;
    }

    address[] public owners;
    mapping(address => bool) public isOwner;
    mapping(uint256 => mapping(address => bool)) public approvals; // txIndex => owner => approved
    Transaction[] public transactions;
    uint256 public requiredApprovals;

    modifier onlyOwner() {
        require(isOwner[msg.sender], "Not an owner");
        _;
    }

    constructor(address[] memory _owners, uint256 _requiredApprovals) {
        require(_owners.length > 0, "Owners required");
        require(_requiredApprovals > 0 && _requiredApprovals <= _owners.length, "Invalid number of required approvals");

        for (uint256 i = 0; i < _owners.length; i++) {
            address owner = _owners[i];
            require(owner != address(0), "Invalid owner");
            require(!isOwner[owner], "Owner not unique");
            isOwner[owner] = true;
            owners.push(owner);
        }
        requiredApprovals = _requiredApprovals;
    }

    receive() external payable {
        emit Deposit(msg.sender, msg.value);
    }

    function submitTransaction(address to, uint256 value, bytes memory data) public onlyOwner {
        transactions.push(Transaction({
            to: to,
            value: value,
            data: data,
           executed: false,
            approvalCount: 0
        }));

        emit SubmitTransaction(msg.sender, transactions.length - 1);
    }

    function approveTransaction(uint256 txIndex) public onlyOwner {
        Transaction storage transaction = transactions[txIndex];
        require(!transaction.executed, "Transaction already executed");
        require(!approvals[txIndex][msg.sender], "Transaction already approved");

        approvals[txIndex][msg.sender] = true;
        transaction.approvalCount++;

        emit ApproveTransaction(msg.sender, txIndex);
    }

    function revokeApproval(uint256 txIndex) public onlyOwner {
        Transaction storage transaction = transactions[txIndex];
        require(!transaction.executed, "Transaction already executed");
        require(approvals[txIndex][msg.sender], "Transaction not approved");

        approvals[txIndex][msg.sender] = false;
        transaction.approvalCount--;

        emit RevokeTransaction(msg.sender, txIndex);
    }

    function executeTransaction(uint256 txIndex) public onlyOwner {
        Transaction storage transaction = transactions[txIndex];
        require(transaction.approvalCount >= requiredApprovals, "Not enough approvals");
        require(!transaction.executed, "Transaction already executed");

        transaction.executed = true;

        (bool success, ) = transaction.to.call{value: transaction.value}(transaction.data);
        require(success, "Transaction failed");

        emit ExecuteTransaction(msg.sender, txIndex);
    }

    function getTransactionCount() public view returns (uint256) {
        return transactions.length;
    }

    function getTransaction(uint256 txIndex) public view returns (address, uint256, bytes memory, bool, uint256) {
        Transaction storage transaction = transactions[txIndex];
        return (transaction.to, transaction.value, transaction.data, transaction.executed, transaction.approvalCount);
    }
}
