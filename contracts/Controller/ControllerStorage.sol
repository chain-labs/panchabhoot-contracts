// SPDX-License-Identifier: MIT

pragma solidity 0.8.17;

import {IController} from "./IController.sol";
import {Counters} from "@openzeppelin/contracts/utils/Counters.sol";

abstract contract ControllerStorage is IController {
    /// @notice logs when new avatar is updated
    /// @dev emitted when new avatar contract is added
    /// @param _oldAvatar old avatar contract address
    /// @param _newAvatar new avatar contract address
    event AvatarUpdated(address _oldAvatar, address _newAvatar);

    /// @notice logs when new member key card is updated
    /// @dev emitted when new member key card contract is added
    /// @param _oldKeyCard old member key card contract address
    /// @param _newKeyCard new member key card contract address
    event MemberKeyCardUpdated(address _oldKeyCard, address _newKeyCard);

    /// @notice logs when new sale category is added
    /// @dev emitted when new sale category is added
    /// @param _saleCategoryId sale category ID
    /// @param _phase phase of sale category
    event AddedSaleCategory(uint256 _saleCategoryId, uint8 _phase);

    /// @notice logs when start time and end time is updated for a sale category
    /// @dev emitted when start time and end time is updated for a sale category
    /// @param _saleCategoryId id of sale category which is updated
    /// @param _newStartTime updated start time of sale category
    /// @param _newEndTime updated start time of sale category
    event TimeUpdatedForSaleCategory(
        uint256 _saleCategoryId,
        uint96 _newStartTime,
        uint96 _newEndTime
    );

    /// @notice logs when new price is set for sale category
    /// @dev emitted when a new price is set for sale category
    /// @param _saleCategoryId id of sale category which is updated
    /// @param _newPrice updated price of this category
    event PriceUpdatedForSaleCategory(
        uint256 _saleCategoryId,
        uint256 _newPrice
    );

    /// @notice logs when merkle root is updated for sale category
    /// @dev wmitted when a new merkle root is set for sale category
    /// @param _saleCategoryId id of sale category which is updated
    /// @param _newMerkleRoot updated merkle root of this category
    event MerkleRootUpdatedSaleCategory(
        uint256 _saleCategoryId,
        bytes32 _newMerkleRoot
    );

    /// @notice logs when limit per wallet and transaction is updated for sale category
    /// @dev emitted when limit per wallet and transaction is updated for sale category
    /// @param _saleCategoryId id of sale category which is updated
    /// @param _newPerTransactionLimit new per transaction limit
    /// @param _newPerWalletLimit new per wallet limit
    event PerLimitUpdatedOfSaleCategory(
        uint256 _saleCategoryId,
        uint64 _newPerTransactionLimit,
        uint64 _newPerWalletLimit
    );

    /// @notice logs when supply of sale category is updated
    /// @dev emitted when supply of sale category is updated
    /// @param _saleCategoryId id of sale category which is updated
    /// @param _newSupplyForTheSale new supply for this sale category
    event SupplyUpdatedForSaleCategory(
        uint256 _saleCategoryId,
        uint64 _newSupplyForTheSale
    );

    /// @notice logs when key card : avatar NFT ratio is updated for a sale category
    /// @dev emitted when key card : avatar NFT ratio is updated for a sale category
    /// @param _saleCategoryId id of sale category which is updated
    /// @param _newKeyCardRatio new key card ratio
    event KeyCardRatioUpdatedForSaleCategory(
        uint256 _saleCategoryId,
        uint64 _newKeyCardRatio
    );

    /// @notice logs when discount is enabled for sale category
    /// @dev emitted when discount is enabled for sale category
    /// @param _saleCategoryId id of sale category which is updated
    event DiscountEnabledOnSaleCategory(uint256 _saleCategoryId);

    /// @notice logs when discount is disabled for sale category
    /// @dev emitted when discount is disabled for sale category
    /// @param _saleCategoryId id of sale category which is updated
    event DiscountDisabledOnSaleCategory(uint256 _saleCategoryId);

    /// @notice logs when discount signer is updated
    /// @dev emitted when discount signer is updated
    /// @param _newDiscountSigner address of new discount signer
    event DiscountSignerUpdated(address _newDiscountSigner);

    /// @notice logs when discount code index is applied
    /// @dev emitted when discount code index is applied
    /// @param _discountCodeIndex discount code index which is applied
    event DiscountCodeApplied(uint256 _discountCodeIndex);

    /// @notice avatar which will be distributed from controller
    /// @dev instance of Avatar NFT contract that will be distributed in this phase
    address internal _avatar;

    /// @notice key card which will be distributed from controller along with avatar
    /// @dev instance of MemberKeyCard contract that will be distributed in this phase with avatar
    address internal _keyCard;

    /// @notice address that will sign discount codes
    /// @dev discount codes are signed by this address
    address internal _discountSigner;

    /// @notice lists of sale category details
    /// @dev mapping of sale category id to it's sale category details
    mapping(uint256 => SaleCategory) internal _saleCategories;

    /// @notice discount code indexes which have been applied
    /// @dev if true, discount is applied
    mapping(uint256 => bool) internal _appliedDiscountIndex;

    /// @notice counter of sales category that have been added
    /// @dev used to keep track of latest index of sale
    Counters.Counter internal _saleCounter;
}
