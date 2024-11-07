// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

contract StableCoin is ERC20, Ownable, Pausable {
    uint256 public constant INITIAL_SUPPLY = 1_000_000 * 10**18; // 1 million tokens
    uint256 public pegValue; // The value to which the stablecoin is pegged (in wei)

    event PegValueUpdated(uint256 newPegValue);

    constructor(uint256 _pegValue) ERC20("StableCoin", "STC") {
        pegValue = _pegValue;
        _mint(msg.sender, INITIAL_SUPPLY);
    }

    function setPegValue(uint256 _newPegValue) external onlyOwner {
        pegValue = _newPegValue;
        emit PegValueUpdated(_newPegValue);
    }

    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }

    function burn(uint256 amount) external {
        _burn(msg.sender, amount);
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    function _beforeTokenTransfer(address from, address to, uint256 amount) internal override whenNotPaused {
        super._beforeTokenTransfer(from, to, amount);
    }
}
