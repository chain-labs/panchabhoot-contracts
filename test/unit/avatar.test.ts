import { INITIALIZABLE_ALREADY_INITIALIZED } from "./../ERROR_STRINGS";
import { Avatar__factory } from "./../../typechain-types/factories/contracts/Avatar/Avatar__factory"; // eslint-disable-line
import { expect } from "chai";
import { ethers } from "hardhat";
import { contractsName, UNIT_TEST } from "../Constants";
import { Avatar } from "../../typechain-types";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

const setupAvatar = async (signer: SignerWithAddress) => {
  const avatarFactory = (await ethers.getContractFactory(
    contractsName.AVATAR,
    signer
  )) as Avatar__factory; // eslint-disable-line
  const avatarInstance = (await avatarFactory.deploy()) as Avatar;
  return { avatarInstance, avatarFactory };
};

describe(`${UNIT_TEST}${contractsName.AVATAR}`, () => {
  let avatarInstance: Avatar;
  let owner: SignerWithAddress;
  let admin: SignerWithAddress;
  let minter: SignerWithAddress;
  let notMinter: SignerWithAddress;
  let receiver: SignerWithAddress;
  let newMinter: SignerWithAddress;
  const hundredMaximumTokens = 100;
  const mintTenTokens = 10;
  const name = "Test Avatar Token";
  const symbol = "TAT";
  beforeEach("!! setup initial parameters", async () => {
    [owner, admin, minter, notMinter, newMinter, receiver] =
      await ethers.getSigners();
    ({ avatarInstance } = await setupAvatar(owner));
  });
  context("initialise avatar", () => {
    it("initialises with correct parameters", async () => {
      await avatarInstance.initialize(
        name,
        symbol,
        hundredMaximumTokens,
        admin.address,
        minter.address
      );
      // eslint-disable-next-line
      expect(
        await avatarInstance.hasRole(
          await avatarInstance.MINTER_ROLE(),
          minter.address
        )
      ).to.be.true;
      // eslint-disable-next-line
      expect(
        await avatarInstance.hasRole(
          await avatarInstance.DEFAULT_ADMIN_ROLE(),
          admin.address
        )
      ).to.be.true;
    });
    it("cannot be initialised after it is initialised", async () => {
      await avatarInstance.initialize(
        name,
        symbol,
        hundredMaximumTokens,
        admin.address,
        minter.address
      );
      await expect(
        avatarInstance.initialize(
          name,
          symbol,
          hundredMaximumTokens,
          admin.address,
          minter.address
        )
      ).to.be.revertedWith(INITIALIZABLE_ALREADY_INITIALIZED);
    });
  });
  context("avatar is initialised", () => {
    beforeEach("!! initialise", async () => {
      await avatarInstance.initialize(
        name,
        symbol,
        hundredMaximumTokens,
        admin.address,
        minter.address
      );
    });
    context("changing access control roles", () => {
      it("change minter address", async () => {
        await avatarInstance
          .connect(admin)
          .revokeRole(await avatarInstance.MINTER_ROLE(), minter.address);
        await avatarInstance
          .connect(admin)
          .revokeRole(await avatarInstance.MINTER_ROLE(), newMinter.address);
      });
    });
    context("set maximum number of tokens", () => {
      it("set maximum tokens", async () => {
        await avatarInstance.setMaximumTokens(hundredMaximumTokens);
        expect(await avatarInstance.getMaximumTokens()).to.equal(
          hundredMaximumTokens
        );
      });
    });
    context("mint tokens", () => {
      it("cannot mint tokens if not invoked by minter", async () => {
        await expect(
          avatarInstance
            .connect(notMinter)
            .mint(receiver.address, mintTenTokens)
        ).to.be.reverted;
      });
      it("mint tokens with minter", async () => {
        expect(await avatarInstance.balanceOf(receiver.address)).to.equal(0);
        await avatarInstance
          .connect(minter)
          .mint(receiver.address, mintTenTokens);
        expect(await avatarInstance.balanceOf(receiver.address)).to.equal(
          mintTenTokens
        );
      });
    });
  });
});
