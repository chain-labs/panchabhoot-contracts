// SPDX-License-Identifier: MIT

pragma solidity 0.8.17;

import {AccessControlUpgradeable} from "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import {OwnableUpgradeable} from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import {ERC721AUpgradeable} from "erc721a-upgradeable/contracts/ERC721AUpgradeable.sol";

contract KeyCard is
    OwnableUpgradeable,
    AccessControlUpgradeable,
    ERC721AUpgradeable
{
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    string internal baseURI;

    uint256[50] internal __gap;

    function initialize(
        string memory _name,
        string memory _symbol,
        address _admin,
        address _minter
    ) external initializer initializerERC721A {
        __Ownable_init();
        __AccessControl_init();
        __ERC721A_init(_name, _symbol);
        _grantRole(DEFAULT_ADMIN_ROLE, _admin);
        _grantRole(MINTER_ROLE, _minter);
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

    function _baseURI() internal view virtual override returns (string memory) {
        return baseURI;
    }

    function setBaseURI(string memory _newBaseURI) external onlyOwner {
        baseURI = _newBaseURI;
    }

    /// @inheritdoc	ERC721AUpgradeable
    function tokenURI(uint256 tokenId)
        public
        view
        virtual
        override
        returns (string memory)
    {
        string memory baseUri = _baseURI();
        return bytes(baseURI).length != 0 ? string(abi.encodePacked(baseUri, _toString(tokenId), ".json")) : "";
    }
}
