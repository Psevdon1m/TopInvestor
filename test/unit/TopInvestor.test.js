const { assert, expect } = require("chai")
const { deployments, ethers, getNamedAccounts } = require("hardhat")

describe("TopInvestor", function () {
    let topInvestor
    let deployer
    let mockV3Aggregator
    const depositValue = ethers.utils.parseEther("1")
    beforeEach(async () => {
        deployer = (await getNamedAccounts()).deployer
        await deployments.fixture(["all"])
        topInvestor = await ethers.getContract("TopInvestor", deployer)
        mockV3Aggregator = await ethers.getContract(
            "MockV3Aggregator",
            deployer
        )
        // console.log(topInvestor.address, mockV3Aggregator.address)
    })
    // console.log(topInvestor.address, mockV3Aggregator.address)
    describe("constructor", async () => {
        it("sets the aggregator addresses correctly", async () => {
            const response = await topInvestor.priceFeed()
            assert.equal(response, mockV3Aggregator.address)
        })
    })
    describe("funding functionality", async () => {
        it("Fails if you dont send funds", async () => {
            await expect(topInvestor.fund()).to.be.revertedWith(
                "You need to spend more ETH!"
            )
        })
        it("updates the state with funded amount", async () => {
            await topInvestor.fund({ value: depositValue, from: deployer })
            const bal = await topInvestor.addressToAmountFunded(deployer)
            assert.equal(bal.toString(), depositValue.toString())
        })
        it("adds founder to array of founders", async () => {
            await topInvestor.fund({ value: depositValue })
            const funder = await topInvestor.funders(0)
            assert.equal(funder, deployer)
        })
    })
    describe("withdrawing functionality", async () => {
        beforeEach(async () => {
            await topInvestor.fund({ value: depositValue })
        })
        it("Withdraw ETH from a single founder", async () => {
            const initialContractBalance =
                await topInvestor.provider.getBalance(topInvestor.address)
            const initialDeployerBalance =
                await topInvestor.provider.getBalance(deployer)

            const transactionRes = await topInvestor.withdraw()
            const res = await transactionRes.wait(1)
            const { gasUsed, effectiveGasPrice } = res
            const gasCost = gasUsed.mul(effectiveGasPrice)
            const finalContractBalance = await topInvestor.provider.getBalance(
                topInvestor.address
            )
            const finalDeployerBalance = await topInvestor.provider.getBalance(
                deployer
            )

            assert.equal(finalContractBalance, 0)
            assert.equal(
                initialContractBalance.add(initialDeployerBalance).toString(),
                finalDeployerBalance.add(gasCost).toString()
            )
        })
        it("allows the withdrawal for multiple funders", async () => {
            const accounts = await ethers.getSigners()
            for (let i = 1; i < 6; i++) {
                const topInvestorConnectedContract = await topInvestor.connect(
                    accounts[i]
                )
                await topInvestorConnectedContract.fund({ value: depositValue })
            }
            const initialContractBalance =
                await topInvestor.provider.getBalance(topInvestor.address)
            const initialDeployerBalance =
                await topInvestor.provider.getBalance(deployer)

            const transactionRes = await topInvestor.withdraw()
            const res = await transactionRes.wait(1)
            const { gasUsed, effectiveGasPrice } = res
            const gasCost = gasUsed.mul(effectiveGasPrice)
            const finalContractBalance = await topInvestor.provider.getBalance(
                topInvestor.address
            )
            const finalDeployerBalance = await topInvestor.provider.getBalance(
                deployer
            )

            await expect(topInvestor.funders(0)).to.be.reverted

            for (i = 1; i < 6; i++) {
                assert.equal(
                    await topInvestor.addressToAmountFunded(
                        accounts[i].address
                    ),
                    0
                )
            }
        })
    })
})
