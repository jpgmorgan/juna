import { privateKeyToAccount } from "viem/accounts";

export class TestConfig {
  // Test wallet to post offers
  static privateKey: `0x${string}` = (process.env.PRIVATE_KEY ??
    "0x0645f190c404e31c191137a16a3a9e5703d0dc9f332370fd23a662a88647b4a6") as `0x${string}`;
  static addressFromPrivateKey: `0x${string}` = privateKeyToAccount(this.privateKey).address;

  // API keys
  static nftfiApiKey = process.env.NFTFI_API_KEY ?? "";
  static arcadeApiKey = process.env.ARCADE_API_KEY ?? "";

  // Addresses from lender from which to be inspired
  static addressNftfi: `0x${string}` = (process.env.ADDRESS1 ??
    "0xD79b937791724e47F193f67162B92cDFbF7ABDFd") as `0x${string}`;
  static addressFromLender2: `0x${string}` = (process.env.ADDRESS2 ?? "0x") as `0x${string}`;

  // RPC url
  static rpcUrl = process.env.RPC_URL === "" ? "https://" : (process.env.RPC_URL as `https://${string}`);
}
