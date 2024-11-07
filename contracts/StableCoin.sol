// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Snapshot.sol";

contract StableCoin is ERC20, Ownable, Pausable, ERC20Snapshot {
    using SafeMath for uint256;

    uint256 public constant INITIAL_SUPPLY = 1000000 * (10 ** 18); // 1 million tokens
    uint256 public transactionFee = 5; // 5% transaction fee
    address public feeRecipient;

    event FeeRecipientChanged(address indexed newRecipient);
    event TransactionFeeChanged(uint256 newFee);

    constructor(address _feeRecipient) ERC20("PiStable", "PST") {
        require(_feeRecipient != address(0), "Invalid fee recipient");
        feeRecipient = _feeRecipient;
        _mint(msg.sender, INITIAL_SUPPLY);
    }

    function mint(address to, uint256 amount) external onlyOwner whenNotPaused {
        _mint(to, amount);
    }

    function burn(uint256 amount) external whenNotPaused {
        _burn(msg.sender, amount);
    }

    function setTransactionFee(uint256 newFee) external onlyOwner {
        require(newFee <= 100, "Fee cannot exceed 100%");
        transactionFee = newFee;
        emit TransactionFeeChanged(newFee);
    }

    function setFeeRecipient(address newRecipient) external onlyOwner {
        require(newRecipient != address(0), "Invalid fee recipient");
        feeRecipient = newRecipient;
        emit FeeRecipientChanged(newRecipient);
    }

    function _transfer(address sender, address recipient, uint256 amount) internal override whenNotPaused {
        uint256 fee = amount.mul(transactionFee).div(100);
        uint256 amountAfterFee = amount.sub(fee);

        super._transfer(sender, feeRecipient, fee); // Transfer fee to fee recipient
        super._transfer(sender, recipient, amountAfterFee); // Transfer remaining amount
    }

    function snapshot() external onlyOwner {
        _snapshot();
    }

    function getCurrentSnapshotId() external view returns (uint256) {
        return _getCurrentSnapshotId();
    }

    // Override the pause and unpause functions
    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }
}
