// SPDX-License-Identifier: MIT

pragma solidity 0.8.17;

// should only contain state variables
// constants should not be stored in this contract, either store them in Internal or Main Contract
abstract contract ExampleStorage {
    uint256 internal maxStorage;

    uint256[50] private __gap;
}