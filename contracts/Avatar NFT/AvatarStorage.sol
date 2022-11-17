// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "@openzeppelin/contracts/utils/Counters.sol";

abstract contract AvatarStorage {
    using Counters for Counters.Counter;
    
    Counters.Counter internal _tokenIdCounter;
    uint256 internal maximumTokens;
    uint256 internal minterRoleId;
    uint256 internal uriUpdaterRoleId;
    uint256 internal upgradeableAdminRoleId;
    uint256 internal defaultRoyalties;
    bool internal isRoyaltiesActive;
}