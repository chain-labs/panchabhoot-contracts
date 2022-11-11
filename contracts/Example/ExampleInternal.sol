// SPDX-License-Identifier: MIT

pragma solidity 0.8.17;

import {ExampleStorage} from "./ExampleStorage.sol";

// Errors
error CannotDecreaseMaxStorage();

// should contain necessary internal methods to update state variables
// checks should be done for general state variable update conditions.
// internal or private functions
// modifiers
abstract contract ExampleInternal is ExampleStorage {
    function _setMaxStorage(uint256 _newMaximumStorage) internal {
        if (_newMaximumStorage < _getMaxStorage()) {
            revert CannotDecreaseMaxStorage();
        }
        maxStorage = _newMaximumStorage;
    }

    function _getMaxStorage() internal view returns(uint256) {
        return maxStorage;
    }
}