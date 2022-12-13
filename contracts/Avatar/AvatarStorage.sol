// SPDX-License-Identifier: MIT

pragma solidity 0.8.17;

contract AvatarStorage {

    event MaximumTokensUpdated(uint256 _newMaximumTokensSet);
    uint256 internal _maximumTokens;
}
