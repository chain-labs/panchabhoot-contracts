/* eslint no-empty-pattern: 1 */
import dotenv from "dotenv";
import { task } from "hardhat/config";
import { SaleCategoryParams } from "../types/ContractParameters";
import { parseUnits } from "ethers/lib/utils";
import { Transaction, constants } from "ethers";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { contractsName } from "../test/Constants";
import { Controller } from "../typechain-types";
import { MerkleTreeManagement } from "../test/utils/merkleDrop.utils";
import { checkForUndefined } from "../utils/checkers";
const pointOneEthPrice = parseUnits("0.00001", "ether");
dotenv.config({ path: "./.env" });

const getParams = async (currentTime: number) => {
  checkForUndefined("Pinata JWT key", process.env.Pinata_JWT);
  const whitelisted = [
    "0x67BE2C36e75B7439ffc2DCb99dBdF4fbB2455930",
    "0x5F5A30564388e7277818c15DB0d511AAbbD0eC80",
    "0x0b563F844fFAb97E54150cd7D2Aa4aFbCD6B69Ca",
    "0xd18Cd50a6bDa288d331e3956BAC496AAbCa4960d",
    "0x88477cF43CC870567dAaBC4FbA6700f105A54894"
  ];
  const merkleTree = new MerkleTreeManagement(
    whitelisted,
    "",
    process.env.Pinata_JWT,
    true
  );
  await merkleTree.setup();
  const merkleRoot = merkleTree.getRoot();
  console.log(`IPFS CID of whitelist is: ${merkleTree.cid}`);
  const presalecategoryParams: SaleCategoryParams = {
    price: pointOneEthPrice,
    merkleRoot: constants.HashZero,
    perWalletLimit: "10000000000000000000",
    perTransactionLimit: "10000000000000000000",
    supply: "10000000000000000000",
    keyCardPerAvatar: 2,
    startTime: currentTime + 1000,
    endTime: currentTime + 10000000,
    phase: 0,
    isDiscountEnabled: false,
  };
  const allowlistedCategoryParams: SaleCategoryParams = {
    price: pointOneEthPrice,
    merkleRoot: merkleRoot,
    perWalletLimit: "10000000000000000000",
    perTransactionLimit: "10000000000000000000",
    supply: "10000000000000000000",
    keyCardPerAvatar: 2,
    startTime: currentTime + 1000,
    endTime: currentTime + 10000000,
    phase: 0,
    isDiscountEnabled: false,
  };
  const allowlistedDiscountedCategoryParams: SaleCategoryParams = {
    price: pointOneEthPrice,
    merkleRoot: merkleRoot,
    perWalletLimit: "10000000000000000000",
    perTransactionLimit: "10000000000000000000",
    supply: "10000000000000000000",
    keyCardPerAvatar: 2,
    startTime: currentTime + 1000,
    endTime: currentTime + 10000000,
    phase: 0,
    isDiscountEnabled: true,
  };
  const discountedCategoryParams: SaleCategoryParams = {
    price: pointOneEthPrice,
    merkleRoot: constants.HashZero,
    perWalletLimit: "10000000000000000000",
    perTransactionLimit: "10000000000000000000",
    supply: "10000000000000000000",
    keyCardPerAvatar: 1,
    startTime: currentTime + 1000,
    endTime: currentTime + 10000000,
    phase: 0,
    isDiscountEnabled: true,
  };
  const publicSaleCategoryParams: SaleCategoryParams = {
    price: pointOneEthPrice,
    merkleRoot: constants.HashZero,
    perWalletLimit: "10000000000000000000",
    perTransactionLimit: "10000000000000000000",
    supply: "10000000000000000000",
    keyCardPerAvatar: 1,
    startTime: currentTime + 10000,
    endTime: currentTime + 10000000,
    phase: 0,
    isDiscountEnabled: false,
  };

  return {
    presalecategoryParams,
    discountedCategoryParams,
    publicSaleCategoryParams,
    allowlistedCategoryParams,
    allowlistedDiscountedCategoryParams,
  };
};

async function addSale(
  func: Function,
  params: SaleCategoryParams
): Promise<Transaction> {
  return await (
    await func(
      params.startTime,
      params.endTime,
      params.price,
      params.merkleRoot,
      params.perWalletLimit,
      params.perTransactionLimit,
      params.supply,
      params.keyCardPerAvatar,
      params.phase,
      params.isDiscountEnabled as boolean
    )
  ).wait();
}
// @ts-ignore
async function addInitialSales({}, hre: HardhatRuntimeEnvironment) {
  const { ethers } = hre;
  const {
    presalecategoryParams,
    discountedCategoryParams,
    publicSaleCategoryParams,
  } = await getParams(Math.ceil(Date.now() / 1000));
  const controllerInstance = (await ethers.getContract(
    contractsName.CONTROLLER
  )) as Controller;

  // add presale
  console.log("Add presale sale category");
  await addSale(controllerInstance.addSale, presalecategoryParams);
  console.log("Added presale sale category");

  // add discounted sale
  console.log("Add Discounted sale category");
  await addSale(controllerInstance.addSale, discountedCategoryParams);
  console.log("Added Discounted sale category");

  // add public sale
  console.log("Add Public sale category");
  await addSale(controllerInstance.addSale, publicSaleCategoryParams);
  console.log("Added Public sale category");
}

async function addAllowlistSale({}, hre: HardhatRuntimeEnvironment) {
  const { ethers } = hre;
  const { allowlistedCategoryParams } = await getParams(
    Math.ceil(Date.now() / 1000)
  );
  const controllerInstance = (await ethers.getContract(
    contractsName.CONTROLLER
  )) as Controller;
  // add public sale
  console.log("Add Allowlist category");
  await addSale(controllerInstance.addSale, allowlistedCategoryParams);
  console.log("Added Allowlist category");
}

async function addAllowlistDiscountSale({}, hre: HardhatRuntimeEnvironment) {
  const { ethers } = hre;
  const { allowlistedDiscountedCategoryParams } = await getParams(
    Math.ceil(Date.now() / 1000)
  );
  const controllerInstance = (await ethers.getContract(
    contractsName.CONTROLLER
  )) as Controller;
  // add public sale
  console.log("Add Allowlist Discount category");
  await addSale(controllerInstance.addSale, allowlistedDiscountedCategoryParams);
  console.log("Added Allowlist Discount category");
}

async function addPublicSale({}, hre: HardhatRuntimeEnvironment) {
  const { ethers } = hre;
  const { publicSaleCategoryParams } = await getParams(
    Math.ceil(Date.now() / 1000)
  );
  const controllerInstance = (await ethers.getContract(
    contractsName.CONTROLLER
  )) as Controller;
  // add public sale
  console.log("Add Public sale category");
  await addSale(controllerInstance.addSale, publicSaleCategoryParams);
  console.log("Added Public sale category");
}

async function addDiscountedSale({}, hre: HardhatRuntimeEnvironment) {
  const { ethers } = hre;
  const { discountedCategoryParams } = await getParams(
    Math.ceil(Date.now() / 1000)
  );
  const controllerInstance = (await ethers.getContract(
    contractsName.CONTROLLER
  )) as Controller;
  // add discounted sale
  console.log("Add Discounted sale category");
  await addSale(controllerInstance.addSale, discountedCategoryParams);
  console.log("Added Discounted sale category");
}

task(
  "addInitialSaleCategories",
  "Add a presale, discounted sale and public sale for newly created controller."
).setAction(addInitialSales);

task("addNewDiscountedSale", "Add new discounted sale").setAction(
  addDiscountedSale
);

task("addNewPublicSale", "Add new Public sale").setAction(addPublicSale);

task("addNewAllowlistSale", "Add new Allowlisted sale").setAction(addAllowlistSale);

task("addNewAllowDiscountSale", "Add new Allowlisted Discounted sale").setAction(addAllowlistDiscountSale);
