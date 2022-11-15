// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import {AvatarStorage} from "./AvatarStorage.sol";

abstract contract AvatarInternal is AvatarStorage {
    function _beforeTokenTransfer(address from, address to, uint256 tokenId, uint256 batchSize)
        internal
        whenNotPaused
        override
    {
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }
}