import { KeyCard } from "./../typechain-types/contracts/KeyCard/KeyCard";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { contractsName } from "../test/Constants";
import { Avatar, Controller } from "../typechain-types";
import { task } from "hardhat/config";

const upgradeFunction = async (
  taskArgs: unknown,
  hre: HardhatRuntimeEnvironment
): Promise<void> => {
  if (taskArgs === undefined) {
    console.log("Task arguments are undefined");
  }
  // get ethers and deployments object from hre
  // deployments object is injected by `hardhat-deploy`
  const { ethers, deployments, upgrades, getChainId, network } = hre;

  // get deploy function from deployments
  const { save, getExtendedArtifact } = deployments;

  const [deployer] = await ethers.getSigners();

  await getChainId();

  // deploy controller
  const controllerFactory = await ethers.getContractFactory(
    contractsName.CONTROLLER,
    deployer
  );
  const oldControllerProxy = await ethers.getContract(contractsName.CONTROLLER);
  const controller = (await upgrades.upgradeProxy(
    oldControllerProxy,
    controllerFactory,
    {
      unsafeAllow: ["constructor"],
    }
  )) as Controller;

  console.log(
    `Waiting for ${contractsName.CONTROLLER} upgrade confirmation...`
  );
  await controller.deployed();

  // deploy avatar contract
  const avatarFactory = await ethers.getContractFactory(
    contractsName.AVATAR,
    deployer
  );
  const oldAvatarProxy = await ethers.getContract(contractsName.AVATAR);
  const avatarInstance = (await upgrades.upgradeProxy(
    oldAvatarProxy,
    avatarFactory
  )) as Avatar;
  console.log(`Waiting for ${contractsName.AVATAR} upgrade confirmation...`);
  await avatarInstance.deployed();

  // deploy key card contract
  const keyCardFactory = await ethers.getContractFactory(
    contractsName.KEY_CARD,
    deployer
  );
  const oldKeyCardProxy = await ethers.getContract(contractsName.KEY_CARD);
  const keyCardInstance = (await upgrades.upgradeProxy(
    oldKeyCardProxy,
    keyCardFactory
  )) as KeyCard;
  console.log(`Waiting for ${contractsName.KEY_CARD} upgrade confirmation...`);
  await keyCardInstance.deployed();

  console.log("Waiting for few blocks to verify...");
  console.log("Saving Artifacts now...");

  // controller
  const controllerArtifact = await getExtendedArtifact(
    contractsName.CONTROLLER
  );
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

  // few more things:
  await (await avatarInstance.setMaximumTokens(10000)).wait();

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

task("upgradeContracts", "Upgrade contracts").setAction(upgradeFunction);
