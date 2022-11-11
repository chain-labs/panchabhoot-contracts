// SPDX-License-Identifier: MIT

pragma solidity 0.8.17;

import {ExampleInternal} from "./ExampleInternal.sol";

// Main contract
// public, external functions
// constants if required
// events definitions
contract Example is ExampleInternal {
    event MaxStorageUpdated();

    function incrementMaxStorage(uint256 _newMaxStorage) external {
        _setMaxStorage(_newMaxStorage);
    }

    function getMaxStorage() external view returns(uint256) {
        return _getMaxStorage();
    }
}