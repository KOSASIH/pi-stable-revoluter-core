// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract GasOptimizer {
    event BatchExecuted(address indexed executor, uint256 indexed batchId);

    function batchExecute(
        address[] calldata targets,
        bytes[] calldata data
    ) external {
        require(targets.length == data.length, "Targets and data length mismatch");

        for (uint256 i = 0; i < targets.length; i++) {
            (bool success, ) = targets[i].call(data[i]);
            require(success, "Batch execution failed");
        }

        emit BatchExecuted(msg.sender, block.timestamp);
    }

    function estimateGasForBatch(
        address[] calldata targets,
        bytes[] calldata data
    ) external view returns (uint256 totalGas) {
        for (uint256 i = 0; i < targets.length; i++) {
            totalGas += gasleft(); // Estimate gas left for each call
        }
    }
}
