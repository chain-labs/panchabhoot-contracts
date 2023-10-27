// SPDX-License-Identifier: MIT

pragma solidity 0.8.17;

import {AvatarInternal} from "./AvatarInternal.sol";
import {AccessControlUpgradeable} from "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import {OwnableUpgradeable} from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import {ERC721AUpgradeable} from "erc721a-upgradeable/contracts/ERC721AUpgradeable.sol";

contract Avatar is
    OwnableUpgradeable,
    AccessControlUpgradeable,
    ERC721AUpgradeable,
    AvatarInternal
{
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    function initialize(
        string memory _name,
        string memory _symbol,
        uint256 _newMaximumTokens,
        address _admin,
        address _minter
    ) external initializer initializerERC721A {
        __Ownable_init();
        __AccessControl_init();
        __ERC721A_init(_name, _symbol);
        _grantRole(DEFAULT_ADMIN_ROLE, _admin);
        _grantRole(MINTER_ROLE, _minter);
        _setMaximumTokens(_newMaximumTokens);
    }

    function supportsInterface(
        bytes4 interfaceId
    )
        public
        view
        virtual
        override(ERC721AUpgradeable, AccessControlUpgradeable)
        returns (bool)
    {
        super.supportsInterface(interfaceId);
    }

    function mint(
        address _receiver,
        uint256 _quantity
    ) external onlyRole(MINTER_ROLE) {
        _safeMint(_receiver, _quantity);
    }

    function getMaximumTokens() external view returns (uint256) {
        return _getMaximumTokens();
    }

    function setMaximumTokens(uint256 _newMaximumTokens) external {
        _setMaximumTokens(_newMaximumTokens);
    }
}
