const hre = require("hardhat");

async function main() {
  console.log("Starting deployment...");

  // Get the deployer account
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);

  // Check account balance
  const balance = await deployer.getBalance();
  console.log("Account balance:", hre.ethers.utils.formatEther(balance), "ETH");

  // Deploy ForexStablecoin contracts for different currencies
  const currencies = [
    { name: "USD Forex Token", symbol: "USDfx", base: "USD" },
    { name: "EUR Forex Token", symbol: "EURfx", base: "EUR" },
    { name: "GBP Forex Token", symbol: "GBPfx", base: "GBP" },
    { name: "JPY Forex Token", symbol: "JPYfx", base: "JPY" }
  ];

  const deployedStablecoins = {};

  for (const currency of currencies) {
    console.log(`\nDeploying ${currency.symbol}...`);
    
    const ForexStablecoin = await hre.ethers.getContractFactory("ForexStablecoin");
    const stablecoin = await ForexStablecoin.deploy(
      currency.name,
      currency.symbol,
      currency.base
    );

    await stablecoin.deployed();
    
    deployedStablecoins[currency.symbol] = stablecoin.address;
    console.log(`${currency.symbol} deployed to:`, stablecoin.address);
  }

  // Deploy ForexPairFactory
  console.log("\nDeploying ForexPairFactory...");
  const ForexPairFactory = await hre.ethers.getContractFactory("ForexPairFactory");
  const factory = await ForexPairFactory.deploy();
  await factory.deployed();
  console.log("ForexPairFactory deployed to:", factory.address);

  // Create initial forex pairs
  const pairs = [
    { id: "USDEUR", token0: "USDfx", token1: "EURfx" },
    { id: "GBPUSD", token0: "GBPfx", token1: "USDfx" },
    { id: "USDJPY", token0: "USDfx", token1: "JPYfx" },
    { id: "EURGBP", token0: "EURfx", token1: "GBPfx" }
  ];

  for (const pair of pairs) {
    console.log(`\nCreating pair ${pair.id}...`);
    const tx = await factory.createPair(
      pair.id,
      deployedStablecoins[pair.token0],
      deployedStablecoins[pair.token1]
    );
    await tx.wait();
    console.log(`Pair ${pair.id} created`);
  }

  // Save deployment addresses
  const deploymentInfo = {
    network: hre.network.name,
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
    contracts: {
      stablecoins: deployedStablecoins,
      factory: factory.address
    }
  };

  console.log("\n=== Deployment Summary ===");
  console.log(JSON.stringify(deploymentInfo, null, 2));

  // Save to file
  const fs = require("fs");
  const path = require("path");
  const deploymentPath = path.join(__dirname, "..", "deployments");
  
  if (!fs.existsSync(deploymentPath)) {
    fs.mkdirSync(deploymentPath);
  }

  fs.writeFileSync(
    path.join(deploymentPath, `${hre.network.name}-deployment.json`),
    JSON.stringify(deploymentInfo, null, 2)
  );

  console.log("\nDeployment info saved to deployments/", hre.network.name, "-deployment.json");
  console.log("\n✅ Deployment complete!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
