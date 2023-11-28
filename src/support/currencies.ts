import { Currencies, Currency } from "../types";

export const WETH: Currency = {
  address: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
  symbol: "WETH",
  decimals: 18,
};

export const DAI: Currency = {
  address: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
  symbol: "WETH",
  decimals: 18,
};

export const USDC: Currency = {
  address: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
  symbol: "USDC",
  decimals: 6,
};

const currencies: Currencies = {
  "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2": WETH,
  "0x6b175474e89094c44da98b954eedeac495271d0f": DAI,
  "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48": USDC,
};

export const currencyFromAddress = (address: `0x${string}`) => currencies[address.toLowerCase() as `0x${string}`];
