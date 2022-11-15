/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../../common";
import type {
  Example,
  ExampleInterface,
} from "../../../contracts/Example/Example";

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
  "0x608060405234801561001057600080fd5b506102f3806100206000396000f3fe608060405234801561001057600080fd5b50600436106100365760003560e01c806377f2e2e51461003b5780638311ae8314610059575b600080fd5b610043610075565b6040516100509190610244565b60405180910390f35b610073600480360381019061006e9190610290565b6100c0565b005b600061008b67fab9faeaa16a7c0060c01b610108565b61009f671ac5816ae62e9cec60c01b610108565b6100b36778a5944cabca469a60c01b610108565b6100bb61010b565b905090565b6100d467ce21571b96192a6460c01b610108565b6100e8671e046807c96b917960c01b610108565b6100fc6750bf1ed9b4f0736d60c01b610108565b61010581610151565b50565b50565b6000610121673545ed16cd11240b60c01b610228565b610135674bcf04a6a7065fc260c01b610228565b61014967bd57944378ee2e2060c01b610228565b600054905090565b610165679771c34acf96454e60c01b610228565b61017967c734cab749fa073c60c01b610228565b61018d6701c2828171ae996b60c01b610228565b61019561010b565b8110156101f6576101b0674c7e5d769d47955c60c01b610228565b6101c4678d9ee4bfc6b165fd60c01b610228565b6040517f58d1d99700000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b61020a670a9a7a4b0756997a60c01b610228565b61021e67b6acc69e37bd266760c01b610228565b8060008190555050565b50565b6000819050919050565b61023e8161022b565b82525050565b60006020820190506102596000830184610235565b92915050565b600080fd5b61026d8161022b565b811461027857600080fd5b50565b60008135905061028a81610264565b92915050565b6000602082840312156102a6576102a561025f565b5b60006102b48482850161027b565b9150509291505056fea264697066735822122011df382e5a1b90fb22d600eca8b7935a3a719f8cf8a1abce8ed39ea07de8c68864736f6c63430008110033";

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