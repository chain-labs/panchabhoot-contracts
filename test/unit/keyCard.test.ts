import { KeyCard } from "./../../typechain-types/contracts/KeyCard/KeyCard";
import { INITIALIZABLE_ALREADY_INITIALIZED } from "./../ERROR_STRINGS";
import { expect } from "chai";
import { ethers, upgrades } from "hardhat";
import { time } from "@nomicfoundation/hardhat-network-helpers";
import { contractsName, UNIT_TEST } from "../Constants";
import { KeyCard__factory } from "../../typechain-types";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

const setupKeyCard = async (signer: SignerWithAddress) => {
  const keyCardFactory = (await ethers.getContractFactory(
    contractsName.KEY_CARD,
    signer
  )) as KeyCard__factory;
  const keyCardInstance = (await keyCardFactory.deploy()) as KeyCard;
  return { keyCardInstance, keyCardFactory };
};

describe(`${UNIT_TEST}:${contractsName.KEY_CARD}`, () => {
  let keyCardInstance: KeyCard;
  let keyCardFactory: KeyCard__factory;
  let owner: SignerWithAddress;
  let admin: SignerWithAddress;
  let minter: SignerWithAddress;
  let notMinter: SignerWithAddress;
  let receiver: SignerWithAddress;
  let newMinter: SignerWithAddress;
  const hundredMaximumTokens = 100;
  const mintTenTokens = 10;
  const name = "Test Key Card";
  const symbol = "TKC";
  beforeEach("!! setup initial parameters", async () => {
    [owner, admin, minter, notMinter, newMinter, receiver] =
      await ethers.getSigners();
    ({ keyCardInstance, keyCardFactory } = await setupKeyCard(owner));
  });
  context("initialise key card", () => {
    it("initialises with correct parameters", async () => {
      await keyCardInstance.initialize(
        name,
        symbol,
        admin.address,
        minter.address
      );
      expect(
        await keyCardInstance.hasRole(
          await keyCardInstance.MINTER_ROLE(),
          minter.address
        )
      ).to.be.true;
      expect(
        await keyCardInstance.hasRole(
          await keyCardInstance.DEFAULT_ADMIN_ROLE(),
          admin.address
        )
      ).to.be.true;
    });
    it("cannot be initialised after it is initialised", async () => {
      await keyCardInstance.initialize(
        name,
        symbol,
        admin.address,
        minter.address
      );
      await expect(
        keyCardInstance.initialize(name, symbol, admin.address, minter.address)
      ).to.be.revertedWith(INITIALIZABLE_ALREADY_INITIALIZED);
    });
  });
  context("already initialised", () => {
    beforeEach("!! initialise", async () => {
      await keyCardInstance.initialize(
        name,
        symbol,
        admin.address,
        minter.address
      );
    });

    context("changing access control roles", () => {
      it("change minter address", async () => {
        await keyCardInstance
          .connect(admin)
          .revokeRole(await keyCardInstance.MINTER_ROLE(), minter.address);
        await keyCardInstance
          .connect(admin)
          .revokeRole(await keyCardInstance.MINTER_ROLE(), newMinter.address);
      });
    });
    context("mint tokens", () => {
      it("cannot mint tokens if not invoked by minter", async () => {
        await expect(
          keyCardInstance
            .connect(notMinter)
            .mint(receiver.address, mintTenTokens)
        ).to.be.reverted;
      });
      it("mint tokens with minter", async () => {
        expect(await keyCardInstance.balanceOf(receiver.address)).to.equal(0);
        await keyCardInstance
          .connect(minter)
          .mint(receiver.address, mintTenTokens);
        expect(await keyCardInstance.balanceOf(receiver.address)).to.equal(
          mintTenTokens
        );
      });
    });
  });
});
