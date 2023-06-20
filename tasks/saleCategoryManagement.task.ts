/* eslint no-empty-pattern: 1 */
import { task } from "hardhat/config";
import { SaleCategoryParams } from "../types/ContractParameters";
import { parseUnits } from "ethers/lib/utils";
import { Transaction, constants } from "ethers";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { contractsName } from "../test/Constants";
import { Controller } from "../typechain-types";
const pointOneEthPrice = parseUnits("0.1", "ether");

const getParams = (currentTime: number) => {
  const presalecategoryParams: SaleCategoryParams = {
    price: pointOneEthPrice,
    merkleRoot: constants.HashZero,
    perWalletLimit: 4,
    perTransactionLimit: 3,
    supply: 100,
    keyCardPerAvatar: 2,
    startTime: currentTime + 1000,
    endTime: currentTime + 10000000,
    phase: 0,
    isDiscountEnabled: false,
  };
  const discountedCategoryParams: SaleCategoryParams = {
    price: pointOneEthPrice,
    merkleRoot: constants.HashZero,
    perWalletLimit: 4,
    perTransactionLimit: 4,
    supply: 100,
    keyCardPerAvatar: 1,
    startTime: currentTime + 1000,
    endTime: currentTime + 10000000,
    phase: 0,
    isDiscountEnabled: true,
  };
  const publicSaleCategoryParams: SaleCategoryParams = {
    price: pointOneEthPrice,
    merkleRoot: constants.HashZero,
    perWalletLimit: 4,
    perTransactionLimit: 3,
    supply: 200,
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
  } = getParams(Math.ceil(Date.now() / 1000));
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

async function addPublicSale({}, hre: HardhatRuntimeEnvironment) {
  const { ethers } = hre;
  const { publicSaleCategoryParams } = getParams(Math.ceil(Date.now() / 1000));
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
  const { discountedCategoryParams } = getParams(Math.ceil(Date.now() / 1000));
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
