import { privateKeyToAccount } from "viem/accounts";

export class TestConfig {
  // Test wallets
  static isPrivateKeyProvided: boolean = process.env.PRIVATE_KEY ? false : true;
  static privateKey: `0x${string}` = (process.env.PRIVATE_KEY ??
    "0xeceda45a67a37d5eb80e6e1cd88c5ef0d785fa3e44386656fa50b234f5b27217") as `0x${string}`;
  static addressFromPrivateKey: `0x${string}` = privateKeyToAccount(this.privateKey).address;

  // API keys
  static nftfiApiKey: string = process.env.NFTFI_API_KEY ?? "";
  static arcadeApiKey: string = this.isPrivateKeyProvided
    ? "4GmEpqEl9On8BREgrbHvP6sx9IteMxX7T1Y1JpMfXXLi2QADe"
    : process.env.ARCADE_API_KEY ?? ""; // arcade api key is tied to an address

  // Addresses from lenders from which to be inspired
  static addressNftfi: `0x${string}` = "0xc0D5B6F1B40B458746bC5f0fea76C20670C1DE21";
  static addressArcade: `0x${string}` = "0xF4Fb9FA23edB32215E5284cf7dBfDB5607d51a5b";
  static addressGondi: `0x${string}` = "0x39C60bAe189D4EBacB6616bB20D8c3a0abd7ea85";
  static addressBlur: `0x${string}` = "0xa69833B9fDa816f1bFC79517E7932E64708Df0dd";

  // RPC url
  static rpcUrl: `https://${string}` = "https://eth.llamarpc.com";
}
