import { checkForUndefined } from "./utils/checkers";
import dotenv from "dotenv";
import { HardhatUserConfig } from "hardhat/config";
import { NetworkUserConfig } from "hardhat/types";
import "@tenderly/hardhat-tenderly";
import "@nomicfoundation/hardhat-toolbox";
import "hardhat-packager";
import "hardhat-tracer";
import "hardhat-deploy";
import "@openzeppelin/hardhat-upgrades";
import "./tasks/saleCategoryManagement.task";
import "./tasks/discountCodeManagement.task";
import "./tasks/relayerCheck.task";
import "./tasks/upgradeContracts.task";
dotenv.config({ path: "./.env" });

const {
  INFURA_KEY,
  ETHERSCAN_KEY,
  POLYGONSCAN_KEY,
  PRIVATE_KEY,
  MNEMONIC,
  NOT_CI,
} = process.env;

if (NOT_CI === "true") {
  checkForUndefined("INFURA_KEY", INFURA_KEY);
  checkForUndefined("ETHERSCAN_KEY", ETHERSCAN_KEY);
  checkForUndefined("PRIVATE_KEY", PRIVATE_KEY);
  checkForUndefined("MNEMONIC", MNEMONIC);
  checkForUndefined("POLYGONSCAN_KEY", POLYGONSCAN_KEY);
}

const OPTIMIZER_RUNS = 1000;

const sharedNetworkConfig: NetworkUserConfig = {};

const sharedCompilerConfig = {
  optimizer: {
    enabled: true,
    runs: OPTIMIZER_RUNS,
  },
  outputSelection: {
    "*": {
      "*": ["storageLayout"],
    },
  },
};

// Order of priority for account/signer generation:
// 1) .env/PRIVATE_KEY
// 2) .env/MNEMONIC
// 3) default mnemonic
if (PRIVATE_KEY) {
  sharedNetworkConfig.accounts = [PRIVATE_KEY];
} else if (MNEMONIC) {
  sharedNetworkConfig.accounts = {
    mnemonic: MNEMONIC,
  };
} else {
  sharedNetworkConfig.accounts = {
    mnemonic: "Life is tufff",
  };
}

const config: HardhatUserConfig = {
  defaultNetwork: "hardhat",
  paths: {
    artifacts: "build/artifacts",
    cache: "build/cache",
    deploy: "deploy",
    sources: "contracts",
  },
  tenderly: {
    project: "project",
    username: "codebuster22",
  },
  networks: {
    ethereum: {
      ...sharedNetworkConfig,
      url: `https://mainnet.infura.io/v3/${INFURA_KEY}`,
    },
    goerli: {
      ...sharedNetworkConfig,
      url: `https://goerli.infura.io/v3/${INFURA_KEY}`,
    },
    matic: {
      ...sharedNetworkConfig,
      url: `https://polygon-mainnet.infura.io/v3/${INFURA_KEY}`,
    },
  },
  solidity: {
    compilers: [
      {
        version: "0.8.17",
        settings: sharedCompilerConfig,
      },
    ],
  },
  gasReporter: {
    enabled: true,
    currency: "USD",
    coinmarketcap: "",
    excludeContracts: ["contracts/testing/"],
  },
  contractSizer: {
    alphaSort: true,
    disambiguatePaths: false,
    runOnCompile: true,
    strict: true,
  },
  namedAccounts: {
    deployer: 0,
  },
  etherscan: {
    apiKey: {
      ethereum: ETHERSCAN_KEY,
      goerli: ETHERSCAN_KEY,
      polygon: POLYGONSCAN_KEY,
    },
  },
  external: {
    contracts: [
      {
        artifacts: "./imports/artifacts",
      },
    ],
  },
};

export default config;
