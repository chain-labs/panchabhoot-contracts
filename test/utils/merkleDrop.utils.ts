import { BytesLike } from "ethers";
import { MerkleTree } from "merkletreejs";
import { keccak256 } from "ethers/lib/utils";
import { Address } from "hardhat-deploy/dist/types";
import axios from "axios";

export class MerkleTreeManagement {
  merkleTree: MerkleTree | undefined;
  merkleRoot: BytesLike | undefined;
  addresses: Array<Address>;
  cid: string;
  connected: boolean;
  private ipfsJwt: string;

  constructor(
    addresses: Array<Address> = [],
    cid: string = "",
    ipfsJwt: string,
    notCI: boolean
  ) {
    // check if IPFS client api is not null
    if (notCI) {
      if (ipfsJwt === "") {
        throw Error(
          "ipfsJwt is undefined. Cannot initialise without ipfsJwt Key"
        );
      }
      console.log("Connected to internet");
      this.connected = true;
      // setup IPFS client
      this.ipfsJwt = ipfsJwt;
    } else {
      this.connected = false;
      this.ipfsJwt = "";
    }
    this.addresses = addresses;
    this.cid = cid;
  }

  async setup() {
    if (this.addresses.length !== 0) {
      console.log("Setting up Merkle Tree with array of addresses");
      await this.#setupWithAddresses(this.addresses);
    } else if (this.cid === "") {
      throw Error(
        "Provide proper setup arguments. CID cannot be null or array of addresses cannot be empty"
      );
    } else {
      console.log("Setting up Merkle Tree with addresses stored at CID");
      await this.#setupWithCID(this.cid);
    }
  }

  async addToAllowlist(addresses: Array<Address>) {
    // filter unique addresses
    const uniqueAddresses = addresses.filter(
      (address) => this.addresses.indexOf(address) === -1
    );
    const newWhitelistAddress = [...this.addresses, ...uniqueAddresses];
    await this.#setupWithAddresses(newWhitelistAddress);
  }

  async removeFromAllowlist(addresses: Array<Address>) {
    const filteredAddresses = this.addresses.filter(
      (address) => addresses.indexOf(address) === -1
    );
    await this.#setupWithAddresses(filteredAddresses);
  }

  #setupWithAddresses = async (addresses: Array<Address>) => {
    const leafs = addresses.map((entry) => keccak256(entry));
    const tree = new MerkleTree(leafs, keccak256, { sortPairs: true });
    let cid;
    if (this.connected) {
      console.log("Uploading JSON with addresses to IPFS");
      try {
        cid = await this.#pinData(addresses);
      } catch (e) {
        console.error(e);
        throw Error("Upload failed.");
      }
      console.log(`Upload success! Addresses stored at ipfs://${cid}`);
    }
    console.log(`use MerkleTreeManagement.cid to access the IPFS CID`);
    // store state
    this.merkleTree = tree;
    this.merkleRoot = getRootFromTree(tree);
    this.addresses = addresses;
    this.cid = cid;
  };

  getRoot = (): BytesLike => {
    if (this.merkleRoot === undefined) {
      throw Error("Setup of MerkleTreeManagement pending!");
    }
    return this.merkleRoot;
  };

  getCid = (): string => {
    return this.cid;
  };

  getProof = (address: Address): Array<string> => {
    const leaf = keccak256(address);
    if (this.merkleTree === undefined) {
      throw Error("Setup of MerkleTreeManagement pending!");
    }
    return this.merkleTree.getHexProof(leaf);
  };

  getMerkleTree = (): MerkleTree => {
    if (this.merkleTree === undefined) {
      throw Error("Setup of MerkleTreeManagement pending!");
    }
    return this.merkleTree;
  };

  #setupWithCID = async (cid: string) => {
    if (!this.connected) {
      throw Error("Not Connected IPFS");
    }
    // get array of addresses
    let addresses: Array<Address>;
    try {
      addresses = await this.getData(cid);
    } catch (e) {
      console.error(e);
      throw Error("Couldn't fetch data from CID");
    }
    const leafs = addresses.map((entry) => keccak256(entry));
    const tree = new MerkleTree(leafs, keccak256, { sortPairs: true });
    // store state
    this.merkleTree = tree;
    this.merkleRoot = getRootFromTree(tree);
    this.addresses = addresses;
    this.cid = cid;
  };

  async getData(cid: string): Promise<Array<Address>> {
    if (!this.connected) {
      throw Error("Not Connected IPFS");
    }
    const res = await axios.get(`https://gateway.pinata.cloud/ipfs/${cid}`);
    return res.data;
  }

  async #pinData(addresses: Array<Address>) {
    if (!this.connected) {
      throw Error("Not Connected IPFS");
    }
    const data = JSON.stringify({
      pinataContent: addresses,
    });

    const config = {
      method: "post",
      url: "https://api.pinata.cloud/pinning/pinJSONToIPFS",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.ipfsJwt}`,
      },
      data,
    };

    const res = await axios.post(config.url, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.ipfsJwt}`,
      },
    });
    return res.data.IpfsHash;
  }
}

// helper functions
const getRootFromTree = (tree: MerkleTree) =>
  "0x" + tree.getRoot().toString("hex");
