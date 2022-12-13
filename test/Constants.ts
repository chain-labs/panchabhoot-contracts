import { ContractNames } from "../types/ContractNames";

export const contractsName: ContractNames = {
  CONTROLLER: "Controller",
  AVATAR: "Avatar"
};

export const TOKENS_TO_RESERVE = [333, 333, 666]; // Phase 1 - 333, Phase 2 - 333, Phase 3 - 666 // no more than three phases
export const MAX_PHASES = TOKENS_TO_RESERVE.length;
export const DISCOUNT_CODE_MESSAGE = "://Panchabhoot Discount Code";

export const UNIT_TEST = "Unit Test: ";
