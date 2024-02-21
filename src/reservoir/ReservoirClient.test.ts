import { describe, expect, test } from "bun:test";

import { ReservoirClient } from "..";

describe("reservoir", () => {
  test("getQuotes", async () => {
    // given
    const reservoir = new ReservoirClient();

    // when
    const quotes = await reservoir.getQuotes("0xb7F7F6C52F2e2fdb1963Eab30438024864c313F6"); // wrapped-cryptopunks

    // then
    expect(quotes).toMatchObject({ bid: {}, ask: {} });
  });
});
