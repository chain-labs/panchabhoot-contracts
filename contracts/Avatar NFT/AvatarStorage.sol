// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

abstract contract AvatarStorage {
    uint256 internal maximumTokens;
    uint256 internal minterRoleId;
    uint256 internal uriUpdaterRoleId;
    uint256 internal upgradeableAdminRoleId;
    uint256 internal defaultRoyalties;
}