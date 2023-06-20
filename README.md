# Panchabhoot Smart Contracts

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat run scripts/deploy.ts
```

## Steps to generate new Discount Code
Create .env file
```
ETHERSCAN_KEY=
INFURA_KEY =
MNEMONIC =
PRIVATE_KEY =
COINMARKETCAP=

// should always be true
NOT_CI=true
```

Run yarn install

```
yarn hardhat generateNewCode --receiver ADDRESS --discount DISCOUNTED_PRICE --network NETWORK
```

example: Generate a discount code for following address. The new discounted price is "0.00001" ETH on goerli network.
```
yarn hardhat generateNewCode --receiver 0x5F5A30564388e7277818c15DB0d511AAbbD0eC80 --discount "0.00001" --network goerli
```
