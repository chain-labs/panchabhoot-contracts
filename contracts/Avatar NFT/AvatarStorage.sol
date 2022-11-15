// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "@openzeppelin/contracts/utils/Counters.sol";

abstract contract AvatarStorage {
    using Counters for Counters.Counter;
    
    Counters.Counter internal _tokenIdCounter;
}