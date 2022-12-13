// SPDX-License-Identifier: MIT

pragma solidity 0.8.17;

import {AvatarInternal} from "./AvatarInternal.sol";

contract Avatar is AvatarInternal {
    function getMaximumTokens() external view returns(uint256) {
        return _getMaximumTokens();
    }

    function setMaximumTokens(uint256 _newMaximumTokens) external {
        _setMaximumTokens(_newMaximumTokens);
    }
}
