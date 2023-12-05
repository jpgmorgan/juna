import { describe, expect, test } from "bun:test";
import { WETH, getErc20Balance } from "./currencies";

describe("currencies", () => {
  // setup
  const rpcUrl = process.env.RPC_URL as `https://${string}`;
  const address1 = process.env.ADDRESS1 as `0x${string}`;

  test("it can get the erc20 balance of an account", async () => {
    // when
    const balance = await getErc20Balance(rpcUrl, WETH, address1);

    // then
    expect(balance).toBeNumber();
  });
});
