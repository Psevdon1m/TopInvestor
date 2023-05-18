const { network } = require("hardhat")
const { networkConfig, developmentChains } = require("../helper-config")
const { verify } = require("../utils/verify")
module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log, get } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId

    let priceFeedAddress
    if (developmentChains.includes(network.name)) {
        const usdAggregator = await get("MockV3Aggregator")
        priceFeedAddress = usdAggregator.address
    } else {
        priceFeedAddress = networkConfig[chainId]["priceFeedAddress"]
    }
    const args = [priceFeedAddress]
    const topInvestor = await deploy("TopInvestor", {
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: network.config.blockConfirmation || 1,
    })
    if (
        !developmentChains.includes(network.name) &&
        process.env.ETHERSCAN_API_KEY
    ) {
        await verify(topInvestor.address, args)
    }
    console.log("=================================================")
}

module.exports.tags = ["all", "topInvestor"]
