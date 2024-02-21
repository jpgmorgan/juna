import { privateKeyToAccount } from "viem/accounts";

export class TestConfig {
  // Test wallets
  static isPrivateKeyProvided: boolean = process.env.PRIVATE_KEY ? false : true;
  static privateKey: `0x${string}` = (process.env.PRIVATE_KEY ??
    "0xeceda45a67a37d5eb80e6e1cd88c5ef0d785fa3e44386656fa50b234f5b27217") as `0x${string}`;
  static addressFromPrivateKey: `0x${string}` = privateKeyToAccount(this.privateKey).address;

  // API keys
  static nftfiApiKey = process.env.NFTFI_API_KEY ?? "";
  static arcadeApiKey = process.env.ARCADE_API_KEY ?? "";

  // Addresses from lenders from which to be inspired
  static addressNftfi: `0x${string}` = "0xc0D5B6F1B40B458746bC5f0fea76C20670C1DE21";
  static addressArcade: `0x${string}` = "0x";
  static addressGondi: `0x${string}` = "0x";
  static addressBlur: `0x${string}` = "0x";

  // RPC url
  static rpcUrl: `https://${string}` = "https://eth.llamarpc.com";
}
