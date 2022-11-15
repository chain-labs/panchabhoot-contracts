/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../common";
import type { Example, ExampleInterface } from "../Example";

const _abi = [
  {
    inputs: [],
    name: "CannotDecreaseMaxStorage",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [],
    name: "MaxStorageUpdated",
    type: "event",
  },
  {
    inputs: [],
    name: "getMaxStorage",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_newMaxStorage",
        type: "uint256",
      },
    ],
    name: "incrementMaxStorage",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x608060405234801561001057600080fd5b5060f58061001f6000396000f3fe6080604052348015600f57600080fd5b506004361060325760003560e01c806377f2e2e51460375780638311ae8314604c575b600080fd5b60005460405190815260200160405180910390f35b605b605736600460a7565b605d565b005b6064816067565b50565b60005481101560a2576040517f58d1d99700000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b600055565b60006020828403121560b857600080fd5b503591905056fea2646970667358221220e0b936fadd1ede7a405bd5184662cea2bbdc462140370023af676c143a436e8164736f6c63430008110033";

type ExampleConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: ExampleConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class Example__factory extends ContractFactory {
  constructor(...args: ExampleConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<Example> {
    return super.deploy(overrides || {}) as Promise<Example>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): Example {
    return super.attach(address) as Example;
  }
  override connect(signer: Signer): Example__factory {
    return super.connect(signer) as Example__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): ExampleInterface {
    return new utils.Interface(_abi) as ExampleInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): Example {
    return new Contract(address, _abi, signerOrProvider) as Example;
  }
}
