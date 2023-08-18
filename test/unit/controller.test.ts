import { KeyCard } from "./../../typechain-types/contracts/KeyCard/KeyCard";
import { KeyCard__factory } from "./../../typechain-types/factories/contracts/KeyCard/KeyCard__factory"; // eslint-disable-line
import { Avatar } from "./../../typechain-types/contracts/Avatar/Avatar";
import { Avatar__factory } from "./../../typechain-types/factories/contracts/Avatar/Avatar__factory"; // eslint-disable-line
import { BytesLike, BigNumberish, BigNumber } from "ethers";
import {
  SaleCategory,
  SaleCategoryParams,
} from "./../../types/ContractParameters";
import { time } from "@nomicfoundation/hardhat-network-helpers";
import {
  ARRAYS_LENGTH_DONT_MATCH,
  CONTROLLER_END_TIME_BEHIND,
  CONTROLLER_INEXISTENT_SALE_CATEGORY,
  CONTROLLER_INVALID_DISCOUNT_CODE,
  CONTROLLER_LIMIT_GREATER,
  CONTROLLER_START_TIME_IN_PAST,
  INITIALIZABLE_ALREADY_INITIALIZED,
  OWNABLE_NOT_OWNER,
  PAUSABLE_NOT_PAUSED,
  PAUSABLE_PAUSED,
  PHASE_INACTIVE,
  PHASE_IS_ALREADY_ACTIVE,
  TOKENS_ALREADY_RESERVED,
} from "./../ERROR_STRINGS";
// eslint-disable-next-line
import { Controller__factory } from "./../../typechain-types/factories/contracts/Controller/Controller__factory";
import { Controller } from "./../../typechain-types/contracts/Controller/Controller";
import {
  UNIT_TEST,
  contractsName,
  TOKENS_TO_RESERVE,
  MAX_PHASES,
  DISCOUNT_CODE_MESSAGE,
} from "../Constants";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";
import {
  arrayify,
  hashMessage,
  parseUnits,
  solidityKeccak256,
} from "ethers/lib/utils";
import { Address } from "hardhat-deploy/dist/types";
import dotenv from "dotenv";
import { MerkleTreeManagement } from "../utils/merkleDrop.utils";
import { DiscountManager } from "../utils/discountCodes.utils";
dotenv.config({ path: "./.env" });
const { AddressZero, HashZero } = ethers.constants;

const IPFS_API = process.env.PINATA_JWT_KEY;
const isProduction = process.env.PRODUCTION === "true";
const notCI = process.env.NOT_CI === "true";

const toMinutes = (minutes: number) => minutes * 60;

const addSaleCategory = async (
  params: SaleCategoryParams,
  controllerInstance: Controller
) => {
  await controllerInstance.addSale(
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
  );
};

const deployController = async (signer: SignerWithAddress, ethers: any) => {
  const controllerFactory = (await ethers.getContractFactory(
    contractsName.CONTROLLER,
    signer
  )) as Controller__factory; // eslint-disable-line
  const controller = (await controllerFactory.deploy()) as Controller;
  return { controller, controllerFactory };
};

const deployKeyCard = async (signer: SignerWithAddress) => {
  const keyCardFactory = (await ethers.getContractFactory(
    contractsName.KEY_CARD,
    signer
  )) as KeyCard__factory; // eslint-disable-line
  const keyCardInstance = (await keyCardFactory.deploy()) as KeyCard;
  return { keyCardInstance, keyCardFactory };
};

const deployAvatar = async (signer: SignerWithAddress) => {
  const avatarFactory = (await ethers.getContractFactory(
    contractsName.AVATAR,
    signer
  )) as Avatar__factory; // eslint-disable-line
  const avatarInstance = (await avatarFactory.deploy()) as Avatar;
  return { avatarInstance, avatarFactory };
};

describe(`${UNIT_TEST}${contractsName.CONTROLLER}`, () => {
  let controllerInstance: Controller;
  // eslint-disable-next-line
  let controllerFactory: Controller__factory;
  let owner: SignerWithAddress;
  let notOwner: SignerWithAddress;
  let discountSigner: SignerWithAddress;
  let newDiscountSigner: SignerWithAddress;
  let receiver: SignerWithAddress;
  let admin: SignerWithAddress;
  let keyCardInstance: KeyCard;
  let keyCardFactory: KeyCard__factory; // eslint-disable-line
  let avatarInstance: Avatar;
  let avatarFactory: Avatar__factory; // eslint-disable-line

  // todo: avatar and key card should be contract instance and not Signer
  let newAvatarInstance: Avatar;
  let newKeyCardInstance: KeyCard;
  const hundredMaximumTokens = 100;
  const avatarName = "Test Avatar Token";
  const avatarSymbol = "TAT";
  const keyCardName = "Test Key Card";
  const keyCardSymbol = "TKC";
  // constants
  beforeEach("!! deploy controller", async () => {
    [owner, notOwner, discountSigner, newDiscountSigner, receiver, admin] =
      await ethers.getSigners();
    ({ controller: controllerInstance, controllerFactory } =
      await deployController(owner, ethers));
    ({ keyCardInstance, keyCardFactory } = await deployKeyCard(owner));
    ({ avatarInstance, avatarFactory } = await deployAvatar(owner));
    ({ keyCardInstance: newKeyCardInstance } = await deployKeyCard(owner));
    ({ avatarInstance: newAvatarInstance } = await deployAvatar(owner));

    // initialise tokens
    keyCardInstance.initialize(
      keyCardName,
      keyCardSymbol,
      admin.address,
      controllerInstance.address
    );
    newKeyCardInstance.initialize(
      `New ${keyCardName}`,
      `New ${keyCardSymbol}`,
      admin.address,
      controllerInstance.address
    );

    avatarInstance.initialize(
      avatarName,
      avatarSymbol,
      hundredMaximumTokens,
      admin.address,
      controllerInstance.address
    );
    newAvatarInstance.initialize(
      `New ${avatarName}`,
      `New ${avatarSymbol}`,
      hundredMaximumTokens,
      admin.address,
      controllerInstance.address
    );
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
        discountSigner.address,
        payees,
        shares,
        TOKENS_TO_RESERVE
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
        discountSigner.address,
        payees,
        shares,
        TOKENS_TO_RESERVE
      );

      // try to initialise again
      await expect(
        controllerInstance.initialize(
          avatarInstance.address,
          keyCardInstance.address,
          discountSigner.address,
          payees,
          shares,
          TOKENS_TO_RESERVE
        )
      ).to.be.revertedWith(INITIALIZABLE_ALREADY_INITIALIZED);
    });
    it("cannot be initialised if not reserving tokens for all phases", async () => {
      // initialise for the first time
      const payees = [owner.address];
      // todo: remove magic value in shares array
      const shares = [1];

      await expect(
        controllerInstance.initialize(
          avatarInstance.address,
          keyCardInstance.address,
          discountSigner.address,
          payees,
          shares,
          TOKENS_TO_RESERVE.slice(0, -2)
        )
      ).to.be.revertedWithCustomError(
        controllerInstance,
        "SetTokensToReserveForAllPhases"
      );
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
        discountSigner.address,
        payees,
        shares,
        TOKENS_TO_RESERVE
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

        for (let i = 0; i < MAX_PHASES; i++) {
          expect(
            await controllerInstance.getTokensToReserveInPhase(i)
          ).to.equal(TOKENS_TO_RESERVE[i]);
        }
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
    context("Pause and unpause controller", () => {
      context("Pause controller", () => {
        beforeEach("!! ensure controller is unpaused", async () => {
          expect(await controllerInstance.paused()).to.equal(false);
        });
        it("controller cannot be paused by non owner", async () => {
          await expect(
            controllerInstance.connect(notOwner).pause()
          ).to.be.revertedWith(OWNABLE_NOT_OWNER);
        });
        it("controller cannot be unpaused when it is already unpaused", async () => {
          await expect(
            controllerInstance.connect(owner).unpause()
          ).to.be.revertedWith(PAUSABLE_NOT_PAUSED);
        });
        it("controller can only be paused by owner", async () => {
          await controllerInstance.connect(owner).pause();
          expect(await controllerInstance.paused()).to.equal(true);
        });
      });
      context("Unpause Controller", () => {
        beforeEach("!! ensure controller is paused", async () => {
          await controllerInstance.connect(owner).pause();
          expect(await controllerInstance.paused()).to.equal(true);
        });
        it("controller cannot be unpaused by non owner", async () => {
          await expect(
            controllerInstance.connect(notOwner).unpause()
          ).to.be.revertedWith(OWNABLE_NOT_OWNER);
        });
        it("controller cannot be unpaused when it is already paused", async () => {
          await expect(
            controllerInstance.connect(owner).pause()
          ).to.be.revertedWith(PAUSABLE_PAUSED);
        });
        it("controller can only be paused by owner", async () => {
          await controllerInstance.connect(owner).unpause();
          expect(await controllerInstance.paused()).to.equal(false);
        });
      });
    });
    context("sale dynamics", () => {
      let saleCategoryParams: SaleCategoryParams;
      let pointOneEthPrice: BigNumberish;
      let nullMerkleRoot: BytesLike;
      let tenPerWalletLimit: BigNumberish;
      let fivePerTransactionLimit: BigNumberish;
      let hundredSupply: BigNumberish;
      let twoKeysPerAvatar: BigNumberish;
      let startTimeAfterFiveMinutesFromNow: BigNumberish;
      let endTimeAfterTenMinutesFromStartTime: BigNumberish;
      let phase: number;
      let isDiscountEnabled: boolean;

      beforeEach("!! set params", async () => {
        // price = 1 ether
        pointOneEthPrice = parseUnits("0.1", "ether");
        // no permissioned
        nullMerkleRoot = HashZero;
        // ten nfts per wallet
        tenPerWalletLimit = 10;
        // five nfts per transaction
        fivePerTransactionLimit = 5;
        // hundred nfts to be minted in this sale
        hundredSupply = 100;
        // two key card per avatar
        twoKeysPerAvatar = 2;
        // time starts in five minutes from now
        startTimeAfterFiveMinutesFromNow = (await time.latest()) + toMinutes(5);
        // time ends in ten minutes after start time
        endTimeAfterTenMinutesFromStartTime =
          startTimeAfterFiveMinutesFromNow + toMinutes(10);
        // sale category is in phase 1
        phase = 1;
        // discount enabled
        isDiscountEnabled = true;
      });

      beforeEach("!! construct sale category", async () => {
        saleCategoryParams = {
          price: pointOneEthPrice,
          merkleRoot: nullMerkleRoot,
          perWalletLimit: tenPerWalletLimit,
          perTransactionLimit: fivePerTransactionLimit,
          supply: hundredSupply,
          keyCardPerAvatar: twoKeysPerAvatar,
          startTime: startTimeAfterFiveMinutesFromNow,
          endTime: endTimeAfterTenMinutesFromStartTime,
          phase,
          isDiscountEnabled,
        };
      });
      context("add new sale category", () => {
        it("new sale category cannot be added by non owner", async () => {
          await expect(
            controllerInstance
              .connect(notOwner)
              .addSale(
                saleCategoryParams.startTime,
                saleCategoryParams.endTime,
                saleCategoryParams.price,
                saleCategoryParams.merkleRoot,
                saleCategoryParams.perWalletLimit,
                saleCategoryParams.perTransactionLimit,
                saleCategoryParams.supply,
                saleCategoryParams.keyCardPerAvatar,
                saleCategoryParams.phase,
                saleCategoryParams.isDiscountEnabled as boolean
              )
          ).to.be.rejectedWith(OWNABLE_NOT_OWNER);
        });
        it("new sale category can only be added by owner", async () => {
          expect(await controllerInstance.getSaleCategoryCounter()).to.be.equal(
            0
          );
          await controllerInstance
            .connect(owner)
            .addSale(
              saleCategoryParams.startTime,
              saleCategoryParams.endTime,
              saleCategoryParams.price,
              saleCategoryParams.merkleRoot,
              saleCategoryParams.perWalletLimit,
              saleCategoryParams.perTransactionLimit,
              saleCategoryParams.supply,
              saleCategoryParams.keyCardPerAvatar,
              saleCategoryParams.phase,
              saleCategoryParams.isDiscountEnabled as boolean
            );
          expect(await controllerInstance.getSaleCategoryCounter()).to.be.equal(
            1
          );
        });
      });
      context("edit sale category", () => {
        beforeEach("!! add initial sale category", async () => {
          await controllerInstance
            .connect(owner)
            .addSale(
              saleCategoryParams.startTime,
              saleCategoryParams.endTime,
              saleCategoryParams.price,
              saleCategoryParams.merkleRoot,
              saleCategoryParams.perWalletLimit,
              saleCategoryParams.perTransactionLimit,
              saleCategoryParams.supply,
              saleCategoryParams.keyCardPerAvatar,
              saleCategoryParams.phase,
              saleCategoryParams.isDiscountEnabled as boolean
            );
        });
        context("edit sale start time of last sale category", () => {
          let newSaleStartime: number;
          let newSaleEndTime: number;
          let saleCategoryId: number;
          beforeEach("!! set sale start time", async () => {
            saleCategoryId = 1;
            newSaleStartime = (await time.latest()) + toMinutes(20);
            newSaleEndTime = newSaleStartime + toMinutes(10);
          });
          it("time period cannot be changed by non owner", async () => {
            await expect(
              controllerInstance
                .connect(notOwner)
                .editSaleTimeOfSaleCategory(
                  saleCategoryId,
                  newSaleStartime,
                  newSaleEndTime
                )
            ).to.be.revertedWith(OWNABLE_NOT_OWNER);
          });
          it("new end time cannot be behind start time", async () => {
            const newSaleEndTimeBehindStartTime = newSaleStartime - 1;
            await expect(
              controllerInstance
                .connect(owner)
                .editSaleTimeOfSaleCategory(
                  saleCategoryId,
                  newSaleStartime,
                  newSaleEndTimeBehindStartTime
                )
            ).to.be.revertedWithCustomError(
              controllerInstance,
              CONTROLLER_END_TIME_BEHIND
            );
          });
          it("new start time cannot be in past", async () => {
            const newSaleStartTimeInPast = (await time.latest()) - 1;
            await expect(
              controllerInstance
                .connect(owner)
                .editSaleTimeOfSaleCategory(
                  saleCategoryId,
                  newSaleStartTimeInPast,
                  newSaleEndTime
                )
            ).to.be.revertedWithCustomError(
              controllerInstance,
              CONTROLLER_START_TIME_IN_PAST
            );
          });
          it("cannot edit if a sale category doesn't exists", async () => {
            const inexistentSaleCategoryId = 2;
            await expect(
              controllerInstance
                .connect(owner)
                .editSaleTimeOfSaleCategory(
                  inexistentSaleCategoryId,
                  newSaleStartime,
                  newSaleEndTime
                )
            ).to.be.revertedWithCustomError(
              controllerInstance,
              CONTROLLER_INEXISTENT_SALE_CATEGORY
            );
          });
          it("set new valid sale start time", async () => {
            await controllerInstance
              .connect(owner)
              .editSaleTimeOfSaleCategory(
                saleCategoryId,
                newSaleStartime,
                newSaleEndTime
              );
          });
        });

        context("edit price of sale of sale category", () => {
          let newPrice: BigNumberish;
          let saleCategoryId: number;
          beforeEach("!! initialise new parameters", async () => {
            newPrice = parseUnits("0.2", "ether");
            saleCategoryId = 1;
          });
          it("price cannot be edited by not owner", async () => {
            await expect(
              controllerInstance
                .connect(notOwner)
                .editPriceOfSaleCategory(saleCategoryId, newPrice)
            ).to.be.revertedWith(OWNABLE_NOT_OWNER);
          });
          it("price cannot be changed for inexistent sale category", async () => {
            const inexistentSaleCategoryId = 2;
            await expect(
              controllerInstance
                .connect(owner)
                .editPriceOfSaleCategory(inexistentSaleCategoryId, newPrice)
            ).to.be.revertedWithCustomError(
              controllerInstance,
              CONTROLLER_INEXISTENT_SALE_CATEGORY
            );
          });
          it("price can only be changed by owner for existent sale category", async () => {
            const oldSaleCategory: SaleCategory =
              await controllerInstance.getSaleCategory(saleCategoryId);
            expect(oldSaleCategory.price).to.equal(pointOneEthPrice);
            await controllerInstance
              .connect(owner)
              .editPriceOfSaleCategory(saleCategoryId, newPrice);
            const saleCategory: SaleCategory =
              await controllerInstance.getSaleCategory(saleCategoryId);
            expect(saleCategory.price).to.equal(newPrice);
          });
        });

        context("edit merkle root of sale category", () => {
          let newMerkleRoot: BytesLike;
          let saleCategoryId: number;
          beforeEach("!! initialise parameters", async () => {
            newMerkleRoot = hashMessage("newMerkleRoot");
            saleCategoryId = 1;
          });
          it("new merkle root cannot be edited by non owner", async () => {
            await expect(
              controllerInstance
                .connect(notOwner)
                .editMerkleRootOfSaleCategory(saleCategoryId, newMerkleRoot)
            ).to.be.revertedWith(OWNABLE_NOT_OWNER);
          });
          it("new merkle root cannot be edited for inexistent sale category", async () => {
            const inexistentSaleCategoryId = 2;
            await expect(
              controllerInstance
                .connect(owner)
                .editMerkleRootOfSaleCategory(
                  inexistentSaleCategoryId,
                  newMerkleRoot
                )
            ).to.be.revertedWithCustomError(
              controllerInstance,
              CONTROLLER_INEXISTENT_SALE_CATEGORY
            );
          });
          it("new merkle root can only be updated by owner", async () => {
            const oldSaleCategory: SaleCategory =
              await controllerInstance.getSaleCategory(saleCategoryId);
            await controllerInstance
              .connect(owner)
              .editMerkleRootOfSaleCategory(saleCategoryId, newMerkleRoot);
            const saleCategory: SaleCategory =
              await controllerInstance.getSaleCategory(saleCategoryId);
            expect(saleCategory.merkleRoot).to.not.equal(
              oldSaleCategory.merkleRoot
            );
          });
        });

        context("edit limit of sale category", () => {
          let newPerWalletLimit: BigNumberish;
          let newPerTransactionLimit: BigNumberish;
          let saleCategoryId: BigNumberish;
          beforeEach("!! initialise parameters", async () => {
            newPerWalletLimit = 20;
            newPerTransactionLimit = 10;
            saleCategoryId = 1;
          });
          it("limit cannot be edited by non owner", async () => {
            await expect(
              controllerInstance
                .connect(notOwner)
                .editPerLimitOfSaleCategory(
                  saleCategoryId,
                  newPerWalletLimit,
                  newPerTransactionLimit
                )
            ).to.be.revertedWith(OWNABLE_NOT_OWNER);
          });
          it("per wallet limit cannot be less than per transaction limit", async () => {
            const perTransactionLimitGreaterThanPerWalletLimit = 21;
            await expect(
              controllerInstance
                .connect(owner)
                .editPerLimitOfSaleCategory(
                  saleCategoryId,
                  newPerWalletLimit,
                  perTransactionLimitGreaterThanPerWalletLimit
                )
            ).to.be.revertedWithCustomError(
              controllerInstance,
              CONTROLLER_LIMIT_GREATER
            );
          });
          it("limit cannot be edited for inexistent sale category", async () => {
            const inexistentSaleCategoryId = 2;
            await expect(
              controllerInstance
                .connect(owner)
                .editPerLimitOfSaleCategory(
                  inexistentSaleCategoryId,
                  newPerWalletLimit,
                  newPerTransactionLimit
                )
            ).to.be.revertedWithCustomError(
              controllerInstance,
              CONTROLLER_INEXISTENT_SALE_CATEGORY
            );
          });
          it("owner can edit valid limit of existent sale category", async () => {
            const oldSaleCategory: SaleCategory =
              await controllerInstance.getSaleCategory(saleCategoryId);
            await controllerInstance
              .connect(owner)
              .editPerLimitOfSaleCategory(
                saleCategoryId,
                newPerWalletLimit,
                newPerTransactionLimit
              );
            const newSaleCategory: SaleCategory =
              await controllerInstance.getSaleCategory(saleCategoryId);
            expect(oldSaleCategory.perWalletLimit).to.not.equal(
              newSaleCategory.perWalletLimit
            );
            expect(newSaleCategory.perWalletLimit).to.equal(newPerWalletLimit);

            expect(oldSaleCategory.perTransactionLimit).to.not.equal(
              newSaleCategory.perTransactionLimit
            );
            expect(newSaleCategory.perTransactionLimit).to.equal(
              newPerTransactionLimit
            );
          });
        });

        context("edit supply of sale category", () => {
          let newSupply: BigNumberish;
          let saleCategoryId: BigNumberish;
          beforeEach("!! initialize parameters", async () => {
            newSupply = 200;
            saleCategoryId = 1;
          });
          it("supply cannot edited by not owner", async () => {
            await expect(
              controllerInstance
                .connect(notOwner)
                .editSupplyOfSaleCategory(saleCategoryId, newSupply)
            ).to.be.revertedWith(OWNABLE_NOT_OWNER);
          });
          it("supply can only be edited for existing sale category", async () => {
            const inexistentSaleCategoryId = 2;
            await expect(
              controllerInstance
                .connect(owner)
                .editSupplyOfSaleCategory(inexistentSaleCategoryId, newSupply)
            ).to.be.revertedWithCustomError(
              controllerInstance,
              CONTROLLER_INEXISTENT_SALE_CATEGORY
            );
          });
          it("supply can only be edited by owner", async () => {
            const oldSaleCategory: SaleCategory =
              await controllerInstance.getSaleCategory(saleCategoryId);
            await controllerInstance
              .connect(owner)
              .editSupplyOfSaleCategory(saleCategoryId, newSupply);
            const newSaleCategory: SaleCategory =
              await controllerInstance.getSaleCategory(saleCategoryId);
            expect(oldSaleCategory.supply).to.not.equal(newSaleCategory.supply);
            expect(newSaleCategory.supply).to.equal(newSupply);
          });
        });

        context("edit key card to avatar ratio of sale category", () => {
          let newKeyCardRatio: BigNumberish;
          let saleCategoryId: BigNumberish;
          beforeEach("!! initialize parameters", async () => {
            newKeyCardRatio = 4;
            saleCategoryId = 1;
          });
          it("key card ratio cannot be edited by non owner", async () => {
            await expect(
              controllerInstance
                .connect(notOwner)
                .editKeyCardRatioOfSaleCategory(saleCategoryId, newKeyCardRatio)
            ).to.be.revertedWith(OWNABLE_NOT_OWNER);
          });
          it("key card ratio cannot be edited for inexistent sale category", async () => {
            const inexistentSaleCategoryId = 2;
            await expect(
              controllerInstance
                .connect(owner)
                .editKeyCardRatioOfSaleCategory(
                  inexistentSaleCategoryId,
                  newKeyCardRatio
                )
            ).to.be.revertedWithCustomError(
              controllerInstance,
              CONTROLLER_INEXISTENT_SALE_CATEGORY
            );
          });
          it("key card ratio can be edited by owner", async () => {
            const oldSaleCategory: SaleCategory =
              await controllerInstance.getSaleCategory(saleCategoryId);
            await controllerInstance
              .connect(owner)
              .editKeyCardRatioOfSaleCategory(saleCategoryId, newKeyCardRatio);
            const newSaleCategory: SaleCategory =
              await controllerInstance.getSaleCategory(saleCategoryId);
            expect(oldSaleCategory.keyCardPerAvatar).to.not.equal(
              newSaleCategory.keyCardPerAvatar
            );
            expect(newSaleCategory.keyCardPerAvatar).to.equal(newKeyCardRatio);
          });
        });

        context("pause and unpause sale", () => {
          let saleCategoryId: BigNumberish;
          const pauseSale = true;
          const unpauseSale = false;
          beforeEach("!! initialise parameters", async () => {
            saleCategoryId = 1;
          });
          it("cannot pause if the caller is not owner", async () => {
            await expect(
              controllerInstance
                .connect(notOwner)
                .togglePauseSale(saleCategoryId, pauseSale)
            ).to.be.revertedWith(OWNABLE_NOT_OWNER);
            await expect(
              controllerInstance
                .connect(notOwner)
                .togglePauseSale(saleCategoryId, unpauseSale)
            ).to.be.revertedWith(OWNABLE_NOT_OWNER);
          });
          it("only owner can pause or unpause a sale", async () => {
            await controllerInstance
              .connect(owner)
              .togglePauseSale(saleCategoryId, pauseSale);
            await controllerInstance
              .connect(owner)
              .togglePauseSale(saleCategoryId, unpauseSale);
          });
        });

        context("toggle discount of sale category", () => {
          let saleCategoryId: BigNumberish;
          const enabledDiscount = true;
          const disabledDiscount = false;
          beforeEach("!! initialise parameters", async () => {
            saleCategoryId = 1;
          });
          context("enable discount", () => {
            beforeEach("check if discount is disabled", async () => {
              const saleCategory: SaleCategory =
                await controllerInstance.getSaleCategory(saleCategoryId);
              const isDiscountEnabled = saleCategory.isDiscountEnabled;
              if (isDiscountEnabled) {
                await controllerInstance
                  .connect(owner)
                  .toggleDiscountOfSaleCategory(
                    saleCategoryId,
                    disabledDiscount
                  );
              }
            });
            it("discount cannot be enabled by not owner", async () => {
              await expect(
                controllerInstance
                  .connect(notOwner)
                  .toggleDiscountOfSaleCategory(saleCategoryId, enabledDiscount)
              ).to.be.revertedWith(OWNABLE_NOT_OWNER);
            });
            it("discount cannot be enabled for inexistent sale category", async () => {
              const inexistentSaleCategoryId = 2;
              await expect(
                controllerInstance
                  .connect(owner)
                  .toggleDiscountOfSaleCategory(
                    inexistentSaleCategoryId,
                    enabledDiscount
                  )
              ).to.be.revertedWithCustomError(
                controllerInstance,
                CONTROLLER_INEXISTENT_SALE_CATEGORY
              );
            });
            it("discount can be enabled by owner for existent sale category", async () => {
              const oldSaleCategory: SaleCategory =
                await controllerInstance.getSaleCategory(saleCategoryId);
              await controllerInstance
                .connect(owner)
                .toggleDiscountOfSaleCategory(saleCategoryId, enabledDiscount);
              const newSaleCategory: SaleCategory =
                await controllerInstance.getSaleCategory(saleCategoryId);
              expect(oldSaleCategory.isDiscountEnabled).to.not.equal(
                newSaleCategory.isDiscountEnabled
              );
              expect(newSaleCategory.isDiscountEnabled).to.equal(
                enabledDiscount
              );
            });
          });
          context("disable discount", () => {
            beforeEach("check if discount is enabled", async () => {
              const saleCategory: SaleCategory =
                await controllerInstance.getSaleCategory(saleCategoryId);
              const isDiscountEnabled = saleCategory.isDiscountEnabled;
              if (!isDiscountEnabled) {
                await controllerInstance
                  .connect(owner)
                  .toggleDiscountOfSaleCategory(
                    saleCategoryId,
                    enabledDiscount
                  );
              }
            });
            it("discount cannot be disabled by not owner", async () => {
              await expect(
                controllerInstance
                  .connect(notOwner)
                  .toggleDiscountOfSaleCategory(
                    saleCategoryId,
                    disabledDiscount
                  )
              ).to.be.revertedWith(OWNABLE_NOT_OWNER);
            });
            it("discount cannot be disabled for inexistent sale category", async () => {
              const inexistentSaleCategoryId = 2;
              await expect(
                controllerInstance
                  .connect(owner)
                  .toggleDiscountOfSaleCategory(
                    inexistentSaleCategoryId,
                    disabledDiscount
                  )
              ).to.be.revertedWithCustomError(
                controllerInstance,
                CONTROLLER_INEXISTENT_SALE_CATEGORY
              );
            });
            it("discount can be disabled by owner for existent sale category", async () => {
              const oldSaleCategory: SaleCategory =
                await controllerInstance.getSaleCategory(saleCategoryId);
              await controllerInstance
                .connect(owner)
                .toggleDiscountOfSaleCategory(saleCategoryId, disabledDiscount);
              const newSaleCategory: SaleCategory =
                await controllerInstance.getSaleCategory(saleCategoryId);
              expect(oldSaleCategory.isDiscountEnabled).to.not.equal(
                newSaleCategory.isDiscountEnabled
              );
              expect(newSaleCategory.isDiscountEnabled).to.equal(
                disabledDiscount
              );
            });
          });
        });
      });
      context("discount code signature", () => {
        console.log("Discount code signature tests");
        let discountCodeIndex: BigNumberish;
        let receiverAddress: Address;
        let signature: BytesLike;
        let discountedPrice: BigNumberish;
        let saleCategoryId: BigNumberish;
        beforeEach("!! add initial sale category", async () => {
          await controllerInstance
            .connect(owner)
            .addSale(
              saleCategoryParams.startTime,
              saleCategoryParams.endTime,
              saleCategoryParams.price,
              saleCategoryParams.merkleRoot,
              saleCategoryParams.perWalletLimit,
              saleCategoryParams.perTransactionLimit,
              saleCategoryParams.supply,
              saleCategoryParams.keyCardPerAvatar,
              saleCategoryParams.phase,
              saleCategoryParams.isDiscountEnabled as boolean
            );
        });
        beforeEach("!! initialize parameters", async () => {
          discountCodeIndex = 1;
          saleCategoryId = 1;
          receiverAddress = receiver.address;
          const saleCategory: SaleCategory =
            await controllerInstance.getSaleCategory(saleCategoryId);
          const currentPrice = saleCategory.price;
          discountedPrice = ethers.BigNumber.from(currentPrice).div(2);
          // generate discount hash
          // discountIndex + discountedPrice + receiver address + "://Panchabhoot Discount Code"
          const discountHash = solidityKeccak256(
            ["uint256", "uint256", "address", "string"],
            [
              discountCodeIndex,
              discountedPrice,
              receiverAddress,
              DISCOUNT_CODE_MESSAGE,
            ]
          );

          // generate signature
          signature = await discountSigner.signMessage(arrayify(discountHash));
        });
        it("check if signature is valid", async () => {
          await controllerInstance.checkDiscountCodeValidity(
            discountCodeIndex,
            discountedPrice,
            receiverAddress,
            signature
          );
        });
        it("invalid discount code will revert", async () => {
          const invalidDiscountCodeIndex =
            parseInt(discountCodeIndex.toString()) + 1;
          await expect(
            controllerInstance.checkDiscountCodeValidity(
              invalidDiscountCodeIndex,
              discountedPrice,
              receiverAddress,
              signature
            )
          ).to.be.revertedWithCustomError(
            controllerInstance,
            CONTROLLER_INVALID_DISCOUNT_CODE
          );
        });
      });
      context("set discount signer", () => {
        it("new discount signer cannot be set by non-owner", async () => {
          await expect(
            controllerInstance
              .connect(notOwner)
              .setDiscountSigner(newDiscountSigner.address)
          ).to.be.revertedWith(OWNABLE_NOT_OWNER);
        });
        it("new discount signer only be set by owner", async () => {
          const oldSignerAddress = await controllerInstance.getDiscountSigner();
          await controllerInstance
            .connect(owner)
            .setDiscountSigner(newDiscountSigner.address);
          const newDiscountAddress =
            await controllerInstance.getDiscountSigner();
          expect(oldSignerAddress).to.not.equal(newDiscountSigner);
          expect(newDiscountSigner.address).to.equal(newDiscountAddress);
        });
      });
      context("Change Phases", () => {
        it("current phase is at 0 from the beginning", async () => {
          const currentPhase = await controllerInstance.getCurrentPhase();
          expect(currentPhase).to.equal(0);
        });
        it("cannot set phase which is already active", async () => {
          const currentPhase = await controllerInstance.getCurrentPhase();
          await expect(
            controllerInstance.setNewPhase(currentPhase)
          ).to.be.revertedWithCustomError(
            controllerInstance,
            PHASE_IS_ALREADY_ACTIVE
          );
        });
        it("phase can only be changed by owner", async () => {
          const currentPhase = await controllerInstance.getCurrentPhase();
          const newPhase = currentPhase + 1;
          await expect(
            controllerInstance.connect(notOwner).setNewPhase(newPhase)
          ).to.be.revertedWith(OWNABLE_NOT_OWNER);
        });
        it("phase can be updated by only owner", async () => {
          const currentPhase = await controllerInstance.getCurrentPhase();
          const newPhase = currentPhase + 1;
          await controllerInstance.connect(owner).setNewPhase(newPhase);
          expect(await controllerInstance.getCurrentPhase()).to.equal(newPhase);
        });
        it("new phase need to exists", async () => {
          const newPhase = MAX_PHASES; // as the starting index is 0, max_phase index is greater than 1.
          // it reverts because of overflow in enum
          await expect(
            controllerInstance.connect(owner).setNewPhase(newPhase)
          ).to.be.revertedWithoutReason();
        });
        it("new phase can be behind current phase", async () => {
          // increase current phase to greater than 0
          const newPhase = MAX_PHASES - 1; // the last phase
          await controllerInstance.connect(owner).setNewPhase(newPhase);
          expect(await controllerInstance.getCurrentPhase()).to.equal(newPhase);

          // set new phase to be behind current phase
          const newPhaseBehindCurrentPhase = MAX_PHASES - 2; // the last second phase
          await controllerInstance
            .connect(owner)
            .setNewPhase(newPhaseBehindCurrentPhase);
          expect(await controllerInstance.getCurrentPhase()).to.equal(
            newPhaseBehindCurrentPhase
          );
        });
      });
      context("set tokens to reserve for phase", () => {
        it("tokens to reserve cannot be set by non owner", async () => {
          const phaseId: Array<number> = [];
          for (let i = 0; i < MAX_PHASES; i++) {
            phaseId.push(i);
          }
          await expect(
            controllerInstance
              .connect(notOwner)
              .setTokensToReserveInPhase(phaseId, TOKENS_TO_RESERVE)
          ).to.be.revertedWith(OWNABLE_NOT_OWNER);
        });
        it("tokens to reserve parameter array should same length", async () => {
          const phaseId: Array<number> = [];
          for (let i = 0; i < MAX_PHASES - 1; i++) {
            phaseId.push(i);
          }
          await expect(
            controllerInstance
              .connect(owner)
              .setTokensToReserveInPhase(phaseId, TOKENS_TO_RESERVE)
          ).to.be.revertedWithCustomError(
            controllerInstance,
            ARRAYS_LENGTH_DONT_MATCH
          );
        });
        it("tokens to reserve cannot be set for non-existent phase", async () => {
          const phaseId: Array<number> = [];
          for (let i = 0; i < MAX_PHASES + 1; i++) {
            phaseId.push(i);
          }
          await expect(
            controllerInstance
              .connect(owner)
              .setTokensToReserveInPhase(phaseId, [...TOKENS_TO_RESERVE, 100])
          ).to.be.revertedWithoutReason(); // reverts because of overflow
        });
        it("tokens to reserve can be set successfully by owner", async () => {
          const phaseId: Array<number> = [];
          for (let i = 0; i < MAX_PHASES; i++) {
            phaseId.push(i);
          }
          await controllerInstance
            .connect(owner)
            .setTokensToReserveInPhase(phaseId, TOKENS_TO_RESERVE);
        });
      });
      context("reserve tokens", async () => {
        it("cannot be reserved by non-owner", async () => {
          const currentPhaseId = await controllerInstance.getCurrentPhase();
          await expect(
            controllerInstance.connect(notOwner).reserveTokens(currentPhaseId)
          ).to.be.revertedWith(OWNABLE_NOT_OWNER);
        });
        it("cannot reserve for non-existent phase", async () => {
          const phaseId = MAX_PHASES;
          // PHASE_ID doesn't contain inexistent phase in the domain
          await expect(
            controllerInstance.connect(owner).reserveTokens(phaseId)
          ).to.be.revertedWithoutReason();
        });
        it("cannot reserve if the phase is not active", async () => {
          const currentPhaseId = await controllerInstance.getCurrentPhase();
          let phaseId;
          // check if current phase id is last or not
          if (currentPhaseId === MAX_PHASES - 1) {
            // if last, decrease the phase ID by 1
            phaseId = currentPhaseId - 1;
          } else {
            // if not last, increase the phase ID by 1
            phaseId = currentPhaseId + 1;
          }
          // though it reverts with PhaseInactive, the inexistent phase can never become active
          await expect(
            controllerInstance.connect(owner).reserveTokens(phaseId)
          ).to.be.revertedWithCustomError(controllerInstance, PHASE_INACTIVE);
        });
        it("can be reserved by owner", async () => {
          const currentPhaseId = await controllerInstance.getCurrentPhase();

          // eslint-disable-next-line
          expect(
            await controllerInstance.checkIfTokenReservedForPhase(
              currentPhaseId
            )
          ).to.be.false;
          await controllerInstance.connect(owner).reserveTokens(currentPhaseId);

          // eslint-disable-next-line
          expect(
            await controllerInstance.checkIfTokenReservedForPhase(
              currentPhaseId
            )
          ).to.be.true;
        });
        it("cannot reserve for phase whose reserve tokens are already minted", async () => {
          // reserve tokens first
          const currentPhaseId = await controllerInstance.getCurrentPhase();
          await controllerInstance.connect(owner).reserveTokens(currentPhaseId);

          // try to reserve again
          await expect(
            controllerInstance.connect(owner).reserveTokens(currentPhaseId)
          ).to.be.revertedWithCustomError(
            controllerInstance,
            TOKENS_ALREADY_RESERVED
          );
        });
        it("cannot update tokens to reserve for phase whose reserve tokens are already minted", async () => {
          // reserve tokens first
          const currentPhaseId = await controllerInstance.getCurrentPhase();
          await controllerInstance.connect(owner).reserveTokens(currentPhaseId);

          await expect(
            controllerInstance
              .connect(owner)
              .setTokensToReserveInPhase(
                [currentPhaseId],
                [TOKENS_TO_RESERVE[0]]
              )
          ).to.be.revertedWithCustomError(
            controllerInstance,
            TOKENS_ALREADY_RESERVED
          );
        });
      });
      context("mint tokens in public sale", () => {
        let publicSaleWithDiscountCategory: SaleCategoryParams;
        let publicSaleWithoutDiscountCategory: SaleCategoryParams;
        const twoTokensPerWallet = 2;
        const twoTokensPerTransaction = 2;
        const fiveTokensPerWallet = 5;
        const fiftySupply = 50;
        const twentySupply = 20;
        const fiveKeyCardPerAvatar = 5;
        const twoKeyCardPerAvatar = 2;
        const phaseOne = 0;
        const phaseTwo = 1;
        const discountEnabled = true;
        const discountDisabled = false;
        let discountManager: DiscountManager;
        let invalidDiscountManager: DiscountManager;
        beforeEach("!! add sale category", async () => {
          discountManager = new DiscountManager(isProduction, discountSigner);
          invalidDiscountManager = new DiscountManager(isProduction, receiver);

          // create a sale category with discount
          const startInTenSeconds = (await time.latest()) + 100;
          const endAfterTenSeconds = startInTenSeconds + 100;
          const startAfterDiscountSale = endAfterTenSeconds + 100;
          const endAfterFifteenSeconds = startAfterDiscountSale + 150;

          // create a sale category without discount
          publicSaleWithoutDiscountCategory = {
            price: pointOneEthPrice,
            merkleRoot: HashZero,
            perWalletLimit: fiveTokensPerWallet,
            perTransactionLimit: fivePerTransactionLimit,
            supply: fiftySupply,
            keyCardPerAvatar: fiveKeyCardPerAvatar,
            startTime: startInTenSeconds,
            endTime: endAfterTenSeconds,
            phase: phaseOne,
            isDiscountEnabled: discountDisabled,
          };

          publicSaleWithDiscountCategory = {
            price: pointOneEthPrice,
            merkleRoot: HashZero,
            perWalletLimit: twoTokensPerWallet,
            perTransactionLimit: twoTokensPerTransaction,
            supply: twentySupply,
            keyCardPerAvatar: twoKeyCardPerAvatar,
            startTime: startAfterDiscountSale,
            endTime: endAfterFifteenSeconds,
            phase: phaseOne,
            isDiscountEnabled: discountEnabled,
          };

          // create sale category without discount
          await addSaleCategory(
            publicSaleWithoutDiscountCategory,
            controllerInstance
          );
          // create sale category with discount
          await addSaleCategory(
            publicSaleWithDiscountCategory,
            controllerInstance
          );
        });
        context("without discount", () => {
          it("cannot mint if sale doesn't exist", async () => {
            // sale ID 1 and 2 exists
            await expect(
              controllerInstance.mintPublic(receiver.address, 10, 0)
            ).to.be.revertedWithCustomError(
              controllerInstance,
              CONTROLLER_INEXISTENT_SALE_CATEGORY
            );
            await expect(
              controllerInstance.mintPublic(receiver.address, 10, 3)
            ).to.be.revertedWithCustomError(
              controllerInstance,
              CONTROLLER_INEXISTENT_SALE_CATEGORY
            );
          });
          it("cannot mint if sale is not active", async () => {
            const tokensToBuy = 1;
            const fundsToTransfer = BigNumber.from(
              publicSaleWithoutDiscountCategory.price.toString()
            ).mul(tokensToBuy);
            await expect(
              controllerInstance.mintPublic(receiver.address, tokensToBuy, 1, {
                value: fundsToTransfer,
              })
            ).to.be.revertedWithCustomError(
              controllerInstance,
              "SaleNotActive"
            );
          });
          it("cannot mint when phase isn't active", async () => {
            // changing from current phase
            await controllerInstance.setNewPhase(phaseTwo);
            await expect(
              controllerInstance.mintPublic(receiver.address, 10, 1)
            ).to.be.revertedWithCustomError(
              controllerInstance,
              "PhaseInactive"
            );
          });
          it("cannot mint if sale is paused", async () => {
            await controllerInstance.togglePauseSale(1, true);
            await expect(
              controllerInstance.mintPublic(receiver.address, 10, 1)
            ).to.be.revertedWithCustomError(controllerInstance, "SalePaused");
            // sale can be unpaused
            await controllerInstance.togglePauseSale(1, false);
          });
          it("cannot mint if exact amount is not transferred", async () => {
            await time.increaseTo(
              parseInt(publicSaleWithoutDiscountCategory.startTime.toString())
            );
            await expect(
              controllerInstance.mintPublic(
                receiver.address,
                parseInt(
                  publicSaleWithoutDiscountCategory.perTransactionLimit.toString()
                ) - 1,
                1
              )
            ).to.be.revertedWithCustomError(
              controllerInstance,
              "TransferExactAmount"
            );
          });
          it("cannot mint if trying to mint tokens more than allowed per transaction", async () => {
            await time.increaseTo(
              parseInt(publicSaleWithoutDiscountCategory.startTime.toString())
            );
            await expect(
              controllerInstance.mintPublic(
                receiver.address,
                parseInt(
                  publicSaleWithoutDiscountCategory.perTransactionLimit.toString()
                ) + 1,
                1
              )
            ).to.be.revertedWithCustomError(
              controllerInstance,
              "ExceedsTokensPerTransactionLimit"
            );
          });
          it("cannot mint if account trying to mint tokens more than allowed per wallet", async () => {
            await time.increaseTo(
              parseInt(publicSaleWithoutDiscountCategory.startTime.toString())
            );
            const tokensToBuy = parseInt(
              publicSaleWithoutDiscountCategory.perTransactionLimit.toString()
            );
            const cost = BigNumber.from(
              publicSaleWithoutDiscountCategory.price.toString()
            ).mul(tokensToBuy);
            controllerInstance.mintPublic(receiver.address, tokensToBuy, 1, {
              value: cost,
            });
            await expect(
              controllerInstance.mintPublic(
                receiver.address,
                parseInt(
                  publicSaleWithoutDiscountCategory.perTransactionLimit.toString()
                ),
                1
              )
            ).to.be.revertedWithCustomError(
              controllerInstance,
              "ExceedsTokensPerWalletLimit"
            );
          });
          it("cannot mint at discounted rate without sale being discounted", async () => {
            await time.increaseTo(
              parseInt(publicSaleWithoutDiscountCategory.startTime.toString())
            );
            const tokensToBuy = 1;
            const cost = BigNumber.from(
              publicSaleWithoutDiscountCategory.price.toString()
            ).mul(tokensToBuy);
            await expect(
              controllerInstance.mintDiscounted(
                receiver.address,
                tokensToBuy,
                1,
                0,
                0,
                "0x",
                { value: cost }
              )
            ).to.be.revertedWithCustomError(
              controllerInstance,
              "SaleNotDiscounted"
            );
          });
          it("mints token on correct inputs", async () => {
            await time.increaseTo(
              parseInt(publicSaleWithoutDiscountCategory.startTime.toString())
            );
            const tokensToBuy = 1;
            const cost = BigNumber.from(
              publicSaleWithoutDiscountCategory.price.toString()
            ).mul(tokensToBuy);
            await controllerInstance.mintPublic(
              receiver.address,
              tokensToBuy,
              1,
              { value: cost }
            );
            expect(
              await controllerInstance.tokensMintedByOwnerInSale(
                1,
                receiver.address
              )
            ).to.equal(tokensToBuy);
          });
          it("can mint more tokens until wallet limit is reached", async () => {
            await time.increaseTo(
              parseInt(publicSaleWithoutDiscountCategory.startTime.toString())
            );
            const tokensToBuy = parseInt(
              publicSaleWithoutDiscountCategory.perTransactionLimit.toString()
            );
            const cost = BigNumber.from(
              publicSaleWithoutDiscountCategory.price.toString()
            ).mul(tokensToBuy);
            await controllerInstance.mintPublic(
              receiver.address,
              tokensToBuy,
              1,
              { value: cost }
            );
            expect(
              await controllerInstance.tokensMintedByOwnerInSale(
                1,
                receiver.address
              )
            ).to.equal(publicSaleWithoutDiscountCategory.perWalletLimit);
          });
          it("can mint until the supply is reached", async () => {
            await time.increaseTo(
              parseInt(publicSaleWithoutDiscountCategory.startTime.toString())
            );
            const buyPerTransaction = parseInt(
              publicSaleWithoutDiscountCategory.perTransactionLimit.toString()
            );
            let remaining = parseInt(
              publicSaleWithoutDiscountCategory.supply.toString()
            );
            const price = BigNumber.from(
              publicSaleWithoutDiscountCategory.price.toString()
            );
            const totalCost = price.mul(buyPerTransaction);

            while (remaining > 0) {
              const newWallet = ethers.Wallet.createRandom();
              if (remaining >= buyPerTransaction) {
                await controllerInstance.mintPublic(
                  newWallet.address,
                  buyPerTransaction,
                  1,
                  { value: totalCost }
                );
                remaining = remaining - buyPerTransaction;
              } else {
                await controllerInstance.mintPublic(
                  newWallet.address,
                  remaining,
                  1,
                  { value: price.mul(remaining) }
                );
                remaining = 0;
              }
            }
            // cannot mint more than supply
            await expect(
              controllerInstance.mintPublic(receiver.address, 1, 1, {
                value: price.mul(1),
              })
            ).to.be.revertedWithCustomError(
              controllerInstance,
              "ExceedsSaleSupply"
            );
          });
          it("cannot mint after the end time", async () => {
            await time.increaseTo(
              parseInt(publicSaleWithoutDiscountCategory.endTime.toString())
            );
            await expect(
              controllerInstance.mintPublic(receiver.address, 1, 1)
            ).to.be.revertedWithCustomError(
              controllerInstance,
              "SaleNotActive"
            );
          });
        });
        context("wit discount", () => {
          let validDiscountCode: string;
          let invalidDiscountCode: string;
          let tenPercentDiscountedPrice; // 10% discount
          let twentyPercentDiscountedPrice;
          beforeEach("!! setup discount codes", async () => {
            tenPercentDiscountedPrice = BigNumber.from(
              publicSaleWithDiscountCategory.price.toString()
            )
              .mul(9)
              .div(10);
            twentyPercentDiscountedPrice = BigNumber.from(
              publicSaleWithDiscountCategory.price.toString()
            )
              .mul(8)
              .div(10);
            validDiscountCode = await discountManager.generateNewDiscountCode(
              twentyPercentDiscountedPrice,
              receiver.address
            );
            invalidDiscountCode =
              await invalidDiscountManager.generateNewDiscountCode(
                tenPercentDiscountedPrice,
                receiver.address
              );
            await time.increaseTo(
              parseInt(publicSaleWithDiscountCategory.startTime.toString())
            );
          });
          it("cannot mint at discount price if discount code is invalid", async () => {
            const invalidDiscountResponceCode =
              invalidDiscountManager.parseCode(invalidDiscountCode);
            await expect(
              controllerInstance.mintDiscounted(
                receiver.address,
                1,
                2,
                invalidDiscountResponceCode.discountIndex,
                invalidDiscountResponceCode.discountedPrice,
                invalidDiscountResponceCode.signature
              )
            ).to.be.revertedWithCustomError(
              controllerInstance,
              "InvalidDiscountCode"
            );
          });
          it("cannot mint if correct amount calculated at discounted rice is not sent", async () => {
            const discountResponseCode =
              discountManager.parseCode(validDiscountCode);
            const price = BigNumber.from(
              publicSaleWithDiscountCategory.price.toString()
            );
            await expect(
              controllerInstance.mintDiscounted(
                receiver.address,
                1,
                2,
                discountResponseCode.discountIndex,
                discountResponseCode.discountedPrice,
                discountResponseCode.signature,
                { value: price.mul(2) }
              )
            ).to.be.revertedWithCustomError(
              controllerInstance,
              "TransferExactAmount"
            );
          });
          it("mints token as discounted rate", async () => {
            const discountResponseCode =
              discountManager.parseCode(validDiscountCode);
            const price = discountResponseCode.discountedPrice;
            console.log("This test is working");
            console.log(discountResponseCode);
            await controllerInstance.mintDiscounted(
              receiver.address,
              1,
              2,
              discountResponseCode.discountIndex,
              discountResponseCode.discountedPrice,
              discountResponseCode.signature,
              { value: price.mul(1) }
            );
          });
          it("cannot mint at discounted price for used discount code", async () => {
            // use the discount code first
            const discountResponseCode =
              discountManager.parseCode(validDiscountCode);
            const price = discountResponseCode.discountedPrice;
            await controllerInstance.mintDiscounted(
              receiver.address,
              1,
              2,
              discountResponseCode.discountIndex,
              discountResponseCode.discountedPrice,
              discountResponseCode.signature,
              { value: price.mul(1) }
            );

            // try using the same code again
            await expect(
              controllerInstance.mintDiscounted(
                receiver.address,
                1,
                2,
                discountResponseCode.discountIndex,
                discountResponseCode.discountedPrice,
                discountResponseCode.signature,
                { value: price.mul(1) }
              )
            ).to.be.revertedWithCustomError(
              controllerInstance,
              "DiscountCodeAlreadyUsed"
            );
          });
        });
      });
      context("mint tokens in allowlist sale", () => {
        let allowlistedSaleWithDiscountCategory: SaleCategoryParams;
        let allowlistedSaleWithoutDiscountCategory: SaleCategoryParams;
        let nonAllowlistedSaleWithoutDiscountCategory: SaleCategoryParams;
        const twoTokensPerWallet = 2;
        const twoTokensPerTransaction = 2;
        const fiveTokensPerWallet = 5;
        const fiveTokensPerTransaction = 5;
        const fiftySupply = 50;
        const twentySupply = 20;
        const fiveKeyCardPerAvatar = 5;
        const twoKeyCardPerAvatar = 2;
        const phaseOne = 0;
        const discountEnabled = true;
        const discountDisabled = false;
        let merkleTree: MerkleTreeManagement;
        let discountManager: DiscountManager;
        let invalidDiscountManager: DiscountManager;
        beforeEach("!! add sale category", async () => {
          discountManager = new DiscountManager(isProduction, discountSigner);
          invalidDiscountManager = new DiscountManager(isProduction, receiver);
          // create array of addresses to be added to allowlist
          const allowList = [notOwner.address, receiver.address];
          if (notCI && IPFS_API === undefined) {
            throw Error(
              "IPFS_API key is undefined, please add it to ENV variable under WEB3_STORAGE_API_TOKEN env name."
            );
          }
          // create merkle root
          merkleTree = new MerkleTreeManagement(allowList, "", IPFS_API, notCI);
          await merkleTree.setup();

          // create a allowlisted sale category with discount
          const startInTenSeconds = (await time.latest()) + 100;
          const endAfterTenSeconds = startInTenSeconds + 100;
          const startAfterDiscountSale = endAfterTenSeconds + 100;
          const endAfterFifteenSeconds = startAfterDiscountSale + 150;
          // create a allowlisted sale without discount
          allowlistedSaleWithoutDiscountCategory = {
            price: pointOneEthPrice,
            merkleRoot: merkleTree.getRoot(),
            perWalletLimit: twoTokensPerWallet,
            perTransactionLimit: twoTokensPerTransaction,
            supply: fiftySupply,
            keyCardPerAvatar: twoKeyCardPerAvatar,
            startTime: startInTenSeconds,
            endTime: endAfterTenSeconds,
            phase: phaseOne,
            isDiscountEnabled: discountDisabled,
          };
          // create a allowlisted sale category with discount
          allowlistedSaleWithDiscountCategory = {
            price: pointOneEthPrice,
            merkleRoot: merkleTree.getRoot(),
            perWalletLimit: fiveTokensPerWallet,
            perTransactionLimit: fiveTokensPerTransaction,
            supply: twentySupply,
            keyCardPerAvatar: fiveKeyCardPerAvatar,
            startTime: startAfterDiscountSale,
            endTime: endAfterFifteenSeconds,
            phase: phaseOne,
            isDiscountEnabled: discountEnabled,
          };

          // non allowlisted sale
          nonAllowlistedSaleWithoutDiscountCategory = {
            price: pointOneEthPrice,
            merkleRoot: HashZero,
            perWalletLimit: twoTokensPerWallet,
            perTransactionLimit: twoTokensPerTransaction,
            supply: fiftySupply,
            keyCardPerAvatar: twoKeyCardPerAvatar,
            startTime: startAfterDiscountSale,
            endTime: endAfterFifteenSeconds,
            phase: phaseOne,
            isDiscountEnabled: discountDisabled,
          };

          // crete sale category without discount and allowlist
          await addSaleCategory(
            nonAllowlistedSaleWithoutDiscountCategory,
            controllerInstance
          );

          // create sale category without discount
          await addSaleCategory(
            allowlistedSaleWithoutDiscountCategory,
            controllerInstance
          );
          // create sale category with discount
          await addSaleCategory(
            allowlistedSaleWithDiscountCategory,
            controllerInstance
          );

          await time.increaseTo(
            parseInt(
              allowlistedSaleWithoutDiscountCategory.startTime.toString()
            )
          );
        });
        context("without discount", () => {
          it("cannot mint allowlisted if sale is not allowlisted", async () => {
            await expect(
              controllerInstance.mintAllowlisted(receiver.address, 1, [], 1)
            ).to.be.revertedWithCustomError(
              controllerInstance,
              "SaleNotAllowlisted"
            );
          });
          it("cannot mint allowlisted if the account is not allowlisted", async () => {
            // activate phase 2

            const nonAllowlistedSigner = ethers.Wallet.createRandom();
            const proofs = merkleTree.getProof(nonAllowlistedSigner.address);
            await expect(
              controllerInstance.mintAllowlisted(
                nonAllowlistedSigner.address,
                1,
                proofs,
                2
              )
            ).to.be.revertedWithCustomError(
              controllerInstance,
              "AccountNotInAllowlist"
            );
          });
          it("can mint after the account is added to allowlist", async () => {
            // cannot mint with account that is not allowlisted
            const nonAllowlistedSigner = ethers.Wallet.createRandom();
            const proofs = merkleTree.getProof(nonAllowlistedSigner.address);
            await expect(
              controllerInstance.mintAllowlisted(
                nonAllowlistedSigner.address,
                1,
                proofs,
                2
              )
            ).to.be.revertedWithCustomError(
              controllerInstance,
              "AccountNotInAllowlist"
            );

            // add account to merkle tree
            await merkleTree.addToAllowlist([nonAllowlistedSigner.address]);
            const merkleRoot = merkleTree.getRoot();

            // update allowlist on-chain
            await controllerInstance.editMerkleRootOfSaleCategory(
              2,
              merkleRoot
            );

            // get proofs
            const newProofs = merkleTree.getProof(nonAllowlistedSigner.address);

            const price = BigNumber.from(
              allowlistedSaleWithoutDiscountCategory.price.toString()
            );

            // mint tokens with non allowlisted address
            await controllerInstance.mintAllowlisted(
              nonAllowlistedSigner.address,
              1,
              newProofs,
              2,
              { value: price }
            );
          });
          it("mints allowlisted token on correct inputs", async () => {
            // get proofs
            const newProofs = merkleTree.getProof(receiver.address);

            const price = BigNumber.from(
              allowlistedSaleWithoutDiscountCategory.price.toString()
            );

            // mint tokens with non allowlisted address
            await controllerInstance.mintAllowlisted(
              receiver.address,
              1,
              newProofs,
              2,
              { value: price }
            );
          });
        });
        context("with discount", () => {
          let validDiscountCode: string;
          let invalidDiscountCode: string;
          let tenPercentDiscountedPrice; // 10% discount
          let twentyPercentDiscountedPrice;
          let proofs: string[];
          beforeEach("!! setup discount codes", async () => {
            console.log("Testing with discount");
            tenPercentDiscountedPrice = BigNumber.from(
              allowlistedSaleWithDiscountCategory.price.toString()
            )
              .mul(9)
              .div(10);
            twentyPercentDiscountedPrice = BigNumber.from(
              allowlistedSaleWithDiscountCategory.price.toString()
            )
              .mul(8)
              .div(10);
            validDiscountCode = await discountManager.generateNewDiscountCode(
              twentyPercentDiscountedPrice,
              receiver.address
            );
            invalidDiscountCode =
              await invalidDiscountManager.generateNewDiscountCode(
                tenPercentDiscountedPrice,
                receiver.address
              );
            proofs = merkleTree.getProof(receiver.address);
            await time.increaseTo(
              parseInt(allowlistedSaleWithDiscountCategory.startTime.toString())
            );
          });
          it("cannot mint at discount price if discount code is invalid", async () => {
            console.log("Testing with discount");
            const invalidDiscountResponceCode =
              invalidDiscountManager.parseCode(invalidDiscountCode);
            await expect(
              controllerInstance.mintDiscountedAllowlist(
                receiver.address,
                1,
                proofs,
                3,
                invalidDiscountResponceCode.discountIndex,
                invalidDiscountResponceCode.discountedPrice,
                invalidDiscountResponceCode.signature
              )
            ).to.be.revertedWithCustomError(
              controllerInstance,
              "InvalidDiscountCode"
            );
          });
          it("cannot mint if correct amount calculated at discounted rice is not sent", async () => {
            const discountResponseCode =
              discountManager.parseCode(validDiscountCode);
            const price = BigNumber.from(
              allowlistedSaleWithDiscountCategory.price.toString()
            );
            await expect(
              controllerInstance.mintDiscountedAllowlist(
                receiver.address,
                1,
                proofs,
                3,
                discountResponseCode.discountIndex,
                discountResponseCode.discountedPrice,
                discountResponseCode.signature,
                { value: price.mul(2) }
              )
            ).to.be.revertedWithCustomError(
              controllerInstance,
              "TransferExactAmount"
            );
          });
          it("mints token as discounted rate", async () => {
            const discountResponseCode =
              discountManager.parseCode(validDiscountCode);
            console.log("This test is working");
            console.log(discountResponseCode);
            const price = discountResponseCode.discountedPrice;
            await controllerInstance.mintDiscountedAllowlist(
              receiver.address,
              1,
              proofs,
              3,
              discountResponseCode.discountIndex,
              discountResponseCode.discountedPrice,
              discountResponseCode.signature,
              { value: price.mul(1) }
            );
          });
          it("cannot mint at discounted price for used discount code", async () => {
            // use the discount code first
            const discountResponseCode =
              discountManager.parseCode(validDiscountCode);
            const price = discountResponseCode.discountedPrice;
            await controllerInstance.mintDiscountedAllowlist(
              receiver.address,
              1,
              proofs,
              3,
              discountResponseCode.discountIndex,
              discountResponseCode.discountedPrice,
              discountResponseCode.signature,
              { value: price.mul(1) }
            );

            // try using the same code again
            await expect(
              controllerInstance.mintDiscountedAllowlist(
                receiver.address,
                1,
                proofs,
                3,
                discountResponseCode.discountIndex,
                discountResponseCode.discountedPrice,
                discountResponseCode.signature,
                { value: price.mul(1) }
              )
            ).to.be.revertedWithCustomError(
              controllerInstance,
              "DiscountCodeAlreadyUsed"
            );
          });
        });
      });
    });
  });
});
