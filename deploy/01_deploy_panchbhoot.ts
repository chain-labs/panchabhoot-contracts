import dotenv from "dotenv";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { contractsName } from "../test/Constants";
import {
  Admin_ADDRESS,
  AvatarName,
  AvatarSymbol,
  ChainLabsAddress,
  DEPLOYER_IS_ADMIN,
  DISCOUNT_SIGNER,
  KeyCardName,
  KeyCardSymbol,
  MAXIMUM_AVATAR_TOKENS,
  TOKENS_TO_RESERVE,
} from "../Constants";
import { Avatar, Controller, KeyCard } from "../typechain-types";
import { parseEther } from "ethers/lib/utils";

dotenv.config({ path: "./.env" });

const CONTRACT_NAME = "PanchBhoot";

const deployFunction = async (
  hre: HardhatRuntimeEnvironment
): Promise<void> => {
  // get ethers and deployments object from hre
  // deployments object is injected by `hardhat-deploy`
  const { ethers, deployments, upgrades, getChainId, network } = hre;

  // get deploy function from deployments
	const { save, getExtendedArtifact } = deployments;

  const [deployer] = await ethers.getSigners();

  await getChainId();

  const adminAddress = DEPLOYER_IS_ADMIN ? deployer.address : Admin_ADDRESS;

  // deploy controller
  const controllerFactory = await ethers.getContractFactory(
    contractsName.CONTROLLER,
    deployer
  );
  const controller = (await upgrades.deployProxy(controllerFactory, [], {
    initializer: false,
  })) as Controller;

	console.log(`Waiting for ${contractsName.CONTROLLER} deployment confirmation...`);
	await controller.deployed();

  // deploy avatar contract
  const avatarFactory = await ethers.getContractFactory(
    contractsName.AVATAR,
    deployer
  );
  const avatarInstance = (await upgrades.deployProxy(avatarFactory, [
    AvatarName,
    AvatarSymbol,
    MAXIMUM_AVATAR_TOKENS,
    adminAddress,
    controller.address,
  ])) as Avatar;
  console.log(`Waiting for ${contractsName.AVATAR} deployment confirmation...`);
  await avatarInstance.deployed();

  // deploy key card contract
  const keyCardFactory = await ethers.getContractFactory(
    contractsName.KEY_CARD,
    deployer
  );
  const keyCardInstance = (await upgrades.deployProxy(keyCardFactory, [
    KeyCardName,
    KeyCardSymbol,
    adminAddress,
    controller.address,
  ])) as KeyCard;
  console.log(`Waiting for ${contractsName.KEY_CARD} deployment confirmation...`);
  await keyCardInstance.deployed();

  // initialise controller
  await (await controller.initialize(
    avatarInstance.address,
    keyCardInstance.address,
    DISCOUNT_SIGNER,
    [adminAddress, ChainLabsAddress],
    [parseEther("0.90"), parseEther("0.10")],
    TOKENS_TO_RESERVE
  )).wait();


	console.log("Waiting for few blocks to verify...");
	console.log("Saving Artifacts now...");

    // controller
	const controllerArtifact = await getExtendedArtifact(contractsName.CONTROLLER);
	await save(contractsName.CONTROLLER, {
		...controllerArtifact,
		address: controller.address,
	});
	console.log("Controller Artifacts Saved");

    // Avatar
	const avatarArtifact = await getExtendedArtifact(contractsName.AVATAR);
	await save(contractsName.AVATAR, {
		...avatarArtifact,
		address: avatarInstance.address,
	});
	console.log("Avatar Artifacts Saved");

    // Key Card
	const keyCardArtifact = await getExtendedArtifact(contractsName.KEY_CARD);
	await save(contractsName.KEY_CARD, {
		...keyCardArtifact,
		address: keyCardInstance.address,
	});
	console.log("Key Card Artifacts Saved");

    // verify contract
    await new Promise((resolve, reject) => {
		setTimeout(async () => {
			// Verify Contract on etherscan
			console.log("Verifying contract on Etherscan");
			if (network.name === "hardhat" || network.name === "localhost") {
				console.log("Etherscan doesn't support network");
			} else {
				try {
                    console.log(process.env.ETHERSCAN_KEY);
                    // controller
					await hre.run("verify:verify", {
						address: controller.address,
					});
                    // avatar
					await hre.run("verify:verify", {
						address: avatarInstance.address,
					});
                    // key card
					await hre.run("verify:verify", {
						address: keyCardInstance.address,
					});
				} catch (e) {
					console.log(e);
				}
				console.log("Contract Verified");
			}
			resolve(1);
		}, 15000);
	});
};

deployFunction.tags = CONTRACT_NAME;

export default deployFunction;
