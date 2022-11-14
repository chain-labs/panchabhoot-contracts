// SPDX-License-Identifier: MIT

pragma solidity 0.8.17;

interface IController {
    enum PHASE_ID {
        PHASE_1,
        PHASE_2,
        PHASE_3
    }

    struct SaleCategory {
        uint64 saleId;
        uint96 startTime;
        uint96 endTime;
        uint256 price;
        bytes32 merkleRoot;
        uint64 perWalletLimit;
        uint64 perTransactionLimit;
        uint64 numberOfTokensInThisSale;
        uint64 totalTokensSoldInThisSale;
        uint120 keyCardPerAvatar;
        PHASE_ID phase;
        bool paused;
        bool isDiscountEnabled;
    }

    function mintAvatar(address _receiver, uint256 _quantity) external payable;

    function mintAvatarAtDiscount(
        address _receiver,
        uint256 _quantity,
        uint256 _discountedPrice,
        uint256 _validUntil,
        uint256 _discountCodeHash,
        bytes memory _discountSignature
    ) external payable;

    function mintAvatarWithAllowlist(
        address _receiver,
        uint256 _quantity,
        bytes32[] memory _proofs
    ) external payable;

    function setAvatarNFT(address) external;

    function setKeyCard(address) external;

    function pause() external;

    function unpause() external;

    function addSale() external;

    function editSale() external;

    function setDiscountSigner(address _newDiscountSigner) external;

    function setTokensToReserve(uint256 _newTokensToReserve) external;

    function setIntervalToReserve(uint256 _newIntervalToReserve) external;

    function getSaleCategoryCounter() external view returns (uint64);

    function getIntervalToReserve() external view returns (uint256);

    function getTokensToReserve() external view returns (uint256);

    function getDiscountSigner() external view returns (address);

    function getNAME() external pure returns (string memory);

    function getVERSION() external pure returns (string memory);

    function getSales(uint64 _saleId)
        external
        view
        returns (SaleCategory memory);

    function getMemberKeyCard() external view returns (address);

    function getAvatarNFT() external view returns (address);

    function getTokenMintedByAccountInPhase(uint8 _phaseId)
        external
        view
        returns (uint256);
}
