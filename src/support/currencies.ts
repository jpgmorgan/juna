import { Currencies, Currency } from "../types";

export const WETH: Currency = {
  address: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
  symbol: "WETH",
  decimals: 18,
};

export const DAI: Currency = {
  address: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
  symbol: "DAI",
  decimals: 18,
};

export const USDC: Currency = {
  address: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
  symbol: "USDC",
  decimals: 6,
};

export const BETH: Currency = {
  address: "0x0000000000A39bb272e79075ade125fd351887Ac",
  symbol: "BETH",
  decimals: 18,
};

export const UNKNOWN: Currency = {
  address: "0x",
  symbol: "???",
  decimals: 18,
};

const currencies: Currencies = {
  "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2": WETH,
  "0x6b175474e89094c44da98b954eedeac495271d0f": DAI,
  "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48": USDC,
};

export const currencyFromAddress = (address: `0x${string}`) =>
  currencies[address.toLowerCase() as `0x${string}`] ?? UNKNOWN;

import { mainnet } from "viem/chains";
import { createPublicClient, http, parseAbi } from "viem";

export const getErc20Balance = async (
  rpcUrl: `https://${string}`,
  currency: Currency,
  walletAddress: `0x${string}`,
) => {
  const client = createPublicClient({
    chain: mainnet,
    transport: http(rpcUrl),
  });

  const balance = await client.readContract({
    address: currency.address,
    abi: parseAbi(["function balanceOf(address _address) public view returns (uint64)"]),
    functionName: "balanceOf",
    args: [walletAddress],
  });

  return Number(balance) / 10 ** currency.decimals;
};
