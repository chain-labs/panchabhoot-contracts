// SPDX-License-Identifier: MIT

pragma solidity 0.8.17;

interface IController {
    enum PHASE_ID {
        PHASE_1,
        PHASE_2,
        PHASE_3
    }

    struct SaleCategory {
        uint256 price;
        bytes32 merkleRoot;
        uint64 perWalletLimit;
        uint64 perTransactionLimit;
        uint64 supply;
        uint64 tokensMinted;
        uint64 keyCardPerAvatar;
        uint96 startTime;
        uint96 endTime;
        PHASE_ID phase;
        bool paused;
        bool isDiscountEnabled;
    }

    // function mintAvatar(address _receiver, uint256 _quantity) external payable;

    // function mintAvatarAtDiscount(
    //     address _receiver,
    //     uint256 _quantity,
    //     uint256 _discountedPrice,
    //     uint256 _validUntil,
    //     uint256 _discountCodeHash,
    //     bytes memory _discountSignature
    // ) external payable;

    // function mintAvatarWithAllowlist(
    //     address _receiver,
    //     uint256 _quantity,
    //     bytes32[] memory _proofs
    // ) external payable;

    function setAvatar(address) external;

    function setKeyCard(address) external;

    function pause() external;

    function unpause() external;

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
    ) external;

    // function setDiscountSigner(address _newDiscountSigner) external;

    // function setTokensToReserve(uint256 _newTokensToReserve) external;

    // function setIntervalToReserve(uint256 _newIntervalToReserve) external;

    function getSaleCategoryCounter() external view returns (uint256);

    // function getIntervalToReserve() external view returns (uint256);

    // function getTokensToReserve() external view returns (uint256);

    // function getDiscountSigner() external view returns (address);

    function getSaleCategory(uint256 _saleCategoryId)
        external
        view
        returns (SaleCategory memory);

    function getKeyCard() external view returns (address);

    function getAvatar() external view returns (address);

    function checkDiscountCodeValidity(
        uint256 _discountIndex,
        uint256 _discountedPrice,
        address _receiverAddress,
        bytes memory _signature
    ) external view returns(bool);

    // function getTokenMintedByAccountInPhase(uint8 _phaseId)
    //     external
    //     view
    //     returns (uint256);
}
