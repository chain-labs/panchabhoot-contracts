// Error codes of @openzeppelin/contracts/access/Ownable.sol
export const OWNABLE_NOT_OWNER = "Ownable: caller is not the owner";

// error codes of @openzeppelin/contracts/*/Initializable.sol
export const INITIALIZABLE_ALREADY_INITIALIZED =
  "Initializable: contract is already initialized";

// error codes of @openzeppelin/contracts/*/Pausable.sol
export const PAUSABLE_NOT_PAUSED = "Pausable: not paused";
export const PAUSABLE_PAUSED = "Pausable: paused";

// error codes of ControllerInternal
export const CONTROLLER_INVALID_DISCOUNT_CODE = "InvalidDiscountCode";
export const CONTROLLER_INEXISTENT_SALE_CATEGORY = "InexistentSaleCategory";
export const CONTROLLER_LIMIT_GREATER =
  "PerTransactionLimitGreaterThanPerWalletLimit";
export const CONTROLLER_START_TIME_IN_PAST = "StartTimeInPast";
export const CONTROLLER_END_TIME_BEHIND = "EndTimeBehindStartTime";
