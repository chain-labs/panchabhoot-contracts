import { BytesLike, BigNumberish } from "ethers";
import {
  SaleCategory,
  SaleCategoryParams,
} from "./../../types/ContractParameters";
import { time } from "@nomicfoundation/hardhat-network-helpers";
import {
  CONTROLLER_END_TIME_BEHIND,
  CONTROLLER_INEXISTENT_SALE_CATEGORY,
  CONTROLLER_INVALID_DISCOUNT_CODE,
  CONTROLLER_LIMIT_GREATER,
  CONTROLLER_START_TIME_IN_PAST,
  INITIALIZABLE_ALREADY_INITIALIZED,
  OWNABLE_NOT_OWNER,
  PAUSABLE_NOT_PAUSED,
  PAUSABLE_PAUSED,
} from "./../ERROR_STRINGS";
// eslint-disable-next-line
import { Controller__factory } from "./../../typechain-types/factories/contracts/Controller/Controller__factory";
import { Controller } from "./../../typechain-types/contracts/Controller/Controller";
import { UNIT_TEST, contractsName } from "../Constants";
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
const { AddressZero, HashZero } = ethers.constants;

const toMinutes = (minutes: number) => minutes * 60;

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
  let discountSigner: SignerWithAddress;
  let newDiscountSigner: SignerWithAddress;
  let receiver: SignerWithAddress;

  // todo: avatar and key card should be contract instance and not Signer
  let avatarInstance: SignerWithAddress;
  let newAvatarInstance: SignerWithAddress;
  let keyCardInstance: SignerWithAddress;
  let newKeyCardInstance: SignerWithAddress;

  // constants
  const DISCOUNT_CODE_MESSAGE = "Panchabhoot Discount Code";

  beforeEach("!! deploy controller", async () => {
    [
      owner,
      notOwner,
      discountSigner,
      newDiscountSigner,
      receiver,
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
        discountSigner.address,
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
        discountSigner.address,
        payees,
        shares
      );

      // try to initialise again
      await expect(
        controllerInstance.initialize(
          avatarInstance.address,
          keyCardInstance.address,
          discountSigner.address,
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
        discountSigner.address,
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
          // discountIndex + discountedPrice + receiver address + "Panchabhoot Discount Code"
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
    });
  });
});
