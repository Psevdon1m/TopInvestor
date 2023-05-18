const networkConfig = {
    4: {
        name: "rinkeby",
        priceFeedAddress: "0x8A753747A1Fa494EC906cE90E9f37563A8AF630e",
    },
    97: {
        name: "BNB TestNet",
        priceFeedAddress: "0x2514895c72f50D8bd4B4F9b1110F0D6bD2c97526",
    },
}

const developmentChains = ["hardhat", "localhost"]
const DECIMALS = 8
const INITIAL_ANSWER = 200000000000

module.exports = {
    networkConfig,
    developmentChains,
    DECIMALS,
    INITIAL_ANSWER,
}
