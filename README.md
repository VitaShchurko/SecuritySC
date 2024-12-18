# SecureVault Smart Contract Project

## Project Description
The **SecureVault** smart contract is a decentralized vault that allows users to deposit and withdraw Ether (ETH) securely. The contract also includes mechanisms to pause the contract for maintenance or emergencies and provides an emergency withdrawal feature for the owner.

The project incorporates several security practices to safeguard user funds and prevent common vulnerabilities in smart contracts, such as reentrancy attacks and unauthorized access. The contract is built using **OpenZeppelin**'s battle-tested libraries for secure contract development.

## Security Techniques Used

### 1. **Reentrancy Protection** (`ReentrancyGuard`)
- **Description**: The contract uses the `ReentrancyGuard` modifier from OpenZeppelin to prevent reentrancy attacks, which could occur if a user or malicious actor attempts to call a function (like `withdraw`) repeatedly before the contract state is updated.
- **Implementation**: The `withdraw` function is protected with the `nonReentrant` modifier, which ensures that no reentrant calls can occur during the execution of the withdrawal function.
- **Testing**: The script tests this by calling the `withdraw` function and ensuring that funds can only be withdrawn once, without the possibility of nested withdrawals.

### 2. **Ownership Control** (`Ownable`)
- **Description**: The `Ownable` contract from OpenZeppelin ensures that only the owner of the contract (the account that deploys the contract) can perform administrative tasks such as pausing the contract or performing emergency withdrawals.
- **Implementation**: The `setPaused` and `emergencyWithdraw` functions are restricted to the owner using the `onlyOwner` modifier.
- **Testing**: The script verifies that only the owner can pause the contract and perform an emergency withdrawal, ensuring that unauthorized users cannot access these critical functions.

### 3. **Contract Pausing** (Custom `paused` variable)
- **Description**: The contract allows the owner to pause or unpause the contract. This feature provides an emergency stop mechanism in case of any issues or vulnerabilities.
- **Implementation**: The contract maintains a `paused` state that is set to `true` or `false` by the owner. When the contract is paused, certain functions (like `deposit`) are disabled to prevent further transactions.
- **Testing**: The script tests the pause functionality by attempting a deposit during a paused state and ensuring that the transaction fails. It also verifies that the contract can be unpaused and normal operations resume.

### 4. **Emergency Withdrawal** (`emergencyWithdraw`)
- **Description**: The contract allows the owner to withdraw all the funds in the contract during an emergency, ensuring that the owner can recover funds if the contract needs to be paused for maintenance or if a vulnerability is discovered.
- **Implementation**: The `emergencyWithdraw` function enables the owner to transfer all Ether in the contract to their address if the contract is paused.
- **Testing**: The script tests the emergency withdrawal by verifying that the owner can successfully withdraw all funds from the contract and that the contract balance is correctly updated.

## Testing the Contract Functions

### 1. **Deposit Function**:
- User deposits 1 ETH into the contract.
- The script checks the user's balance before and after the deposit to ensure that the deposit was successful.

### 2. **Withdraw Function**:
- User withdraws 0.5 ETH from the contract.
- The script verifies that the withdrawal is successful and that the user's balance is updated accordingly.

### 3. **Pause Contract**:
- The owner pauses the contract.
- The script tests that no deposits can be made during the paused state, ensuring the contract's pause mechanism is functioning correctly.

### 4. **Emergency Withdrawal**:
- The owner performs an emergency withdrawal to transfer all funds out of the contract.
- The script checks the contract balance after the emergency withdrawal to ensure all funds are successfully transferred to the owner's address.

## To run this project locally, follow these steps:

### 1. **Install Dependencies**

```bash
yarn install
```

### 2. **Start Hardhat Node**

```bash
npx hardhat node
```

### 3. **Run the Tests**

```bash
npx hardhat run scripts/deploy.js --network localhost
```
and you will see:
<img width="1180" alt="Знімок екрана 2024-12-18 о 13 44 42" src="https://github.com/user-attachments/assets/faf3235e-9f1c-48f7-bf1c-98ffe93d3dbd" />


## Conclusion

This project demonstrates the application of essential security measures for Ethereum smart contracts, including reentrancy protection, access control, and the ability to pause or withdraw funds in emergencies. The use of OpenZeppelin's libraries (`ReentrancyGuard`, `Ownable`) ensures that the contract is secure and resistant to common vulnerabilities, while the accompanying test script provides a robust verification of the contract's functionality and security features.
