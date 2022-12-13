// SPDX-License-Identifier: MIT

pragma solidity 0.8.17;

interface IKeyCard {
    function mint(address _receiver, uint256 _quantity) external;
}
