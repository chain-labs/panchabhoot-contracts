import { BigNumberish, BytesLike } from "ethers";

export interface SaleCategory {
  price: BigNumberish;
  merkleRoot: BytesLike;
  perWalletLimit: BigNumberish;
  perTransactionLimit: BigNumberish;
  supply: BigNumberish;
  tokensMinted: BigNumberish;
  keyCardPerAvatar: BigNumberish;
  startTime: BigNumberish;
  endTime: BigNumberish;
  phase: BigNumberish;
  paused: Boolean;
  isDiscountEnabled: Boolean;
}

export interface SaleCategoryParams {
  price: BigNumberish;
  merkleRoot: BytesLike;
  perWalletLimit: BigNumberish;
  perTransactionLimit: BigNumberish;
  supply: BigNumberish;
  keyCardPerAvatar: BigNumberish;
  startTime: BigNumberish;
  endTime: BigNumberish;
  phase: BigNumberish;
  isDiscountEnabled: Boolean;
}
