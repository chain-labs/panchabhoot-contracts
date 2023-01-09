/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type { BaseContract, BigNumber, Signer, utils } from "ethers";
import type { EventFragment } from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
  PromiseOrValue,
} from "../../common";

export interface AvatarStorageInterface extends utils.Interface {
  functions: {};

  events: {
    "MaximumTokensUpdated(uint256)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "MaximumTokensUpdated"): EventFragment;
}

export interface MaximumTokensUpdatedEventObject {
  _newMaximumTokensSet: BigNumber;
}
export type MaximumTokensUpdatedEvent = TypedEvent<
  [BigNumber],
  MaximumTokensUpdatedEventObject
>;

export type MaximumTokensUpdatedEventFilter =
  TypedEventFilter<MaximumTokensUpdatedEvent>;

export interface AvatarStorage extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: AvatarStorageInterface;

  queryFilter<TEvent extends TypedEvent>(
    event: TypedEventFilter<TEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TEvent>>;

  listeners<TEvent extends TypedEvent>(
    eventFilter?: TypedEventFilter<TEvent>
  ): Array<TypedListener<TEvent>>;
  listeners(eventName?: string): Array<Listener>;
  removeAllListeners<TEvent extends TypedEvent>(
    eventFilter: TypedEventFilter<TEvent>
  ): this;
  removeAllListeners(eventName?: string): this;
  off: OnEvent<this>;
  on: OnEvent<this>;
  once: OnEvent<this>;
  removeListener: OnEvent<this>;

  functions: {};

  callStatic: {};

  filters: {
    "MaximumTokensUpdated(uint256)"(
      _newMaximumTokensSet?: null
    ): MaximumTokensUpdatedEventFilter;
    MaximumTokensUpdated(
      _newMaximumTokensSet?: null
    ): MaximumTokensUpdatedEventFilter;
  };

  estimateGas: {};

  populateTransaction: {};
}