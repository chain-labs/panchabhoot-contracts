// SPDX-License-Identifier: MIT

pragma solidity 0.8.17;

import {AvatarStorage} from "./AvatarStorage.sol";

contract AvatarInternal is AvatarStorage {
    function _setMaximumTokens(uint256 _newMaximumTokens) internal {
        _maximumTokens = _newMaximumTokens;
        emit MaximumTokensUpdated(_newMaximumTokens);
    }

    function _getMaximumTokens() internal view returns(uint256) {
        return _maximumTokens;
    }
}
