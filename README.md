# TopInvestor Contract

**SPDX-License-Identifier: MIT**

## Description

The TopInvestor contract is a demo contract that rewards the top investor based on their funding amount. It utilizes the Chainlink Price Aggregator interface to convert the funding amount from Ether (ETH) to USD. The contract keeps track of the funding amounts for each address and allows the contract owner to withdraw the funds. Created with referrence to Free Code Camp Solidity course.

## Features

- Allows users to fund the contract with ETH.
- Converts the funding amount from ETH to USD using Chainlink Price Aggregator.
- Rewards the top investor based on the funding amount.
- Allows the contract owner to withdraw the funds.

## Usage

1. Deploy the contract to an Ethereum network.
2. Provide the address of the Chainlink Price Aggregator as a constructor parameter during deployment.
3. Users can fund the contract by sending ETH to the contract's `fund` function.
4. The contract will check if the funding amount meets the minimum requirement in USD.
5. The contract will keep track of the funding amounts for each address.
6. The contract owner can withdraw the funds by calling the `withdraw` function.
