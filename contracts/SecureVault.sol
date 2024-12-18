// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SecureVault is ReentrancyGuard, Ownable {
    mapping(address => uint256) private balances;

    bool public paused;

    function deposit() external payable {
        require(!paused, "Contract is paused");
        require(msg.value > 0, "Must deposit non-zero amount");
        balances[msg.sender] += msg.value;
    }

    function withdraw(uint256 amount) external nonReentrant {
        require(!paused, "Contract is paused");
        require(balances[msg.sender] >= amount, "Insufficient funds");

        uint256 userBalance = balances[msg.sender];

        balances[msg.sender] = userBalance - amount;

        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Transfer failed");
    }

    function setPaused(bool _paused) external onlyOwner {
        paused = _paused;
    }

    function emergencyWithdraw() external onlyOwner {
        require(paused, "Contract must be paused for emergency withdraw");
        (bool success, ) = owner().call{value: address(this).balance}("");
        require(success, "Emergency withdrawal failed");
    }

    function getBalance(address user) external view returns (uint256) {
        return balances[user];
    }
}
