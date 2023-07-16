// function deployOnlyFunds() {
//     console.log("Only Funds");
// }
const { network } = require("hardhat");
const { networkConfig, devChainsNotToBeDeployedOnTestNet } = require("../helper/helper-hardhat-config")
const { verify } = require("../utils/verify")
require("dotenv").config();

// hardhat runtime env 
module.exports = async ({ getNamedAccounts, deployments }) => {

    const { deploy, log, get } = deployments;
    const { deployer } = await getNamedAccounts();
    const chainId = network.config.chainId;

    let ethUSDPriceAddress;
    if (chainId === 31337) {
        const ethUSDAggregator = await get("MockV3Aggregator");
        ethUSDPriceAddress = ethUSDAggregator.address;
    }
    else {
        ethUSDPriceAddress = networkConfig[chainId]["ethUSDPriceFeed"]
    }

    const args = [ethUSDPriceAddress];

    const onlyFunds = await deploy("FundMe", {
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })

    if (!devChainsNotToBeDeployedOnTestNet.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        await verify(onlyFunds.address, args);
    }

    log(" ====================================== ")
}

module.exports.tags = ["all", "onlyFunds"]