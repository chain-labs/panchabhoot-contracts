import { task } from "hardhat/config";
import { parseUnits } from "ethers/lib/utils";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { contractsName } from "../test/Constants";
import { Controller } from "../typechain-types";
import { DiscountManager } from "../test/utils/discountCodes.utils";
import { Address } from "hardhat-deploy/dist/types";

async function generateNewCode(
  { receiver, discount }: any,
  hre: HardhatRuntimeEnvironment
) {
  const { ethers } = hre;
  const discountedPrice = parseUnits(discount, "18");

  // considering signer is the discount signer
  const [discountSigner] = await ethers.getSigners();

  const controllerInstance = (await ethers.getContract(
    contractsName.CONTROLLER
  )) as Controller;

  if (
    (await controllerInstance.getDiscountSigner()) !== discountSigner.address
  ) {
    throw Error("Signer is not set as discount signer on the Controller");
  }

  // initialise DiscountManager clas
  const discountManager = new DiscountManager(false, discountSigner);

  const discountCode = await discountManager.generateNewDiscountCode(
    discountedPrice,
    receiver
  );
  const parsedDiscountCode = await discountManager.parseCode(discountCode);
  console.log("Discount Code", parsedDiscountCode);
}

task("generateNewCode", "Generates new discount code")
  .addParam("receiver", "Receiver address")
  .addParam("discount", "discounted price")
  .setAction(generateNewCode);

interface SetDiscountSignerUserArguments {
  discountsigner?: Address;
}

async function setNewDiscountSigner(
  { discountsigner }: SetDiscountSignerUserArguments,
  hre: HardhatRuntimeEnvironment
) {
  const { ethers } = hre;
  const [deployer] = await ethers.getSigners();
  let discountSigner: Address;
  const controller = (await ethers.getContract(
    contractsName.CONTROLLER
  )) as Controller;
  if (discountsigner === undefined) {
    discountSigner = deployer.address;
    console.log(
      `Setting current signer ${deployer.address} as the dsicount signer on ${controller.address} contract`
    );
  } else {
    discountSigner = discountsigner;
    console.log(
      `Setting ${discountsigner} as the Discount Signer on ${controller.address} contract`
    );
  }
  const transaction = await controller.setDiscountSigner(discountSigner);
  await transaction.wait();
  console.log(`Successfully added discount signer`);
}

task("setNewDiscountSigner", "Set new discount signer")
  .addOptionalParam("discountsigner", "discount signer address")
  .setAction(setNewDiscountSigner);
