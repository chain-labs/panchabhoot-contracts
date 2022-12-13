import { Avatar__factory } from "./../../typechain-types/factories/contracts/Avatar/Avatar__factory";
import { expect } from "chai";
import { ethers, upgrades } from "hardhat";
import { time } from "@nomicfoundation/hardhat-network-helpers";
import { contractsName, UNIT_TEST } from "../Constants";
import { Avatar } from "../../typechain-types";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

const setupAvatar = async (signer: SignerWithAddress) => {
  const avatarFactory = (await ethers.getContractFactory(
    contractsName.AVATAR,
    signer
  )) as Avatar__factory;
  const avatarInstance = (await avatarFactory.deploy()) as Avatar;
  return { avatarInstance, avatarFactory };
};

describe.only(`${UNIT_TEST}${contractsName.AVATAR}`, () => {
  let avatarInstance: Avatar;
  let avatarFactory: Avatar__factory;
  let owner: SignerWithAddress;
  const hundredMaximumTokens = 100;
  beforeEach("!! setup initial parameters", async () => {
    [owner] = await ethers.getSigners();
    ({ avatarInstance, avatarFactory } = await setupAvatar(owner));
  });
  context("set maximum number of tokens", () => {
    it("set maximum tokens", async () => {
      await avatarInstance.setMaximumTokens(hundredMaximumTokens);
      expect(await avatarInstance.getMaximumTokens()).to.equal(
        hundredMaximumTokens
      );
    });
  });
});
