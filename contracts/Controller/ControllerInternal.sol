// SPDX-License-Identifier: MIT

pragma solidity 0.8.17;

import {ControllerStorage} from "./ControllerStorage.sol";
import {Counters} from "@openzeppelin/contracts/utils/Counters.sol";

abstract contract ControllerInternal is ControllerStorage {
    using Counters for Counters.Counter;

    // Errors
    error EndTimeBehindStartTime(uint96 _startTime, uint256 _endTime);
    error PerTransactionLimitGreaterThanPerWalletLimit(
        uint64 _perTransactionLimit,
        uint64 _perWalletLimit
    );

    /// @notice set avatar instance address
    /// @dev setter for avatar address
    /// @param _newAvatar new avatar instance
    function _setAvatar(address _newAvatar) internal {
        address _oldAvatar = _avatar;
        _avatar = _newAvatar;
        emit AvatarUpdated(_oldAvatar, _newAvatar);
    }

    /// @notice set key card instance address
    /// @dev setter for key card address
    /// @param _newKeyCard new key card instance
    function _setKeyCard(address _newKeyCard) internal {
        address _oldKeyCard = _keyCard;
        _keyCard = _newKeyCard;
        emit MemberKeyCardUpdated(_oldKeyCard, _newKeyCard);
    }

    /// @notice get avatar NFT contract instance
    /// @dev getter for avatar NFT instance
    /// @return avatar NFT instance
    function _getAvatar() internal view returns (address) {
        return _avatar;
    }

    /// @notice get key card NFT contract instance
    /// @dev getter for key card NFT instance
    /// @return key card NFT instance
    function _getKeyCard() internal view returns (address) {
        return _keyCard;
    }

    function _addSaleCategory(
        uint96 _startTime,
        uint96 _endTime,
        uint256 _price,
        bytes32 _merkleRoot,
        uint64 _perWalletLimit,
        uint64 _perTransactionLimit,
        uint64 _numberOfTokensInThisSale,
        uint64 _totalTokensSoldInThisSale,
        uint64 _keyCardPerAvatar,
        PHASE_ID _phase,
        bool _isDiscountEnabled
    ) internal {
        // checks
        if (_endTime <= _startTime) {
            revert EndTimeBehindStartTime(_startTime, _endTime);
        }
        if (_perTransactionLimit > _perWalletLimit) {
            revert PerTransactionLimitGreaterThanPerWalletLimit(
                _perTransactionLimit,
                _perWalletLimit
            );
        }

        // increment sale counter
        // incrementing in the beginning
        // to prevent any unknown issue caused by default value of uint256
        _saleCounter.increment();
        // get sale category id
        uint256 saleCategoryId = _saleCounter.current();

        // create sale category struct
        SaleCategory memory saleCategory = SaleCategory({
            startTime: _startTime,
            endTime: _endTime,
            price: _price,
            merkleRoot: _merkleRoot,
            perWalletLimit: _perWalletLimit,
            perTransactionLimit: _perTransactionLimit,
            numberOfTokensInThisSale: _numberOfTokensInThisSale,
            totalTokensSoldInThisSale: _totalTokensSoldInThisSale,
            keyCardPerAvatar: _keyCardPerAvatar,
            phase: _phase,
            paused: false, // by defaut a sale is not paused
            isDiscountEnabled: _isDiscountEnabled
        });

        // add sale to mapping
        _saleCategories[saleCategoryId] = saleCategory;

        // emit event for new sale category
        emit AddedSaleCategory(saleCategoryId, uint8(_phase));
    }

    function _getSaleCategory(uint256 _saleCategoryId)
        internal
        view
        returns (SaleCategory memory)
    {
        return _saleCategories[_saleCategoryId];
    }
}
