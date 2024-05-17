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

  test("getQuotesForPunks", async () => {
    // given
    const reservoir = new ReservoirClient();

    // when
    const quotes = await reservoir.getQuotesForPunks();

    // then
    // console.log(quotes);
    expect(quotes).toMatchObject({ bid: {}, ask: {} });
  });

  test("getQuotes:cryptopunks", async () => {
    // given
    const reservoir = new ReservoirClient();

    // when
    const quotes = await reservoir.getQuotes("0xb7F7F6C52F2e2fdb1963Eab30438024864c313F6");

    // when and then
    const expected = await reservoir.getQuotesForPunks();
    expect(await reservoir.getQuotes("0xb7F7F6C52F2e2fdb1963Eab30438024864c313F6")).toMatchObject(expected);
    expect(await reservoir.getQuotes("0xb47e3cd837dDF8e4c57F05d70Ab865de6e193BBB")).toMatchObject(expected);
    expect(await reservoir.getQuotes("0x000000000000003607fce1aC9e043a86675C5C2F")).toMatchObject(expected);
  });

  test.skip("getActivity", async () => {
    // given
    const reservoir = new ReservoirClient();

    // when
    const quotes = await reservoir.getCollectionActivity("0xb7F7F6C52F2e2fdb1963Eab30438024864c313F6", "", ""); // wrapped-cryptopunks

    // then
    console.log(quotes);
    // expect(quotes).toMatchObject({ bid: {}, ask: {} });
  });
});
