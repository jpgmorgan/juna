import { DeepNftValueClient } from "..";
import { describe, expect, test } from "bun:test";

describe("deepnftvalue", () => {
  // setup
  const client = new DeepNftValueClient();

  test("getValuation:cryptopunks", async () => {
    // given
    // when
    const price = await client.getValuation("0xb47e3cd837dDF8e4c57F05d70Ab865de6e193BBB", 0);
    // console.log(price);

    // then
    expect(price).toBeNumber();
  });

  test("getValuation:wrapped-cryptopunks", async () => {
    // given
    // when
    const price = await client.getValuation("0xb7F7F6C52F2e2fdb1963Eab30438024864c313F6", 0);
    // console.log(price);

    // then
    expect(price).toBeNumber();
  });
});
