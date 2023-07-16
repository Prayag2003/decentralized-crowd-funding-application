const { network } = require("hardhat");
const { devChainsNotToBeDeployedOnTestNet, DECIMALS, INITIAL_ANSWER } = require("../helper/helper-hardhat-config")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();

    if (devChainsNotToBeDeployedOnTestNet.includes(network.name)) {
        log("Local Network Detected ... Deploying Mocks");
        await deploy("MockV3Aggregator", {
            contract: "MockV3Aggregator",
            from: deployer,
            log: true,
            args: [DECIMALS, INITIAL_ANSWER]
        })
        log("Mocks Deployed ");
        log(" ------------------------------------------------- ")
    }
}

module.exports.tags = ["all", "mockTags"];