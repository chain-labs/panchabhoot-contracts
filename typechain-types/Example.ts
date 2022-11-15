/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumber,
  BigNumberish,
  BytesLike,
  CallOverrides,
  ContractTransaction,
  Overrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import type {
  FunctionFragment,
  Result,
  EventFragment,
} from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
  PromiseOrValue,
} from "./common";

export interface ExampleInterface extends utils.Interface {
  functions: {
    "getMaxStorage()": FunctionFragment;
    "incrementMaxStorage(uint256)": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic: "getMaxStorage" | "incrementMaxStorage"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "getMaxStorage",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "incrementMaxStorage",
    values: [PromiseOrValue<BigNumberish>]
  ): string;

  decodeFunctionResult(
    functionFragment: "getMaxStorage",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "incrementMaxStorage",
    data: BytesLike
  ): Result;

  events: {
    "MaxStorageUpdated()": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "MaxStorageUpdated"): EventFragment;
}

export interface MaxStorageUpdatedEventObject {}
export type MaxStorageUpdatedEvent = TypedEvent<
  [],
  MaxStorageUpdatedEventObject
>;

export type MaxStorageUpdatedEventFilter =
  TypedEventFilter<MaxStorageUpdatedEvent>;

export interface Example extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: ExampleInterface;

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

  functions: {
    getMaxStorage(overrides?: CallOverrides): Promise<[BigNumber]>;

    incrementMaxStorage(
      _newMaxStorage: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;
  };

  getMaxStorage(overrides?: CallOverrides): Promise<BigNumber>;

  incrementMaxStorage(
    _newMaxStorage: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    getMaxStorage(overrides?: CallOverrides): Promise<BigNumber>;

    incrementMaxStorage(
      _newMaxStorage: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {
    "MaxStorageUpdated()"(): MaxStorageUpdatedEventFilter;
    MaxStorageUpdated(): MaxStorageUpdatedEventFilter;
  };

  estimateGas: {
    getMaxStorage(overrides?: CallOverrides): Promise<BigNumber>;

    incrementMaxStorage(
      _newMaxStorage: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    getMaxStorage(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    incrementMaxStorage(
      _newMaxStorage: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;
  };
}
