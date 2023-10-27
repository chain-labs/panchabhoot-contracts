// SPDX-License-Identifier: MIT

pragma solidity 0.8.17;

import {ControllerStorage} from "./ControllerStorage.sol";
import {Counters} from "@openzeppelin/contracts/utils/Counters.sol";
import {SignatureChecker, ECDSA} from "@openzeppelin/contracts/utils/cryptography/SignatureChecker.sol";
import {MerkleProof} from "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import {IKeyCard} from "../KeyCard/IKeyCard.sol";
import {IAvatar} from "../Avatar/IAvatar.sol";

abstract contract ControllerInternal is ControllerStorage {
    using Counters for Counters.Counter;
    using ECDSA for bytes32;

    // Errors
    error EndTimeBehindStartTime(
        uint96 _invalidStartTime,
        uint256 _invalidEndTime
    );
    error PerTransactionLimitGreaterThanPerWalletLimit(
        uint64 _invalidPerTransactionLimit,
        uint64 _invalidPerWalletLimit
    );
    error StartTimeInPast(uint96 _invalidStartTime);
    error InexistentSaleCategory(uint256 _invalidSaleCategoryId);
    error DiscountCodeAlreadyUsed(uint256 _invalidDiscountIndex);
    error InvalidDiscountCode();
    error TokensAlreadyReservedForPhase(PHASE_ID _phaseId);
    error PhaseIsAlreadyActive(PHASE_ID _currentPhaseId);
    error ArraysLengthDontMatch();
    error PhaseInactive(PHASE_ID _inactivePhase);
    error SalePaused();
    error ExceedsTokensPerTransactionLimit();
    error ExceedsTokensPerWalletLimit();
    error ExceedsSaleSupply();
    error SaleNotActive();
    error SaleNotDiscounted();
    error SaleNotAllowlisted();
    error AccountNotInAllowlist();
    error TransferExactAmount();

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
    function _addSaleCategory(
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
    ) internal {
        // checks
        _requireValidTimePeriod(_startTime, _endTime);
        _requireValidLimits(_perWalletLimit, _perTransactionLimit);

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
            supply: _supply,
            tokensMinted: 0,
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

    /// @notice set new sale time of sale category
    /// @dev set new sale time of sale category
    /// @param _saleCategoryId sale category id
    /// @param _newStartTime new start time of sale category
    /// @param _newEndTime new end time of sale category
    function _setSaleTimeOfSaleCategory(
        uint256 _saleCategoryId,
        uint96 _newStartTime,
        uint96 _newEndTime
    ) internal {
        // checks
        _requireExistentSaleCategory(_saleCategoryId);
        _requireValidTimePeriod(_newStartTime, _newEndTime);

        // get sale category
        SaleCategory memory _saleCategory = _getSaleCategory(_saleCategoryId);

        // set new start time and end time
        _saleCategory.startTime = _newStartTime;
        _saleCategory.endTime = _newEndTime;

        // set sale category
        _saleCategories[_saleCategoryId] = _saleCategory;
        emit TimeUpdatedForSaleCategory(
            _saleCategoryId,
            _newStartTime,
            _newEndTime
        );
    }

    /// @notice set new price of sale category
    /// @dev set new price of sale category
    /// @param _saleCategoryId sale category id
    /// @param _newPrice new price for this sale category
    function _setPriceOfSaleCategory(
        uint256 _saleCategoryId,
        uint256 _newPrice
    ) internal {
        // checks
        _requireExistentSaleCategory(_saleCategoryId);

        // get sale category
        SaleCategory memory _saleCategory = _getSaleCategory(_saleCategoryId);

        // set price
        _saleCategory.price = _newPrice;

        // set sale category
        _saleCategories[_saleCategoryId] = _saleCategory;
        emit PriceUpdatedForSaleCategory(_saleCategoryId, _newPrice);
    }

    /// @notice set new merkle root of sale category
    /// @dev set new merkle root of sale category
    /// @param _saleCategoryId sale category id
    /// @param _newMerkleRoot new merkle root of sale category id
    function _setMerkleRootOfSaleCategory(
        uint256 _saleCategoryId,
        bytes32 _newMerkleRoot
    ) internal {
        // checks
        _requireExistentSaleCategory(_saleCategoryId);

        // get sale category
        SaleCategory memory _saleCategory = _getSaleCategory(_saleCategoryId);

        // set merkle root
        _saleCategory.merkleRoot = _newMerkleRoot;

        // set updated sale category
        _saleCategories[_saleCategoryId] = _saleCategory;
        emit MerkleRootUpdatedSaleCategory(_saleCategoryId, _newMerkleRoot);
    }

    /// @notice set limits of sale category
    /// @dev set limits for wallet or transaction
    /// @param _saleCategoryId sale category id
    /// @param _newPerWalletLimit new limit per wallet
    /// @param _newPerTransactionLimit new limit per transaction
    function _setPerLimitOfSaleCategory(
        uint256 _saleCategoryId,
        uint64 _newPerWalletLimit,
        uint64 _newPerTransactionLimit
    ) internal {
        // checks
        _requireExistentSaleCategory(_saleCategoryId);
        _requireValidLimits(_newPerWalletLimit, _newPerTransactionLimit);

        // get sale category
        SaleCategory memory _saleCategory = _getSaleCategory(_saleCategoryId);

        // set per limits
        _saleCategory.perTransactionLimit = _newPerTransactionLimit;
        _saleCategory.perWalletLimit = _newPerWalletLimit;

        // set sale category
        _saleCategories[_saleCategoryId] = _saleCategory;
        emit PerLimitUpdatedOfSaleCategory(
            _saleCategoryId,
            _newPerTransactionLimit,
            _newPerWalletLimit
        );
    }

    /// @notice set new supply of sale category
    /// @dev set new supply of sale category
    /// @param _saleCategoryId sale category id
    /// @param _newTokensSupply new supply of sale category
    function _setSupplyOfSaleCategory(
        uint256 _saleCategoryId,
        uint64 _newTokensSupply
    ) internal {
        // checks
        _requireExistentSaleCategory(_saleCategoryId);

        // get sale category
        SaleCategory memory _saleCategory = _getSaleCategory(_saleCategoryId);

        // set supply of sale category
        _saleCategory.supply = _newTokensSupply;

        // set sale category
        _saleCategories[_saleCategoryId] = _saleCategory;
        emit SupplyUpdatedForSaleCategory(_saleCategoryId, _newTokensSupply);
    }

    /// @notice set key card ratio of sale category
    /// @dev set key card ratio of sale category
    /// @param _saleCategoryId sale category id
    /// @param _newKeyCardRatio new key card ratio
    function _setKeyCardRatioOfSaleCategory(
        uint256 _saleCategoryId,
        uint64 _newKeyCardRatio
    ) internal {
        // checks
        _requireExistentSaleCategory(_saleCategoryId);

        // get sale category
        SaleCategory memory _saleCategory = _getSaleCategory(_saleCategoryId);

        // set key card ratio of sale category
        _saleCategory.keyCardPerAvatar = _newKeyCardRatio;

        // set updated sale category
        _saleCategories[_saleCategoryId] = _saleCategory;
        emit KeyCardRatioUpdatedForSaleCategory(
            _saleCategoryId,
            _newKeyCardRatio
        );
    }

    /// @notice enable discount for a sale category
    /// @dev enables discount for a sale category
    /// @param _saleCategoryId sale category id
    function _setSaleDicountedTrue(uint256 _saleCategoryId) internal {
        // checks
        _requireExistentSaleCategory(_saleCategoryId);

        // get sale category
        SaleCategory memory _saleCategory = _getSaleCategory(_saleCategoryId);

        // set sale discount to true
        _saleCategory.isDiscountEnabled = true;

        // set updated sale category
        _saleCategories[_saleCategoryId] = _saleCategory;
        emit DiscountEnabledOnSaleCategory(_saleCategoryId);
    }

    /// @notice disable discount for a sale category
    /// @dev disables discount for a sale category
    /// @param _saleCategoryId sale category id
    function _setSaleDiscountedFalse(uint256 _saleCategoryId) internal {
        // checks
        _requireExistentSaleCategory(_saleCategoryId);

        // get sale category
        SaleCategory memory _saleCategory = _getSaleCategory(_saleCategoryId);

        // set sale discount to false
        _saleCategory.isDiscountEnabled = false;

        // set updated sale category
        _saleCategories[_saleCategoryId] = _saleCategory;
        emit DiscountDisabledOnSaleCategory(_saleCategoryId);
    }

    function _incrementTokensMintedInSale(
        SaleCategory memory _saleCategory,
        uint256 _saleCategoryId,
        uint96 _numberOfTokensMinted
    ) internal {
        _saleCategory.tokensMinted += uint64(_numberOfTokensMinted);
        _saleCategories[_saleCategoryId] = _saleCategory;
    }

    function _pauseSale(uint256 _saleCategoryId) internal {
        // checks
        _requireExistentSaleCategory(_saleCategoryId);

        // get sale category
        SaleCategory memory _saleCategory = _getSaleCategory(_saleCategoryId);

        // pause sale
        _saleCategory.paused = true;
        // set updated sale category
        _saleCategories[_saleCategoryId] = _saleCategory;
        emit PausedSale(_saleCategoryId);
    }

    function _unpauseSale(uint256 _saleCategoryId) internal {
        // checks
        _requireExistentSaleCategory(_saleCategoryId);

        // get sale category
        SaleCategory memory _saleCategory = _getSaleCategory(_saleCategoryId);

        // pause sale
        _saleCategory.paused = false;
        // set updated sale category
        _saleCategories[_saleCategoryId] = _saleCategory;
        emit UnpausedSale(_saleCategoryId);
    }

    function _mintAllowlisted(
        SaleCategory memory _sale,
        address _receiver,
        uint96 _numberOfTokens,
        bytes32[] calldata _proofs,
        uint256 _saleId,
        uint256 _discountIndex,
        uint256 _discountedPrice,
        bytes memory _signature,
        bool _isDiscounted
    ) internal {
        // check sale is allowlisted
        _requireSaleToBeAllowlisted(_sale);
        // check valid allowlist
        _requireValidAllowlist(_proofs, _receiver, _sale.merkleRoot);

        // mint tokens
        _mintTokens(
            _sale,
            _receiver,
            _numberOfTokens,
            _saleId,
            _discountIndex,
            _discountedPrice,
            _signature,
            _isDiscounted
        );
    }

    function _mintTokens(
        SaleCategory memory _sale,
        address _receiver,
        uint96 _numberOfTokens,
        uint256 _saleId,
        uint256 _discountIndex,
        uint256 _discountedPrice,
        bytes memory _signature,
        bool _isDiscounted
    ) internal {
        // check if the phase is active or not
        _requirePhaseToBeActive(_sale.phase);
        // check if sale is paused
        _requireSaleNotPaused(_sale);
        // check necessary sale conditions
        _requireSaleValid(_receiver, _numberOfTokens, _saleId, _sale);

        // update tokens minted by user in a sale
        _tokensMintedByUser[_saleId][_receiver] += _numberOfTokens;

        // updated total tokens minted in a sale
        _incrementTokensMintedInSale(_sale, _saleId, _numberOfTokens);

        // check discount is valid
        if (_isDiscounted) {
            // check sale to be discounted
            _requireSaleIsDiscounted(_sale);
            // validate discount code
            _checkValidDiscountCode(
                _discountIndex,
                _discountedPrice,
                _receiver,
                _signature
            );
            // apply discount
            _setDiscountCodeApplied(_discountIndex);
            // check price
            if (msg.value != _numberOfTokens * _discountedPrice) {
                // revert with exact amount not transferred
                revert TransferExactAmount();
            }
        } else {
            if (msg.value != _numberOfTokens * _sale.price) {
                // revert with exact amount not transferred
                revert TransferExactAmount();
            }
        }

        uint256 _keyCardToBeMinted = _sale.keyCardPerAvatar * _numberOfTokens;

        // mint tokens from avatar
        IAvatar(_avatar).mint(_receiver, _numberOfTokens);

        // mint tokens from key card
        IKeyCard(_keyCard).mint(_receiver, _keyCardToBeMinted);
    }

    /// @notice set new discount signer
    /// @dev set new discount signer
    /// @param _newDiscountSigner new discount signer
    function _setDiscountSigner(address _newDiscountSigner) internal {
        _discountSigner = _newDiscountSigner;
        emit DiscountSignerUpdated(_newDiscountSigner);
    }

    function _setDiscountCodeApplied(uint256 _discountIndex) internal {
        _appliedDiscountIndex[_discountIndex] = true;
        emit DiscountCodeApplied(_discountIndex);
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

    /// @notice get sale category
    /// @dev get sale category
    /// @param _saleCategoryId sale category id
    /// @return returns sale category struct
    function _getSaleCategory(
        uint256 _saleCategoryId
    ) internal view returns (SaleCategory memory) {
        // checks
        _requireExistentSaleCategory(_saleCategoryId);
        // return sale category struct
        return _saleCategories[_saleCategoryId];
    }

    /// @notice get number of sale categories that have been added
    /// @dev get number of sale categories that have been added
    /// @return counter number of sale category that have been added
    function _getSaleCategoryCounter() internal view returns (uint256 counter) {
        return _saleCounter.current();
    }

    /// @notice get discount signer address
    /// @dev get discount signer address
    /// @return discountSigner the address of signer who signs discount codes
    function _getDiscountSigner()
        internal
        view
        returns (address discountSigner)
    {
        return _discountSigner;
    }

    function _setNewPhase(PHASE_ID _newPhase) internal {
        // check if really phase is changing
        _requireChangeInPhase(_newPhase);

        // set new phase
        _currentPhase = _newPhase;

        // emit phase changed
        emit PhaseChanged(_newPhase);
    }

    function _getCurrentPhase() internal view returns (PHASE_ID) {
        return _currentPhase;
    }

    function _getTokensToReserveInPhase(
        PHASE_ID _phaseId
    ) internal view returns (uint96) {
        return _tokensToReserve[_phaseId];
    }

    function _setTokenToReserveOfPhase(
        PHASE_ID _phaseId,
        uint96 _numberOfTokens
    ) internal {
        // cannot update tokens to reserve for phase that is already reserved
        _requireTokensNotAlreadyReservedForPhase(_phaseId);
        _tokensToReserve[_phaseId] = _numberOfTokens;
        emit TokenToReserveUpdated(_phaseId, _numberOfTokens);
    }

    function _setTokensReservedForPhase(PHASE_ID _phaseId) internal {
        _reservedForPhase[_phaseId] = true;
    }

    function _checkIfTokenReservedForPhase(
        PHASE_ID _phaseId
    ) internal view returns (bool) {
        return _reservedForPhase[_phaseId];
    }

    function _reserveTokens(PHASE_ID _phaseId) internal {
        // checks
        _requirePhaseToBeActive(_phaseId);
        _requireTokensNotAlreadyReservedForPhase(_phaseId);

        // set tokens reserved
        uint96 numberOfTokens = _getTokensToReserveInPhase(_phaseId);
        address receiver = address(0);
        _setTokensReservedForPhase(_phaseId);

        // reserve tokens
        // todo: 1) Mint tokens from avatar to vault addres

        emit TokensReserved(_phaseId, numberOfTokens, receiver);
    }

    function _checkValidDiscountCode(
        uint256 _discountIndex,
        uint256 _discountedPrice,
        address _receiverAddress,
        bytes memory _signature
    ) internal view returns (bool _isDiscountValid) {
        _requireDiscountCodeIndexValid(_discountIndex);

        // generate discount code hash
        // discountIndex + discountedPrice + receiver address + "Panchabhoot Discount Code"
        bytes32 _discountHash = keccak256(
            abi.encodePacked(
                _discountIndex,
                _discountedPrice,
                _receiverAddress,
                "://Panchabhoot Discount Code"
            )
        );

        // Signature is produced by signing a keccak256 hash with the following format:
        // "\x19Ethereum Signed Message\n" + len(msg) + msg
        bytes32 ethSignedMessageHash = _discountHash.toEthSignedMessageHash();

        // check if discount code is applied or not
        _isDiscountValid = SignatureChecker.isValidSignatureNow(
            _discountSigner,
            ethSignedMessageHash,
            _signature
        );

        // check if signature is valid or not
        if (!_isDiscountValid) {
            revert InvalidDiscountCode();
        }
    }

    // check internal functions
    function _requireValidTimePeriod(
        uint96 _newStartTime,
        uint96 _newEndTime
    ) private view {
        // checks
        // end time cannot be behind start time
        if (_newEndTime <= _newStartTime) {
            revert EndTimeBehindStartTime(_newStartTime, _newEndTime);
        }
        // start time cannot be in past
        if (_newStartTime < uint96(block.timestamp)) {
            revert StartTimeInPast(_newStartTime);
        }
    }

    function _requireValidLimits(
        uint64 _perWalletLimit,
        uint64 _perTransactionLimit
    ) private pure {
        // check if transaction limit is less than wallet limit
        // if transaction limit is greater than wallet limit that means,
        //    a user can never mint tokens greater than wallet limit
        if (_perTransactionLimit > _perWalletLimit) {
            revert PerTransactionLimitGreaterThanPerWalletLimit(
                _perTransactionLimit,
                _perWalletLimit
            );
        }
    }

    function _requireExistentSaleCategory(
        uint256 _saleCategoryId
    ) private view {
        // check if sale category exists or not
        if (_saleCounter.current() < _saleCategoryId || _saleCategoryId == 0) {
            revert InexistentSaleCategory(_saleCategoryId);
        }
    }

    function _requireDiscountCodeIndexValid(
        uint256 _discountIndex
    ) private view {
        // check if discount code is already applied or not
        if (_appliedDiscountIndex[_discountIndex]) {
            revert DiscountCodeAlreadyUsed(_discountIndex);
        }
    }

    function _requireTokensNotAlreadyReservedForPhase(
        PHASE_ID _phaseId
    ) private view {
        if (_reservedForPhase[_phaseId]) {
            revert TokensAlreadyReservedForPhase(_phaseId);
        }
    }

    function _requireChangeInPhase(PHASE_ID _newPhaseId) private view {
        if (_currentPhase == _newPhaseId) {
            revert PhaseIsAlreadyActive(_newPhaseId);
        }
    }

    function _requireSameArrayLength(
        PHASE_ID[] memory _phaseId,
        uint96[] memory _numberOfTokens
    ) internal pure {
        // check if both arrays have same length\
        if (_phaseId.length != _numberOfTokens.length) {
            revert ArraysLengthDontMatch();
        }
    }

    function _requirePhaseToBeActive(PHASE_ID _phaseId) private view {
        if (_currentPhase != _phaseId) {
            revert PhaseInactive(_phaseId);
        }
    }

    function _requireSaleValid(
        address _receiver,
        uint256 _numberOfTokens,
        uint256 _saleId,
        SaleCategory memory _sale
    ) private view {
        uint256 tokensCurrentlyMintedByUser = _tokensMintedByUser[_saleId][
            _receiver
        ];
        if (
            _sale.startTime >= block.timestamp ||
            _sale.endTime <= block.timestamp
        ) {
            revert SaleNotActive();
        }
        if (_numberOfTokens > _sale.perTransactionLimit) {
            // revert with number of tokens to be minted more than per transaction limit
            revert ExceedsTokensPerTransactionLimit();
        }
        if (
            tokensCurrentlyMintedByUser + _numberOfTokens > _sale.perWalletLimit
        ) {
            // revert with buying limit is exceeded
            revert ExceedsTokensPerWalletLimit();
        }
        // note: as discount can be applied, price is checked separately
        if (_sale.tokensMinted + _numberOfTokens > _sale.supply) {
            // revert with suuply exceeded
            revert ExceedsSaleSupply();
        }
    }

    function _requireSaleNotPaused(SaleCategory memory _sale) private pure {
        if (_sale.paused) {
            revert SalePaused();
        }
    }

    function _requireSaleIsDiscounted(SaleCategory memory _sale) private pure {
        if (!_sale.isDiscountEnabled) {
            // revert with discount not enabled for this sale
            revert SaleNotDiscounted();
        }
    }

    function _requireValidAllowlist(
        bytes32[] calldata _proofs,
        address _account,
        bytes32 _merkleRoot
    ) private pure {
        // generate leaf
        bytes32 leaf = keccak256(abi.encodePacked(_account));
        // verify
        bool isAllowlisted = MerkleProof.verify(_proofs, _merkleRoot, leaf);
        if (!isAllowlisted) {
            revert AccountNotInAllowlist();
        }
    }

    function _requireSaleToBeAllowlisted(
        SaleCategory memory _sale
    ) private pure {
        if (_sale.merkleRoot == bytes32(0)) {
            // sale not enabled
            revert SaleNotAllowlisted();
        }
    }
}
