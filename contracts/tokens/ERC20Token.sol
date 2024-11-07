// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Snapshot.sol";

contract ERC20Token is ERC20, Ownable, ERC20Snapshot {
    using SafeMath for uint256;

    event Mint(address indexed to, uint256 amount);
    event Burn(address indexed from, uint256 amount);

    constructor() ERC20("ERC20Token", "ERC20") {
        _mint(msg.sender, 1_000_000 * 10**18); // Mint initial supply to the deployer
    }

    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
        emit Mint(to, amount);
    }

    function burn(uint256 amount) external {
        _burn(msg.sender, amount);
        emit Burn(msg.sender, amount);
    }

    function snapshot() external onlyOwner returns (uint256) {
        return _snapshot();
    }

    function getCurrentSnapshotId() external view returns (uint256) {
        return _getCurrentSnapshotId();
    }

    function balanceOfAt(address account, uint256 snapshotId) external view returns (uint256) {
        return super.balanceOfAt(account, snapshotId);
    }

    function totalSupplyAt(uint256 snapshotId) external view returns (uint256) {
        return super.totalSupplyAt(snapshotId);
    }
}
