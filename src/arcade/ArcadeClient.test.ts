import { privateKeyToAccount } from "viem/accounts";
import { describe, expect, test } from "bun:test";

import { LendingPlatform, CollectionOfferParams, OfferType } from "../types";
import { ArcadeClient } from "./ArcadeClient";
import { WETH } from "../support/currencies";

describe("arcade", () => {
  // setup
  const privateKey = (process.env.PRIVATE_KEY === "" ? "0x" : process.env.PRIVATE_KEY) as `0x${string}`;
  const apiKey = process.env.ARCADE_API_KEY ?? "";
  const address1 = process.env.ADDRESS1 as `0x${string}`;

  test("it can get loans for the account", async () => {
    // given
    const client = new ArcadeClient({});

    // when
    const loans = await client.getLoansForAccount(address1);

    // then
    expect(loans).toBeArray();
  });

  test("it can create a collection offer", async () => {
    // cancel if no private key
    if (privateKey === "0x") {
      return;
    }

    // given
    const client = new ArcadeClient({ privateKey: privateKey, apiKey: apiKey });
    const account = privateKeyToAccount(privateKey);
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
    expect(offer.lender).toBe(account.address.toLowerCase() as `0x${string}`);
    expect(offer.type).toBe(OfferType.collectionOffer);
    expect(offer.currency).toBe(params.currency);
    expect(offer.principal).toBe(params.principal);
    expect(offer.durationInDays).toBe(params.durationInDays);
    // expect(offer.apr).toBe(params.apr); TODO make a comparison that handles rounding errors + the APR calc is wrong
    expect(offer.collateral.collectionAddress).toBe(params.collectionAddress);
  });

  // TODO for some reason the offer gets deleted but takes several seconds until cache invalidation on getOffers
  test.skip("it can delete an offer", async () => {
    // given
    const client = new ArcadeClient({ privateKey: privateKey, apiKey: apiKey });
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

  test("it can get all active offers", async () => {
    // cancel if no private key
    if (privateKey === "0x") {
      return;
    }

    // given
    const client = new ArcadeClient({ privateKey: privateKey, apiKey: apiKey });
    await Bun.sleep(6000); // TODO remove when better nonce management that removes the lag

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
