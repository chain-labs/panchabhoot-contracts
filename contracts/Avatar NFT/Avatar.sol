// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import {AvatarInternal} from "./AvatarInternal.sol";
import {AvatarStorage} from "./AvatarStorage.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "erc721a/contracts/ERC721A.sol";
import "@openzeppelin/contracts/token/common/ERC2981.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

abstract contract Avatar is ERC721A, ERC2981, Pausable, AccessControl, AvatarStorage, AvatarInternal{  
    using Counters for Counters.Counter;
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");


    constructor() ERC721A("Avatar", "ATR") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(PAUSER_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
    }

    function pause() public onlyRole(PAUSER_ROLE) {
        _pause();
    }

    function unpause() public onlyRole(PAUSER_ROLE) {
        _unpause();
    }

    function safeMint(address to) public onlyRole(MINTER_ROLE) {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
    }
  
    function supportsInterface(bytes4 interfaceId)
    public
    view
    override(ERC721A, ERC2981, AccessControl)
    returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }  
}
