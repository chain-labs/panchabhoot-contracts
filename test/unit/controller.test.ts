import {
  INITIALIZABLE_ALREADY_INITIALIZED,
  OWNABLE_NOT_OWNER,
} from "./../ERROR_STRINGS";
// eslint-disable-next-line
import { Controller__factory } from "./../../typechain-types/factories/contracts/Controller/Controller__factory";
import { Controller } from "./../../typechain-types/contracts/Controller/Controller";
import { UNIT_TEST, contractsName } from "../Constants";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";
const { AddressZero } = ethers.constants;

const deployController = async (signer: SignerWithAddress, ethers: any) => {
  const controllerFactory = (await ethers.getContractFactory(
    contractsName.CONTROLLER,
    signer
  )) as Controller__factory; // eslint-disable-line
  const controller = (await controllerFactory.deploy()) as Controller;
  return { controller, controllerFactory };
};

describe(`${UNIT_TEST}${contractsName.CONTROLLER}`, () => {
  let controllerInstance: Controller;
  // eslint-disable-next-line
  let controllerFactory: Controller__factory;
  let owner: SignerWithAddress;
  let notOwner: SignerWithAddress;

  // todo: avatar and key card should be contract instance and not Signer
  let avatarInstance: SignerWithAddress;
  let newAvatarInstance: SignerWithAddress;
  let keyCardInstance: SignerWithAddress;
  let newKeyCardInstance: SignerWithAddress;

  beforeEach("!! deploy controller", async () => {
    [
      owner,
      notOwner,
      avatarInstance,
      newAvatarInstance,
      keyCardInstance,
      newKeyCardInstance,
    ] = await ethers.getSigners();
    ({ controller: controllerInstance, controllerFactory } =
      await deployController(owner, ethers));
  });
  context("Controller is not setup", () => {
    it("controller is not set", async () => {
      expect(await controllerInstance.getAvatar()).to.be.equal(AddressZero);
      expect(await controllerInstance.getKeyCard()).to.be.equal(AddressZero);
      expect(await controllerInstance.owner()).to.be.equal(AddressZero);
    });
    it("initializes controller", async () => {
      const payees = [owner.address];
      const shares = [1];
      await controllerInstance.initialize(
        avatarInstance.address,
        keyCardInstance.address,
        payees,
        shares
      );
    });
    it("cannot initialise the controller again", async () => {
      // initialise for the first time
      const payees = [owner.address];
      // todo: remove magic value in shares array
      const shares = [1];
      await controllerInstance.initialize(
        avatarInstance.address,
        keyCardInstance.address,
        payees,
        shares
      );

      // try to initialise again
      await expect(
        controllerInstance.initialize(
          avatarInstance.address,
          keyCardInstance.address,
          payees,
          shares
        )
      ).to.be.revertedWith(INITIALIZABLE_ALREADY_INITIALIZED);
    });
  });
  context("Controller is initialised", () => {
    let payees = [];
    let shares = [];
    beforeEach("!! setup controller", async () => {
      payees = [owner.address];
      // todo: remove magic value in shares array
      shares = [1];
      await controllerInstance.initialize(
        avatarInstance.address,
        keyCardInstance.address,
        payees,
        shares
      );
    });
    context("checking if controller is initialised", () => {
      it("controller is initialised", async () => {
        expect(await controllerInstance.getAvatar()).to.be.equal(
          avatarInstance.address
        );
        expect(await controllerInstance.getKeyCard()).to.be.equal(
          keyCardInstance.address
        );
        expect(await controllerInstance.owner()).to.be.equal(owner.address);
      });
    });
    context("set avatar", () => {
      it("avatar cannot be updated by owner", async () => {
        await expect(
          controllerInstance
            .connect(notOwner)
            .setAvatar(newAvatarInstance.address)
        ).to.be.revertedWith(OWNABLE_NOT_OWNER);
      });
      it("avatar can only be set by owner", async () => {
        await controllerInstance
          .connect(owner)
          .setAvatar(newAvatarInstance.address);

        // check avatar is set
        expect(await controllerInstance.getAvatar()).to.be.equal(
          newAvatarInstance.address
        );
      });
    });
    context("set key card", () => {
      it("key card cannot be set by owner", async () => {
        await expect(
          controllerInstance
            .connect(notOwner)
            .setKeyCard(newKeyCardInstance.address)
        ).to.be.revertedWith(OWNABLE_NOT_OWNER);
      });
      it("key card can only be updated by owner", async () => {
        await controllerInstance
          .connect(owner)
          .setKeyCard(newKeyCardInstance.address);

        // check if new avatar is set
        expect(await controllerInstance.getKeyCard()).to.be.equal(
          newKeyCardInstance.address
        );
      });
    });
  });
});
