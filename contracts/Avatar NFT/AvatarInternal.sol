// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import {AvatarStorage} from "./AvatarStorage.sol";

abstract contract AvatarInternal is AvatarStorage {

    function _activateRoyalties() internal{
        isRoyaltiesActive = true;
    }

    function _deactivateRoyalties() internal{
        isRoyaltiesActive = false;
    }

    function _setRoyalties(uint256 _royalty) internal{
        defaultRoyalties = _royalty;
    }

}