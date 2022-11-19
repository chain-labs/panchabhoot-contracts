// SPDX-License-Identifier: MIT

pragma solidity 0.8.17;

import {ControllerStorage} from "./ControllerStorage.sol";
import {IController} from "./IController.sol";

abstract contract ControllerInternal is ControllerStorage {
    /// @notice set avatar instance address
    /// @dev setter for avatar address
    /// @param _newAvatar new avatar instance
    function _setAvatar(address _newAvatar) internal {
        address _oldAvatar = _avatar;
        _avatar = _newAvatar;
        emit AvatarUpdated(_oldAvatar, _newAvatar);
    }

    /// @notice set key card instance address
    /// @dev setter for key card address
    /// @param _newKeyCard new key card instance
    function _setKeyCard(address _newKeyCard) internal {
        address _oldKeyCard = _keyCard;
        _keyCard = _newKeyCard;
        emit MemberKeyCardUpdated(_oldKeyCard, _newKeyCard);
    }

    /// @notice get avatar NFT contract instance
    /// @dev getter for avatar NFT instance
    /// @return avatar NFT instance
    function _getAvatar() internal view returns (address) {
        return _avatar;
    }

    /// @notice get key card NFT contract instance
    /// @dev getter for key card NFT instance
    /// @return key card NFT instance
    function _getKeyCard() internal view returns (address) {
        return _keyCard;
    }
}
