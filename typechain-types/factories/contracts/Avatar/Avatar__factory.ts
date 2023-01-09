/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../../common";
import type { Avatar, AvatarInterface } from "../../../contracts/Avatar/Avatar";

const _abi = [
  {
    inputs: [],
    name: "ApprovalCallerNotOwnerNorApproved",
    type: "error",
  },
  {
    inputs: [],
    name: "ApprovalQueryForNonexistentToken",
    type: "error",
  },
  {
    inputs: [],
    name: "BalanceQueryForZeroAddress",
    type: "error",
  },
  {
    inputs: [],
    name: "MintERC2309QuantityExceedsLimit",
    type: "error",
  },
  {
    inputs: [],
    name: "MintToZeroAddress",
    type: "error",
  },
  {
    inputs: [],
    name: "MintZeroQuantity",
    type: "error",
  },
  {
    inputs: [],
    name: "OwnerQueryForNonexistentToken",
    type: "error",
  },
  {
    inputs: [],
    name: "OwnershipNotInitializedForExtraData",
    type: "error",
  },
  {
    inputs: [],
    name: "TransferCallerNotOwnerNorApproved",
    type: "error",
  },
  {
    inputs: [],
    name: "TransferFromIncorrectOwner",
    type: "error",
  },
  {
    inputs: [],
    name: "TransferToNonERC721ReceiverImplementer",
    type: "error",
  },
  {
    inputs: [],
    name: "TransferToZeroAddress",
    type: "error",
  },
  {
    inputs: [],
    name: "URIQueryForNonexistentToken",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "approved",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "approved",
        type: "bool",
      },
    ],
    name: "ApprovalForAll",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "fromTokenId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "toTokenId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
    ],
    name: "ConsecutiveTransfer",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint8",
        name: "version",
        type: "uint8",
      },
    ],
    name: "Initialized",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "_newMaximumTokensSet",
        type: "uint256",
      },
    ],
    name: "MaximumTokensUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "previousAdminRole",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "newAdminRole",
        type: "bytes32",
      },
    ],
    name: "RoleAdminChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address",
      },
    ],
    name: "RoleGranted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address",
      },
    ],
    name: "RoleRevoked",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    inputs: [],
    name: "DEFAULT_ADMIN_ROLE",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "MINTER_ROLE",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "getApproved",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getMaximumTokens",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
    ],
    name: "getRoleAdmin",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "grantRole",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "hasRole",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_name",
        type: "string",
      },
      {
        internalType: "string",
        name: "_symbol",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "_newMaximumTokens",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "_admin",
        type: "address",
      },
      {
        internalType: "address",
        name: "_minter",
        type: "address",
      },
    ],
    name: "initialize",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
    ],
    name: "isApprovedForAll",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_receiver",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_quantity",
        type: "uint256",
      },
    ],
    name: "mint",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "ownerOf",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "renounceRole",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "revokeRole",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "_data",
        type: "bytes",
      },
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        internalType: "bool",
        name: "approved",
        type: "bool",
      },
    ],
    name: "setApprovalForAll",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_newMaximumTokens",
        type: "uint256",
      },
    ],
    name: "setMaximumTokens",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes4",
        name: "interfaceId",
        type: "bytes4",
      },
    ],
    name: "supportsInterface",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "tokenURI",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x608060405234801561001057600080fd5b50612527806100206000396000f3fe6080604052600436106101b75760003560e01c806370a08231116100ec578063a22cb4651161008a578063d539139311610064578063d5391393146104f4578063d547741f14610528578063e985e9c514610548578063f2fde38b146105b057600080fd5b8063a22cb465146104a1578063b88d4fde146104c1578063c87b56dd146104d457600080fd5b80638da5cb5b116100c65780638da5cb5b1461041357806391d148541461043157806395d89b4114610477578063a217fddf1461048c57600080fd5b806370a08231146103be578063715018a6146103de5780637e77c503146103f357600080fd5b8063248a9ca3116101595780633998623c116101335780633998623c1461034b57806340c10f191461036b57806342842e0e1461038b5780636352211e1461039e57600080fd5b8063248a9ca3146102db5780632f2ff15d1461030b57806336568abe1461032b57600080fd5b8063095ea7b311610195578063095ea7b31461024b57806316ed86e91461026057806318160ddd1461028357806323b872dd146102c857600080fd5b806301ffc9a7146101bc57806306fdde03146101f1578063081812fc14610213575b600080fd5b3480156101c857600080fd5b506101dc6101d7366004611ea7565b6105d0565b60405190151581526020015b60405180910390f35b3480156101fd57600080fd5b506102066105e1565b6040516101e89190611f14565b34801561021f57600080fd5b5061023361022e366004611f27565b610683565b6040516001600160a01b0390911681526020016101e8565b61025e610259366004611f57565b6106ff565b005b34801561026c57600080fd5b5061027561070f565b6040519081526020016101e8565b34801561028f57600080fd5b507f2569078dfb4b0305704d3008e7403993ae9601b85f7ae5e742de3de8f8011c41546000805160206124d28339815191525403610275565b61025e6102d6366004611f81565b61071f565b3480156102e757600080fd5b506102756102f6366004611f27565b60009081526097602052604090206001015490565b34801561031757600080fd5b5061025e610326366004611fbd565b6109e8565b34801561033757600080fd5b5061025e610346366004611fbd565b610a12565b34801561035757600080fd5b5061025e610366366004611f27565b610a9f565b34801561037757600080fd5b5061025e610386366004611f57565b610aab565b61025e610399366004611f81565b610adf565b3480156103aa57600080fd5b506102336103b9366004611f27565b610afa565b3480156103ca57600080fd5b506102756103d9366004611fe9565b610b0b565b3480156103ea57600080fd5b5061025e610b92565b3480156103ff57600080fd5b5061025e61040e3660046120b0565b610ba6565b34801561041f57600080fd5b506033546001600160a01b0316610233565b34801561043d57600080fd5b506101dc61044c366004611fbd565b60009182526097602090815260408084206001600160a01b0393909316845291905290205460ff1690565b34801561048357600080fd5b50610206610e7b565b34801561049857600080fd5b50610275600081565b3480156104ad57600080fd5b5061025e6104bc36600461213f565b610e9a565b61025e6104cf36600461217b565b610f25565b3480156104e057600080fd5b506102066104ef366004611f27565b610f6f565b34801561050057600080fd5b506102757f9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a681565b34801561053457600080fd5b5061025e610543366004611fbd565b611019565b34801561055457600080fd5b506101dc6105633660046121f7565b6001600160a01b0391821660009081527f2569078dfb4b0305704d3008e7403993ae9601b85f7ae5e742de3de8f8011c476020908152604080832093909416825291909152205460ff1690565b3480156105bc57600080fd5b5061025e6105cb366004611fe9565b61103e565b60006105db826110cb565b50919050565b60606000805160206124d2833981519152600201805461060090612221565b80601f016020809104026020016040519081016040528092919081815260200182805461062c90612221565b80156106795780601f1061064e57610100808354040283529160200191610679565b820191906000526020600020905b81548152906001019060200180831161065c57829003601f168201915b5050505050905090565b600061068e82611164565b6106c4576040517fcf4700e400000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b5060009081527f2569078dfb4b0305704d3008e7403993ae9601b85f7ae5e742de3de8f8011c4660205260409020546001600160a01b031690565b61070b828260016111b8565b5050565b600061071a60c95490565b905090565b600061072a826112e0565b9050836001600160a01b0316816001600160a01b031614610777576040517fa114810000000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b60008281527f2569078dfb4b0305704d3008e7403993ae9601b85f7ae5e742de3de8f8011c46602052604090208054338082146001600160a01b03881690911417610838576001600160a01b03861660009081527f2569078dfb4b0305704d3008e7403993ae9601b85f7ae5e742de3de8f8011c476020908152604080832033845290915290205460ff16610838576040517f59c896be00000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b6001600160a01b038516610878576040517fea553b3400000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b801561088357600082555b6001600160a01b0386811660009081527f2569078dfb4b0305704d3008e7403993ae9601b85f7ae5e742de3de8f8011c4560205260408082208054600019019055918716808252919020805460010190554260a01b17600160e11b1760008581527f2569078dfb4b0305704d3008e7403993ae9601b85f7ae5e742de3de8f8011c446020526040812091909155600160e11b8416900361099e576001840160008181527f2569078dfb4b0305704d3008e7403993ae9601b85f7ae5e742de3de8f8011c446020526040812054900361099c576000805160206124d283398151915254811461099c5760008181527f2569078dfb4b0305704d3008e7403993ae9601b85f7ae5e742de3de8f8011c44602052604090208490555b505b83856001600160a01b0316876001600160a01b03167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef60405160405180910390a45b505050505050565b600082815260976020526040902060010154610a03816113ab565b610a0d83836113b5565b505050565b6001600160a01b0381163314610a955760405162461bcd60e51b815260206004820152602f60248201527f416363657373436f6e74726f6c3a2063616e206f6e6c792072656e6f756e636560448201527f20726f6c657320666f722073656c66000000000000000000000000000000000060648201526084015b60405180910390fd5b61070b8282611457565b610aa8816114da565b50565b7f9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6610ad5816113ab565b610a0d8383611515565b610a0d83838360405180602001604052806000815250610f25565b6000610b05826112e0565b92915050565b60006001600160a01b038216610b4d576040517f8f4eb60400000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b506001600160a01b031660009081527f2569078dfb4b0305704d3008e7403993ae9601b85f7ae5e742de3de8f8011c45602052604090205467ffffffffffffffff1690565b610b9a61152f565b610ba46000611589565b565b600054610100900460ff1615808015610bc65750600054600160ff909116105b80610be05750303b158015610be0575060005460ff166001145b610c525760405162461bcd60e51b815260206004820152602e60248201527f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160448201527f647920696e697469616c697a65640000000000000000000000000000000000006064820152608401610a8c565b6000805460ff191660011790558015610c75576000805461ff0019166101001790555b7fee151c8401928dc223602bb187aff91b9a56c7cae5476ef1b3287b085a16c85f54610100900460ff16610cce577fee151c8401928dc223602bb187aff91b9a56c7cae5476ef1b3287b085a16c85f5460ff1615610cd2565b303b155b610d445760405162461bcd60e51b815260206004820152603760248201527f455243373231415f5f496e697469616c697a61626c653a20636f6e747261637460448201527f20697320616c726561647920696e697469616c697a65640000000000000000006064820152608401610a8c565b7fee151c8401928dc223602bb187aff91b9a56c7cae5476ef1b3287b085a16c85f54610100900460ff16158015610da4577fee151c8401928dc223602bb187aff91b9a56c7cae5476ef1b3287b085a16c85f805461ffff19166101011790555b610dac6115e8565b610db461165b565b610dbe87876116c6565b610dc96000856113b5565b610df37f9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6846113b5565b610dfc856114da565b8015610e2d577fee151c8401928dc223602bb187aff91b9a56c7cae5476ef1b3287b085a16c85f805461ff00191690555b5080156109e0576000805461ff0019169055604051600181527f7f26b83ff96e1f2b6a682f133852f6798a09c465da95921460cefb38474024989060200160405180910390a1505050505050565b60606000805160206124d2833981519152600301805461060090612221565b3360008181527f2569078dfb4b0305704d3008e7403993ae9601b85f7ae5e742de3de8f8011c47602090815260408083206001600160a01b03871680855290835292819020805460ff191686151590811790915590519081529192917f17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31910160405180910390a35050565b610f3084848461071f565b6001600160a01b0383163b15610f6957610f4c8484848461176c565b610f69576040516368d2bf6b60e11b815260040160405180910390fd5b50505050565b6060610f7a82611164565b610fb0576040517fa14c4b5000000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b6000610fc760408051602081019091526000815290565b90508051600003610fe75760405180602001604052806000815250611012565b80610ff184611857565b604051602001611002929190612255565b6040516020818303038152906040525b9392505050565b600082815260976020526040902060010154611034816113ab565b610a0d8383611457565b61104661152f565b6001600160a01b0381166110c25760405162461bcd60e51b815260206004820152602660248201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160448201527f64647265737300000000000000000000000000000000000000000000000000006064820152608401610a8c565b610aa881611589565b60007f01ffc9a7000000000000000000000000000000000000000000000000000000006001600160e01b03198316148061112e57507f80ac58cd000000000000000000000000000000000000000000000000000000006001600160e01b03198316145b80610b055750506001600160e01b0319167f5b5e139f000000000000000000000000000000000000000000000000000000001490565b60006000805160206124d28339815191525482108015610b0557505060009081527f2569078dfb4b0305704d3008e7403993ae9601b85f7ae5e742de3de8f8011c446020526040902054600160e01b161590565b60006111c383610afa565b9050811561125757336001600160a01b03821614611257576001600160a01b03811660009081527f2569078dfb4b0305704d3008e7403993ae9601b85f7ae5e742de3de8f8011c476020908152604080832033845290915290205460ff16611257576040517fcfb3b94200000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b60008381527f2569078dfb4b0305704d3008e7403993ae9601b85f7ae5e742de3de8f8011c466020526040808220805473ffffffffffffffffffffffffffffffffffffffff19166001600160a01b0388811691821790925591518693918516917f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92591a450505050565b60008181527f2569078dfb4b0305704d3008e7403993ae9601b85f7ae5e742de3de8f8011c44602052604081205490600160e01b82169003611392578060000361138d576000805160206124d283398151915254821061135357604051636f96cda160e11b815260040160405180910390fd5b506000190160008181527f2569078dfb4b0305704d3008e7403993ae9601b85f7ae5e742de3de8f8011c4460205260409020548015611353575b919050565b604051636f96cda160e11b815260040160405180910390fd5b610aa8813361189b565b60008281526097602090815260408083206001600160a01b038516845290915290205460ff1661070b5760008281526097602090815260408083206001600160a01b03851684529091529020805460ff191660011790556114133390565b6001600160a01b0316816001600160a01b0316837f2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d60405160405180910390a45050565b60008281526097602090815260408083206001600160a01b038516845290915290205460ff161561070b5760008281526097602090815260408083206001600160a01b0385168085529252808320805460ff1916905551339285917ff6391f5c32d9c69d2a47ea670b442974b53935d1edc7fd64eb21e047a839171b9190a45050565b60c98190556040518181527f21de10c116b96b03fb738f9f0a72c72e8fa1b267592a2ace5a8617f62c73b7779060200160405180910390a150565b61070b828260405180602001604052806000815250611910565b6033546001600160a01b03163314610ba45760405162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e65726044820152606401610a8c565b603380546001600160a01b0383811673ffffffffffffffffffffffffffffffffffffffff19831681179093556040519116919082907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e090600090a35050565b600054610100900460ff166116535760405162461bcd60e51b815260206004820152602b60248201527f496e697469616c697a61626c653a20636f6e7472616374206973206e6f74206960448201526a6e697469616c697a696e6760a81b6064820152608401610a8c565b610ba4611997565b600054610100900460ff16610ba45760405162461bcd60e51b815260206004820152602b60248201527f496e697469616c697a61626c653a20636f6e7472616374206973206e6f74206960448201526a6e697469616c697a696e6760a81b6064820152608401610a8c565b7fee151c8401928dc223602bb187aff91b9a56c7cae5476ef1b3287b085a16c85f54610100900460ff166117625760405162461bcd60e51b815260206004820152603460248201527f455243373231415f5f496e697469616c697a61626c653a20636f6e747261637460448201527f206973206e6f7420696e697469616c697a696e670000000000000000000000006064820152608401610a8c565b61070b8282611a0b565b604051630a85bd0160e11b81526000906001600160a01b0385169063150b7a02906117a1903390899088908890600401612284565b6020604051808303816000875af19250505080156117dc575060408051601f3d908101601f191682019092526117d9918101906122c0565b60015b61183a573d80801561180a576040519150601f19603f3d011682016040523d82523d6000602084013e61180f565b606091505b508051600003611832576040516368d2bf6b60e11b815260040160405180910390fd5b805181602001fd5b6001600160e01b031916630a85bd0160e11b149050949350505050565b606060a06040510180604052602081039150506000815280825b600183039250600a81066030018353600a9004806118715750819003601f19909101908152919050565b60008281526097602090815260408083206001600160a01b038516845290915290205460ff1661070b576118ce81611b15565b6118d9836020611b27565b6040516020016118ea9291906122dd565b60408051601f198184030181529082905262461bcd60e51b8252610a8c91600401611f14565b61191a8383611d08565b6001600160a01b0383163b15610a0d576000805160206124d2833981519152548281035b611951600086838060010194508661176c565b61196e576040516368d2bf6b60e11b815260040160405180910390fd5b81811061193e57816000805160206124d2833981519152541461199057600080fd5b5050505050565b600054610100900460ff16611a025760405162461bcd60e51b815260206004820152602b60248201527f496e697469616c697a61626c653a20636f6e7472616374206973206e6f74206960448201526a6e697469616c697a696e6760a81b6064820152608401610a8c565b610ba433611589565b7fee151c8401928dc223602bb187aff91b9a56c7cae5476ef1b3287b085a16c85f54610100900460ff16611aa75760405162461bcd60e51b815260206004820152603460248201527f455243373231415f5f496e697469616c697a61626c653a20636f6e747261637460448201527f206973206e6f7420696e697469616c697a696e670000000000000000000000006064820152608401610a8c565b7f2569078dfb4b0305704d3008e7403993ae9601b85f7ae5e742de3de8f8011c42611ad283826123a4565b507f2569078dfb4b0305704d3008e7403993ae9601b85f7ae5e742de3de8f8011c43611afe82826123a4565b5060006000805160206124d2833981519152555050565b6060610b056001600160a01b03831660145b60606000611b3683600261247a565b611b41906002612491565b67ffffffffffffffff811115611b5957611b59612004565b6040519080825280601f01601f191660200182016040528015611b83576020820181803683370190505b5090507f300000000000000000000000000000000000000000000000000000000000000081600081518110611bba57611bba6124a4565b60200101906001600160f81b031916908160001a9053507f780000000000000000000000000000000000000000000000000000000000000081600181518110611c0557611c056124a4565b60200101906001600160f81b031916908160001a9053506000611c2984600261247a565b611c34906001612491565b90505b6001811115611cb9577f303132333435363738396162636465660000000000000000000000000000000085600f1660108110611c7557611c756124a4565b1a60f81b828281518110611c8b57611c8b6124a4565b60200101906001600160f81b031916908160001a90535060049490941c93611cb2816124ba565b9050611c37565b5083156110125760405162461bcd60e51b815260206004820181905260248201527f537472696e67733a20686578206c656e67746820696e73756666696369656e746044820152606401610a8c565b6000805160206124d2833981519152546000829003611d53576040517fb562e8dd00000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b6001600160a01b03831660008181527f2569078dfb4b0305704d3008e7403993ae9601b85f7ae5e742de3de8f8011c456020908152604080832080546801000000000000000188020190558483527f2569078dfb4b0305704d3008e7403993ae9601b85f7ae5e742de3de8f8011c4490915281206001851460e11b4260a01b178317905582840190839083907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef8180a4600183015b818114611e4057808360007fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef600080a4600101611e08565b5081600003611e7b576040517f2e07630000000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b6000805160206124d28339815191525550505050565b6001600160e01b031981168114610aa857600080fd5b600060208284031215611eb957600080fd5b813561101281611e91565b60005b83811015611edf578181015183820152602001611ec7565b50506000910152565b60008151808452611f00816020860160208601611ec4565b601f01601f19169290920160200192915050565b6020815260006110126020830184611ee8565b600060208284031215611f3957600080fd5b5035919050565b80356001600160a01b038116811461138d57600080fd5b60008060408385031215611f6a57600080fd5b611f7383611f40565b946020939093013593505050565b600080600060608486031215611f9657600080fd5b611f9f84611f40565b9250611fad60208501611f40565b9150604084013590509250925092565b60008060408385031215611fd057600080fd5b82359150611fe060208401611f40565b90509250929050565b600060208284031215611ffb57600080fd5b61101282611f40565b634e487b7160e01b600052604160045260246000fd5b600067ffffffffffffffff8084111561203557612035612004565b604051601f8501601f19908116603f0116810190828211818310171561205d5761205d612004565b8160405280935085815286868601111561207657600080fd5b858560208301376000602087830101525050509392505050565b600082601f8301126120a157600080fd5b6110128383356020850161201a565b600080600080600060a086880312156120c857600080fd5b853567ffffffffffffffff808211156120e057600080fd5b6120ec89838a01612090565b9650602088013591508082111561210257600080fd5b5061210f88828901612090565b9450506040860135925061212560608701611f40565b915061213360808701611f40565b90509295509295909350565b6000806040838503121561215257600080fd5b61215b83611f40565b91506020830135801515811461217057600080fd5b809150509250929050565b6000806000806080858703121561219157600080fd5b61219a85611f40565b93506121a860208601611f40565b925060408501359150606085013567ffffffffffffffff8111156121cb57600080fd5b8501601f810187136121dc57600080fd5b6121eb8782356020840161201a565b91505092959194509250565b6000806040838503121561220a57600080fd5b61221383611f40565b9150611fe060208401611f40565b600181811c9082168061223557607f821691505b6020821081036105db57634e487b7160e01b600052602260045260246000fd5b60008351612267818460208801611ec4565b83519083019061227b818360208801611ec4565b01949350505050565b60006001600160a01b038087168352808616602084015250836040830152608060608301526122b66080830184611ee8565b9695505050505050565b6000602082840312156122d257600080fd5b815161101281611e91565b7f416363657373436f6e74726f6c3a206163636f756e7420000000000000000000815260008351612315816017850160208801611ec4565b7f206973206d697373696e6720726f6c65200000000000000000000000000000006017918401918201528351612352816028840160208801611ec4565b01602801949350505050565b601f821115610a0d57600081815260208120601f850160051c810160208610156123855750805b601f850160051c820191505b818110156109e057828155600101612391565b815167ffffffffffffffff8111156123be576123be612004565b6123d2816123cc8454612221565b8461235e565b602080601f83116001811461240757600084156123ef5750858301515b600019600386901b1c1916600185901b1785556109e0565b600085815260208120601f198616915b8281101561243657888601518255948401946001909101908401612417565b50858210156124545787850151600019600388901b60f8161c191681555b5050505050600190811b01905550565b634e487b7160e01b600052601160045260246000fd5b8082028115828204841417610b0557610b05612464565b80820180821115610b0557610b05612464565b634e487b7160e01b600052603260045260246000fd5b6000816124c9576124c9612464565b50600019019056fe2569078dfb4b0305704d3008e7403993ae9601b85f7ae5e742de3de8f8011c40a26469706673582212206ec78f72a39301bbdc23d8d52d677443e5fa544595fc4c266a804f4d991b5a8664736f6c63430008110033";

type AvatarConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: AvatarConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class Avatar__factory extends ContractFactory {
  constructor(...args: AvatarConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<Avatar> {
    return super.deploy(overrides || {}) as Promise<Avatar>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): Avatar {
    return super.attach(address) as Avatar;
  }
  override connect(signer: Signer): Avatar__factory {
    return super.connect(signer) as Avatar__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): AvatarInterface {
    return new utils.Interface(_abi) as AvatarInterface;
  }
  static connect(address: string, signerOrProvider: Signer | Provider): Avatar {
    return new Contract(address, _abi, signerOrProvider) as Avatar;
  }
}