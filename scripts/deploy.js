const { ethers } = require("hardhat");
const chalk = require('chalk');

async function main() {
  const SecureVault = await ethers.getContractFactory("SecureVault");

	console.log("-----------------------------------------------------------------------------------------------------------");
	
  const secureVault = await SecureVault.deploy();
  await secureVault.waitForDeployment();
  console.log(`SecureContract deployed at: ${secureVault.target}`);
	console.log(chalk.blue('\n=== Contract Functions Testing ==='));

  // 1. Тест: Депозит ETH
	console.log(chalk.bold.yellow('\nTest 1: User1 deposits 1 ETH'));
	const [owner, user1, user2] = await ethers.getSigners();
	let userBalance = await secureVault.getBalance(user1.address);
	console.log(chalk.green(`User1 ${user1.address}'s balance (before deposit): ${ethers.formatEther(userBalance)} ETH`));
  const depositTx = await secureVault.connect(user1).deposit({ value: ethers.parseEther("1.0") });
  await depositTx.wait();

  userBalance = await secureVault.getBalance(user1.address);
	console.log(chalk.green(`User ${user1.address}'s balance (after deposit): ${ethers.formatEther(userBalance)} ETH`));
	console.log("-----------------------------------------------------------------------------------------------------------");

  // 2. Тест: Виведення ETH
	console.log(chalk.bold.yellow('\nTest 2: User1 withdraws 0.5 ETH'));
  const withdrawTx = await secureVault.connect(user1).withdraw(ethers.parseEther("0.5"));
  await withdrawTx.wait();

  userBalance = await secureVault.getBalance(user1.address);
	console.log(chalk.green(`User ${user1.address}'s balance (after withdrawal): ${ethers.formatEther(userBalance)} ETH`));
	console.log("-----------------------------------------------------------------------------------------------------------");

  // 3. Тест: Пауза контракту
	console.log(chalk.bold.yellow('\nTest 3: Owner pauses the contract'));
  const pauseTx = await secureVault.connect(owner).setPaused(true);
  await pauseTx.wait();
  console.log("Contract has been paused.");

  console.log("Attempting to make a deposit while the contract is paused (expected failure)...");
  try {
    const failedDeposit = await secureVault.connect(user2).deposit({ value: ethers.parseEther("1.0") });
    await failedDeposit.wait();
  } catch (error) {
		console.log(chalk.red("Error encountered correctly:", error.message));
  }
	console.log("-----------------------------------------------------------------------------------------------------------");

  // 4. Тест: Аварійне виведення коштів
	console.log(chalk.bold.yellow('\nTest 4: Owner performs an emergency withdrawal"'));
  const emergencyWithdrawTx = await secureVault.connect(owner).emergencyWithdraw();
  await emergencyWithdrawTx.wait();

  const contractBalance = await ethers.provider.getBalance(secureVault.target);
	console.log(chalk.green(`Contract balance after emergency withdrawal: ${ethers.formatEther(contractBalance)} ETH`));
	console.log(chalk.green("All funds have been successfully withdrawn by the owner."));

	console.log(chalk.blue('\n=== Testing completed successfully ==="'));
	console.log("-----------------------------------------------------------------------------------------------------------");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
