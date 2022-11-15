// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import {ControllerInternal} from "./ControllerInternal.sol";
import {IController} from "./IController.sol";
import {PausableUpgradeable} from "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import {Ownable2StepUpgradeable} from "@openzeppelin/contracts-upgradeable/access/Ownable2StepUpgradeable.sol";
import {ReentrancyGuardUpgradeable} from "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
import {PaymentSplitterUpgradeable} from "@openzeppelin/contracts-upgradeable/finance/PaymentSplitterUpgradeable.sol";

contract Controller is
    // IController,
    PausableUpgradeable,
    Ownable2StepUpgradeable,
    ReentrancyGuardUpgradeable,
    PaymentSplitterUpgradeable,
    ControllerInternal
{
    string public constant NAME = "Controller";
    string public constant VERSION = "0.1.0";

    function initialize(
        address _newAvatar,
        address _newKeyCard,
        address[] memory _payees,
        uint256[] memory _shares
    ) external initializer {
        __Pausable_init();
        __Ownable2Step_init();
        __ReentrancyGuard_init();
        __PaymentSplitter_init(_payees, _shares);
        _setAvatar(_newAvatar);
        _setKeyCard(_newKeyCard);
    }

    function setAvatar(address _newAvatar) external onlyOwner {
        _setAvatar(_newAvatar);
    }

    function setKeyCard(address _newKeyCard) external onlyOwner {
        _setKeyCard(_newKeyCard);
    }

    function getAvatar() external view returns(address) {
        return _getAvatar();
    }

    function getKeyCard() external view returns(address) {
        return _getKeyCard();
    }
}
