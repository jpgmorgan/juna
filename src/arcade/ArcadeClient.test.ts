import { describe, expect, test } from "bun:test";

import { WETH } from "../support/currencies";
import { ArcadeClient } from "./ArcadeClient";
import { TestConfig } from "../support/config.test";
import { LendingPlatform, CollectionOfferParams, OfferType } from "../types";

describe("arcade", () => {
  test("getLoans", async () => {
    // given
    const client = new ArcadeClient({});

    // when
    const loans = await client.getLoans();

    // then
    expect(loans).toBeArray();
    expect(loans.length).toBeGreaterThan(0);
  }, 20000);

  test("getLoansForAccount:getMultipleLoans", async () => {
    // given
    const client = new ArcadeClient({});

    // when
    const loans = await client.getLoansForAccount(TestConfig.addressArcade);

    // then
    expect(loans).toBeArray();
    expect(loans.length).toBeGreaterThan(0);
  });

  test("getLoansForAccount:getNoLoans", async () => {
    // given
    const client = new ArcadeClient({});

    // when
    const loans = await client.getLoansForAccount("0x0000000000000000000000000000000000000000");

    // then
    expect(loans).toBeArray();
    expect(loans.length).toBe(0);
  });

  test("createCollectionOffer", async () => {
    // given
    const client = new ArcadeClient({ privateKey: TestConfig.privateKey, apiKey: TestConfig.arcadeApiKey });
    const params: CollectionOfferParams = {
      collectionAddress: "0xed5af388653567af2f388e6224dc7c4b3241c544", // azuki
      currency: WETH,
      principal: 0.1,
      apr: 0.5,
      durationInDays: 1,
      expiryInMinutes: 5,
    };

    // when
    const offer = await client.createCollectionOffer(params);

    // then
    expect(offer.platform).toBe(LendingPlatform.arcade);
    expect(offer.lender).toBe(TestConfig.addressFromPrivateKey.toLowerCase() as `0x${string}`);
    expect(offer.type).toBe(OfferType.collectionOffer);
    expect(offer.currency).toBe(params.currency);
    expect(offer.principal).toBe(params.principal);
    expect(offer.durationInDays).toBe(params.durationInDays);
    // expect(offer.apr).toBe(params.apr); TODO make a comparison that handles rounding errors + the APR calc is wrong
    expect(offer.collateral.collectionAddress).toBe(params.collectionAddress);
  });

  test.skip("deleteOffer", async () => {
    // given
    const client = new ArcadeClient({ privateKey: TestConfig.privateKey, apiKey: TestConfig.arcadeApiKey });
    const offer = await client.createCollectionOffer({
      collectionAddress: "0xed5af388653567af2f388e6224dc7c4b3241c544", // azuki
      currency: WETH,
      principal: 0.1,
      apr: 0.5,
      durationInDays: 1,
      expiryInMinutes: 5,
    });
    const offers1 = await client.getMyOffers();
    expect(offers1.some((o) => o.id === offer.id)).toBeTrue();

    // when
    await client.deleteOffer(offer.id);

    // then
    const offers2 = await client.getMyOffers();
    expect(offers2.some((o) => o.id === offer.id)).toBeFalse();
  });

  test("getMyOffers", async () => {
    // given
    const client = new ArcadeClient({ privateKey: TestConfig.privateKey, apiKey: TestConfig.arcadeApiKey });

    // when
    const offer = await client.createCollectionOffer({
      collectionAddress: "0xed5af388653567af2f388e6224dc7c4b3241c544", // azuki
      currency: WETH,
      principal: 0.1,
      apr: 0.5,
      durationInDays: 1,
      expiryInMinutes: 5,
    });
    const offers = await client.getMyOffers();

    // then
    expect(offers.some((o) => o.id === offer.id)).toBeTrue();
  });
});
