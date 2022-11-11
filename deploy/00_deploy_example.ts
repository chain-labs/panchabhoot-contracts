import { HardhatRuntimeEnvironment } from "hardhat/types";

const CONTRACT_NAME = "Example";

const deployFunction = async (hre: HardhatRuntimeEnvironment): Promise<void> => {
    // get ethers and deployments object from hre
    // deployments object is injected by `hardhat-deploy`
    const {ethers, deployments} = hre;

    // get deploy function from deployments
    const {deploy} = deployments;

    const [deployer] = await ethers.getSigners();

    // deploy contract
    const { address } = await deploy(CONTRACT_NAME, {
        from: deployer.address,
        args: [],
        log: true,
        skipIfAlreadyDeployed: true
    });
}

deployFunction.tags = CONTRACT_NAME;

export default deployFunction;
