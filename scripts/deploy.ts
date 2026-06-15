import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // 1. Deploy CampusToken (CIMP)
  const Token = await ethers.getContractFactory("CampusToken");
  const token = await Token.deploy(deployer.address);
  await token.waitForDeployment();
  const tokenAddress = await token.getAddress();
  console.log("✅ CampusToken deployed to:", tokenAddress);

  // 2. Deploy CampusGovernor (Needs the Token for voting)
  const Governor = await ethers.getContractFactory("CampusGovernor");
  const governor = await Governor.deploy(tokenAddress);
  await governor.waitForDeployment();
  const governorAddress = await governor.getAddress();
  console.log("✅ CampusGovernor deployed to:", governorAddress);

  // 3. Deploy CampusTreasury (Needs an initial owner, we set it to the Governor!)
  const Treasury = await ethers.getContractFactory("CampusTreasury");
  const treasury = await Treasury.deploy(governorAddress);
  await treasury.waitForDeployment();
  const treasuryAddress = await treasury.getAddress();
  console.log("✅ CampusTreasury deployed to:", treasuryAddress);

  console.log("\n🎉 Deployment Complete! Copy these addresses into your frontend .env!");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
