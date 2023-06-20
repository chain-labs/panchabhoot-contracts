import { task } from "hardhat/config";
import { parseUnits } from "ethers/lib/utils";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { contractsName } from "../test/Constants";
import { Controller } from "../typechain-types";
import { DiscountManager } from "../test/utils/discountCodes.utils";
const pointOneEthPrice = parseUnits("0.1", "ether");

async function generateNewCode({receiver, discount}: any, hre: HardhatRuntimeEnvironment) {
  const { ethers, network } = hre;
  const discountedPrice = parseUnits(discount, "18");

  // considering signer is the discount signer
  const [discountSigner] = await ethers.getSigners();

  const controllerInstance = (await ethers.getContract(
    contractsName.CONTROLLER
  )) as Controller;
  
  if(await controllerInstance.getDiscountSigner() !== discountSigner.address) {
    throw Error("Signer is not set as discount signer on the Controller");
  }

  // initialise DiscountManager clas
  const discountManager = new DiscountManager(false, discountSigner);

  const discountCode = await discountManager.generateNewDiscountCode(discountedPrice, receiver);
  const parsedDiscountCode = await discountManager.parseCode(discountCode);
  console.log("Discount Code", parsedDiscountCode);
}

task("generateNewCode", "Generates new discount code").addParam("receiver","Receiver address").addParam("discount", "discounted price"
).setAction(generateNewCode);