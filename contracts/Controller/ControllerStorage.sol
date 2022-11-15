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

    /// @notice avatar which will be distributed from controller
    /// @dev instance of Avatar NFT contract that will be distributed in this phase
    address internal _avatar;

    /// @notice key card which will be distributed from controller along with avatar
    /// @dev instance of MemberKeyCard contract that will be distributed in this phase with avatar
    address internal _keyCard;

    /// @notice lists of sale category details
    /// @dev mapping of sale category id to it's sale category details
    mapping (uint256 => SaleCategory) internal _saleCategories;

    /// @notice counter of sales category that have been added
    /// @dev used to keep track of latest index of sale
    Counters.Counter internal _saleCounter;
}