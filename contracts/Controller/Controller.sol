// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import {ControllerInternal} from "./ControllerInternal.sol";
import {PausableUpgradeable} from "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import {Ownable2StepUpgradeable} from "@openzeppelin/contracts-upgradeable/access/Ownable2StepUpgradeable.sol";
import {ReentrancyGuardUpgradeable} from "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
import {PaymentSplitterUpgradeable} from "@openzeppelin/contracts-upgradeable/finance/PaymentSplitterUpgradeable.sol";

contract Controller is
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

    function setAvatar(address _newAvatar) external virtual override onlyOwner {
        _setAvatar(_newAvatar);
    }

    function setKeyCard(address _newKeyCard)
        external
        virtual
        override
        onlyOwner
    {
        _setKeyCard(_newKeyCard);
    }

    /// @notice add new sale category
    /// @dev add new sale category
    /// @param _startTime start time of sale
    /// @param _endTime end time of sale
    /// @param _price price per NFT of the sale
    /// @param _merkleRoot merkle root of sale
    /// @param _perWalletLimit allowed NFT limit per wallet
    /// @param _perTransactionLimit allowed NFT limit per transaction
    /// @param _supply supply of NFTs allowed to be sold in this sale category
    /// @param _keyCardPerAvatar number of Key Card to be given per avatar minted
    /// @param _phase which phase does this sale category belongs to
    /// @param _isDiscountEnabled is discount enabled on this sale
    function addSale(
        uint96 _startTime,
        uint96 _endTime,
        uint256 _price,
        bytes32 _merkleRoot,
        uint64 _perWalletLimit,
        uint64 _perTransactionLimit,
        uint64 _supply,
        uint64 _keyCardPerAvatar,
        PHASE_ID _phase,
        bool _isDiscountEnabled
    ) external virtual override onlyOwner {
        _addSaleCategory(
            _startTime,
            _endTime,
            _price,
            _merkleRoot,
            _perWalletLimit,
            _perTransactionLimit,
            _supply,
            _keyCardPerAvatar,
            _phase,
            _isDiscountEnabled
        );
    }

    /// @notice edit new sale time of sale category
    /// @dev edit new sale time of sale category
    /// @param _saleCategoryId sale category id
    /// @param _newStartTime new start time of sale category
    /// @param _newEndTime new end time of sale category
    function editSaleTimeOfSaleCategory(
        uint256 _saleCategoryId,
        uint96 _newStartTime,
        uint96 _newEndTime
    ) external onlyOwner {
        // checks
        if (_newEndTime <= _newStartTime) {
            revert EndTimeBehindStartTime(_newStartTime, _newEndTime);
        }
        if (_newStartTime < uint96(block.timestamp)) {
            revert StartTimeInPast(_newStartTime);
        }

        // set sale start time of sale category
        _setSaleTimeOfSaleCategory(_saleCategoryId, _newStartTime, _newEndTime);
    }

    /// @notice edit new price of sale category
    /// @dev edit new price of sale category
    /// @param _saleCategoryId sale category id
    /// @param _newPrice new price for this sale category
    function editPriceOfSaleCategory(uint256 _saleCategoryId, uint256 _newPrice)
        external
        onlyOwner
    {
        // set price of sale category
        _setPriceOfSaleCategory(_saleCategoryId, _newPrice);
    }

    /// @notice edit new merkle root of sale category
    /// @dev edit new merkle root of sale category
    /// @param _saleCategoryId sale category id
    /// @param _newMerkleRoot new merkle root of sale category id
    function editMerkleRootOfSaleCategory(
        uint256 _saleCategoryId,
        bytes32 _newMerkleRoot
    ) external onlyOwner {
        // set merkle root of sale category
        _setMerkleRootOfSaleCategory(_saleCategoryId, _newMerkleRoot);
    }

    /// @notice edit limits of sale category
    /// @dev edit limits for wallet or transaction
    /// @param _saleCategoryId sale category id
    /// @param _newPerWalletLimit new limit per wallet
    /// @param _newPerTransactionLimit new limit per transaction
    function editPerLimitOfSaleCategory(
        uint256 _saleCategoryId,
        uint64 _newPerWalletLimit,
        uint64 _newPerTransactionLimit
    ) external onlyOwner {
        // set limit per wallet and limit per transaction
        _setPerLimitOfSaleCategory(
            _saleCategoryId,
            _newPerWalletLimit,
            _newPerTransactionLimit
        );
    }

    /// @notice edit new supply of sale category
    /// @dev edit new supply of sale category
    /// @param _saleCategoryId sale category id
    /// @param _newTokensSupply new supply of sale category
    function editSupplyOfSaleCategory(
        uint256 _saleCategoryId,
        uint64 _newTokensSupply
    ) external onlyOwner {
        // set supply of sale category
        _setSupplyOfSaleCategory(_saleCategoryId, _newTokensSupply);
    }

    /// @notice edit key card ratio of sale category
    /// @dev edit key card ratio of sale category
    /// @param _saleCategoryId sale category id
    /// @param _newKeyCardRatio new key card ratio
    function editKeyCardRatioOfSaleCategory(
        uint256 _saleCategoryId,
        uint64 _newKeyCardRatio
    ) external onlyOwner {
        // set key card ratio
        _setKeyCardRatioOfSaleCategory(_saleCategoryId, _newKeyCardRatio);
    }

    /// @notice toggle discount for a sale category
    /// @dev toggle discount for a sale category
    /// @param _saleCategoryId sale category id
    /// @param _isDiscounted is discount to be enabled
    function toggleDiscountOfSaleCategory(
        uint256 _saleCategoryId,
        bool _isDiscounted
    ) external onlyOwner {
        if (_isDiscounted) {
            // enable discount on sale category
            _setSaleDicountedTrue(_saleCategoryId);
        } else {
            // disable discount on sale category
            _setSaleDiscountedFalse(_saleCategoryId);
        }
    }

    /// @notice get sale category
    /// @dev get sale category
    /// @param _saleCategoryId sale category id
    /// @return returns sale category struct
    function getSaleCategory(uint256 _saleCategoryId)
        external
        view
        virtual
        override
        returns (SaleCategory memory)
    {
        return _getSaleCategory(_saleCategoryId);
    }

    /// @notice get avatar NFT contract instance
    /// @dev getter for avatar NFT instance
    /// @return avatar NFT instance
    function getAvatar() external view virtual override returns (address) {
        return _getAvatar();
    }

    /// @notice get key card NFT contract instance
    /// @dev getter for key card NFT instance
    /// @return key card NFT instance
    function getKeyCard() external view virtual override returns (address) {
        return _getKeyCard();
    }

    /// @notice pause public functions
    /// @dev pause public functions
    function pause() external onlyOwner {
        _pause();
    }

    /// @notice unpause public functions
    /// @dev unpause public functions
    function unpause() external onlyOwner {
        _unpause();
    }

    /// @notice get number of sale categories that have been added
    /// @dev get number of sale categories that have been added
    /// @return counter number of sale category that have been added
    function getSaleCategoryCounter()
        external
        view
        virtual
        override
        returns (uint256 counter)
    {
        return _getSaleCategoryCounter();
    }
}
