import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import axios from "axios";
import { BigNumber, Signer } from "ethers";
import { arrayify, solidityKeccak256 } from "ethers/lib/utils";
import { Address } from "hardhat-deploy/dist/types";
import { DISCOUNT_CODE_MESSAGE } from "../Constants";

export interface DiscountResponse {
  discountIndex: number;
  discountedPrice: BigNumber;
  signature: string;
}

export class DiscountManager {
  endpoint: string | undefined;
  discountIndexCounter: number = 0;
  isProduction: Boolean;
  discountSigner: SignerWithAddress | Signer;
  static readonly discountPostfix: string = DISCOUNT_CODE_MESSAGE;

  constructor(
    isProduction: Boolean,
    discountSigner: SignerWithAddress | Signer
  ) {
    this.isProduction = isProduction;
    this.discountSigner = discountSigner;
  }

  async setup(endpoint: string) {
    if (endpoint === undefined) {
      throw Error("Provided endpoint is undefined");
    }
    await this.checkEndpoint(endpoint);
    this.endpoint = endpoint;
  }

  async generateNewDiscountCode(
    discountedPrice: BigNumber,
    receiver: Address
  ): Promise<string> {
    // get required parameters
    const currentDiscountIndex = this.discountIndexCounter;

    // generate discount message
    const discountMessage = this.generateDiscountMessage(
      currentDiscountIndex,
      discountedPrice,
      receiver
    );

    // increase the discount index counter
    this.#incrementDiscountIndex();

    // get it signed by discount signer
    const signature = await this.#requestSignature(discountMessage);
    // return data
    const discountRespone: DiscountResponse = {
      discountIndex: currentDiscountIndex,
      discountedPrice: discountedPrice,
      signature: signature,
    };
    const discountCode = this.generateCode(discountRespone);
    return discountCode;
  }

  generateCode(discountResponse: DiscountResponse): string {
    return `${
      discountResponse.discountIndex
    }-${discountResponse.discountedPrice.toString()}-${
      discountResponse.signature
    }`;
  }

  parseCode(discountCode: string): DiscountResponse {
    const parsedArray = discountCode.split("-");
    const parsedDiscountResponse: DiscountResponse = {
      discountIndex: parseInt(parsedArray[0]),
      discountedPrice: BigNumber.from(parsedArray[1]),
      signature: parsedArray[2],
    };
    return parsedDiscountResponse;
  }

  #incrementDiscountIndex() {
    this.discountIndexCounter = this.discountIndexCounter + 1;
  }

  async requestSignature(
    discountSigner: SignerWithAddress | Signer,
    discountMessage: string
  ) {
    return await discountSigner.signMessage(arrayify(discountMessage));
  }

  async #requestSignature(discountMessage: string): Promise<string> {
    return await this.discountSigner.signMessage(arrayify(discountMessage));
  }

  generateDiscountMessage(
    discountCodeIndex: number,
    discountedPrice: BigNumber,
    receiverAddress: Address
  ): string {
    return solidityKeccak256(
      ["uint256", "uint256", "address", "string"],
      [
        discountCodeIndex,
        discountedPrice,
        receiverAddress,
        DiscountManager.discountPostfix,
      ]
    );
  }

  async checkEndpoint(endpoint = ""): Promise<Boolean> {
    try {
      if (this.isProduction) {
        const res = await axios.get(`${endpoint}/ping`);
        if (res.status) {
          return true;
        } else {
          return false;
        }
      } else {
        return await simulateApiPing();
      }
    } catch (e) {
      console.error("Endpoint not working");
      console.error(e);
      return false;
    }
  }
}

// simulate API calls
const simulateApiPing = async (): Promise<Boolean> => {
  return new Promise((resolve, reject) => {
    resolve(true);
  });
};
