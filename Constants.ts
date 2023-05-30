import { parseEther } from "ethers/lib/utils";

export const KeyCardName = "Key Card";
export const KeyCardSymbol = "KCT";
export const AvatarName= "Avatar";
export const AvatarSymbol = "AVTR";
export const MAXIMUM_AVATAR_TOKENS = 100;
export const TOKENS_TO_RESERVE = [333, 333, 666]; // Phase 1 - 333, Phase 2 - 333, Phase 3 - 666 // no more than three phases
export const MAX_PHASES = TOKENS_TO_RESERVE.length;
export const DISCOUNT_CODE_MESSAGE = "://Panchabhoot Discount Code";
export const Admin_ADDRESS="0x67BE2C36e75B7439ffc2DCb99dBdF4fbB2455930";
export const DISCOUNT_SIGNER="0x67BE2C36e75B7439ffc2DCb99dBdF4fbB2455930";
export const ChainLabsAddress="0x67BE2C36e75B7439ffc2DCb99dBdF4fbB2455930";
export const adminShare = parseEther("0.90"); // 90%
export const chainLabsShare = parseEther("1").sub(adminShare); // 100% - admin share
// change it to false when a specifed address needs to be admin
export const DEPLOYER_IS_ADMIN=true;