import { task } from "hardhat/config";
import dotenv from "dotenv";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { Controller, ControllerInternal } from "../typechain-types";
import { Address } from "hardhat-deploy/dist/types";
import { BigNumberish, BytesLike } from "ethers";
import { contractsName } from "../test/Constants";

dotenv.config({ path: "./.env" });

import {
  GelatoRelay,
  SponsoredCallRequest,
} from "@gelatonetwork/relay-sdk";
import { checkForUndefined } from "../utils/checkers";
const relay = new GelatoRelay();

interface MintDiscountArgs {
  receiver: Address;
  numberOfTokens: BigNumberish;
  saleId: number;
  discountIndex: number;
  discountedPrice: BigNumberish;
  signature: BytesLike;
}

interface MintRelayerArgs {
  signature: BytesLike;
  discountindex: number;
}

const { INFURA_KEY, NOT_CI} =
  process.env;

if (NOT_CI === "true") {
  checkForUndefined("INFURA_KEY", INFURA_KEY);
}

async function mintUsingRelayer(
  { signature, discountindex }: MintRelayerArgs,
  hre: HardhatRuntimeEnvironment
) {
  const { ethers, network } = hre;
  const apiKey = "p_FT8S0viwfsE4dbvBbn_koTWJ5vgO1XDIepWDLeApM_";
  const args: MintDiscountArgs = {
    receiver: "0x5F5A30564388e7277818c15DB0d511AAbbD0eC80",
    numberOfTokens: 2,
    saleId: 18,
    discountIndex: discountindex,
    discountedPrice: "18000000000000",
    signature: signature,
  };

  const [sender] = await ethers.getSigners();

  const provider = new ethers.providers.JsonRpcProvider(`https://goerli.infura.io/v3/${INFURA_KEY}`);

  const contract = (await ethers.getContract(
    contractsName.CONTROLLER,
    sender
  )) as Controller;
  console.log(
    `MintUsingRelayer: Generating Populated Transactions data to be sent to relayer`
  );
  const populatedTransactions =
    await contract.populateTransaction.mintDiscounted(
      args.receiver,
      args.numberOfTokens,
      args.saleId,
      args.discountIndex,
      args.discountedPrice,
      args.signature,
      {
        value: ethers.BigNumber.from(args.discountedPrice).mul(args.numberOfTokens)
      }
    );
  console.log(`MintUsingRelayer: Generating Gelato Relay Request`);
  const request: SponsoredCallRequest = {
    chainId: (await provider.getNetwork()).chainId,
    target: contract.address,
    data: populatedTransactions.data as string
  };
  console.log(
    `MintUsingRelayer: Sending Relay request to Gelato with following parameters`
  );
  console.log({ request, provider: provider });
  const relayResponse = await relay.sponsoredCall(
    request,
    apiKey,
    {
        
    }
  );
  console.log(`MintUsingRelayer: Received  a response from gelato`);
  console.log(relayResponse);
}

task("mintUsingRelayer", "Mint using Relayer")
  .addParam("signature")
  .addParam("discountindex")
  .setAction(mintUsingRelayer);
