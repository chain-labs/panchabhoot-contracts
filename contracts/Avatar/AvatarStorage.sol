// SPDX-License-Identifier: MIT

pragma solidity 0.8.17;

contract AvatarStorage {
    event MaximumTokensUpdated(uint256 _newMaximumTokensSet);
    uint256 internal _maximumTokens;
    string internal baseURI;

    uint256[50] internal __gap;
}
