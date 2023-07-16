const networkConfig = {

    11155111: {
        name: "sepolia",
        ethUSDPriceFeed: "0x694AA1769357215DE4FAC081bf1f309aDC325306"
    },
    1: {
        name: "ethereum",
        ethUSDPriceFeed: "0x0a87e12689374A4EF49729582B474a1013cceBf8"
    },
    137: {
        name: "polygon",
        ethUSDPriceFeed: "0xF9680D99D6C9589e2a93a78A04A279e509205945"
    },
}

const devChainsNotToBeDeployedOnTestNet = ["hardhat", "localhost"];
const DECIMALS = 8;
const INITIAL_ANSWER = 170000000000;

module.exports = {
    networkConfig, devChainsNotToBeDeployedOnTestNet,
    DECIMALS, INITIAL_ANSWER
}