import assert from "assert";
import { describe, expect, test } from "bun:test";

import { NftfiClient } from "./NFTfiClient";
import { WETH } from "../support/currencies";
import { TestConfig } from "../support/config.test";
import { LendingPlatform, CollectionOfferParams, OfferType } from "../types";
import { AccountUnderfunded } from "../errors";

describe("nftfi", () => {
  const privateKeyTest = TestConfig.isPrivateKeyProvided ? test.skip : test;

  test("getLoansForAccount:getMultipleLoans", async () => {
    // given
    const client = new NftfiClient({ apiKey: TestConfig.nftfiApiKey });

    // when
    const loans = await client.getLoansForAccount(TestConfig.addressNftfi);

    // then
    expect(loans).toBeArray();
    expect(loans.length).toBeGreaterThan(0);
    // TODO: test type of records within the array
  });

  test("getLoansForAccount:getNoLoans", async () => {
    // given
    const client = new NftfiClient({ apiKey: TestConfig.nftfiApiKey });

    // when
    const loans = await client.getLoansForAccount("0x0000000000000000000000000000000000000000");

    // then
    expect(loans).toBeArray();
    expect(loans.length).toBe(0);
  });

  privateKeyTest("createCollectionOffer", async () => {
    // given
    const client = new NftfiClient({ privateKey: TestConfig.privateKey, apiKey: TestConfig.nftfiApiKey });
    const params: CollectionOfferParams = {
      collectionAddress: "0xed5af388653567af2f388e6224dc7c4b3241c544", // azuki
      currency: WETH,
      principal: 10 / 1e18,
      apr: 0.5,
      durationInDays: 365,
      expiryInMinutes: 0.2,
    };

    // when
    const offer = await client.createCollectionOffer(params);

    // then
    expect(offer.platform).toBe(LendingPlatform.nftfi);
    expect(offer.lender).toBe(TestConfig.addressFromPrivateKey.toLowerCase() as `0x${string}`);
    expect(offer.type).toBe(OfferType.collectionOffer);
    expect(offer.currency).toBe(params.currency);
    expect(offer.principal).toBe(params.principal);
    expect(offer.durationInDays).toBe(params.durationInDays);
    // expect(offer.apr).toBe(params.apr); TODO make a comparison that handles rounding errors
    expect(offer.collateral.collectionAddress).toBe(params.collectionAddress);
  });

  test("createCollectionOffer:AccountUnderfunded", async () => {
    // given
    const client = new NftfiClient({ privateKey: TestConfig.privateKey, apiKey: TestConfig.nftfiApiKey });
    const params: CollectionOfferParams = {
      collectionAddress: "0xed5af388653567af2f388e6224dc7c4b3241c544", // azuki
      currency: WETH,
      principal: 1,
      apr: 0.5,
      durationInDays: 365,
      expiryInMinutes: 0.2,
    };

    // when and then
    try {
      await client.createCollectionOffer(params);
      throw Error("offer went through");
    } catch (error) {
      assert(error instanceof AccountUnderfunded, "thrown error is not an instance of AccountUnderfunded");
    }
  });

  // TODO for some reason the delete call is flaky with a 401
  test.skip("deleteOffer", async () => {
    // given
    const client = new NftfiClient({ privateKey: TestConfig.privateKey, apiKey: TestConfig.nftfiApiKey });
    const offer = await client.createCollectionOffer({
      collectionAddress: "0xed5af388653567af2f388e6224dc7c4b3241c544", // azuki
      currency: WETH,
      principal: 10 / 1e18,
      apr: 0.5,
      durationInDays: 365,
      expiryInMinutes: 0.2,
    });
    const offers1 = await client.getMyOffers();
    expect(offers1.some((o) => o.id === offer.id)).toBeTrue();

    // when
    await client.deleteOffer(offer.id);

    // then
    const offers2 = await client.getMyOffers();
    expect(offers2.some((o) => o.id === offer.id)).toBeFalse();
  });

  privateKeyTest("getMyOffers", async () => {
    // given
    const client = new NftfiClient({ privateKey: TestConfig.privateKey, apiKey: TestConfig.nftfiApiKey });

    // when
    const offer = await client.createCollectionOffer({
      collectionAddress: "0xed5af388653567af2f388e6224dc7c4b3241c544", // azuki
      currency: WETH,
      principal: 10 / 1e18,
      apr: 0.5,
      durationInDays: 365,
      expiryInMinutes: 0.2,
    });
    const offers = await client.getMyOffers();

    // then
    expect(offers.some((o) => o.id === offer.id)).toBeTrue();
  });

  test("getPromissoryNote", async () => {
    // given
    const client = new NftfiClient({ rpcUrl: TestConfig.rpcUrl });

    // when
    const promissory = await client.getPromissoryNote(1);

    // then
    expect(promissory).toEqual({ address: "0xd0a40eB7FD94eE97102BA8e9342243A2b2E22207", id: 1486175015439543728 });
  });
});
