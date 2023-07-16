require("@nomicfoundation/hardhat-toolbox");
require("hardhat-deploy")
require("dotenv").config()

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  defaultNetwork: "hardhat",
  solidity: {
    compilers: [
      {
        version: "0.8.18",
      },
      {
        version: "0.6.6",
      },
    ],
  },
  networks: {
    sepolia: {
      url: process.env.RPC_URL,
      accounts: [process.env.PRIVATE_KEY],
      chainId: 11155111,
      blockConfirmations: 6
    },
  },

  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY
  },

  gasReporter: {
    enabled: false,
    outputFile: "gas-report.txt",
    currency: "USD",
    noColors: true,
    coinmarketcap: process.env.COINMARKET_API_KEY,
    token: "ETH"
  },

  namedAccounts: {
    deployer: {
      default: 0,
      1: 0, // here this will by default take the first account as deployer
    },
  },
};
