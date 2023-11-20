/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../../common";
import type {
  AvatarStorage,
  AvatarStorageInterface,
} from "../../../contracts/Avatar/AvatarStorage";

const _abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "_newMaximumTokensSet",
        type: "uint256",
      },
    ],
    name: "MaximumTokensUpdated",
    type: "event",
  },
];

const _bytecode =
  "0x6080604052348015600f57600080fd5b50603f80601d6000396000f3fe6080604052600080fdfea2646970667358221220ebc554eb2bb7c2eab1a1cbed7e53334a3a99e8d865843b5dda52026dff41984064736f6c63430008110033";

type AvatarStorageConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: AvatarStorageConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class AvatarStorage__factory extends ContractFactory {
  constructor(...args: AvatarStorageConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<AvatarStorage> {
    return super.deploy(overrides || {}) as Promise<AvatarStorage>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): AvatarStorage {
    return super.attach(address) as AvatarStorage;
  }
  override connect(signer: Signer): AvatarStorage__factory {
    return super.connect(signer) as AvatarStorage__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): AvatarStorageInterface {
    return new utils.Interface(_abi) as AvatarStorageInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): AvatarStorage {
    return new Contract(address, _abi, signerOrProvider) as AvatarStorage;
  }
}
