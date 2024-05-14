import assert from "assert";
import { describe, expect, test } from "bun:test";

import { GondiClient } from "./GondiClient";
import { WETH } from "../support/currencies";
import { CollectionOfferParams } from "../types";
import { CollectionNotSupported } from "../errors";
import { TestConfig } from "../support/config.test";

describe("gondi", () => {
  test("getLoans", async () => {
    // given
    const client = new GondiClient({});

    // when
    const loans = await client.getLoans();

    // then
    // console.log(loans);
    // console.log(loans.length);
    expect(loans).toBeArray();
    expect(loans.length).toBeGreaterThanOrEqual(985);
    // // TODO: test type of records within the array
  }, 50000);

  test("getLoansForAccount:getMultipleLoans", async () => {
    // given
    const client = new GondiClient({});

    // when
    const loans = await client.getLoansForAccount(TestConfig.addressGondi);

    // then
    expect(loans).toBeArray();
    expect(loans.length).toBeGreaterThanOrEqual(5);
    // TODO: test type of records within the array
  });

  test("getLoansForAccount:getNoLoans", async () => {
    // given
    const client = new GondiClient({});

    // when
    const loans = await client.getLoansForAccount("0x0000000000000000000000000000000000000000");

    // then
    expect(loans).toBeArray();
    expect(loans.length).toBe(0);
  });

  test("createCollectionOffer", async () => {
    // given
    const client = new GondiClient({ privateKey: TestConfig.privateKey });
    const params: CollectionOfferParams = {
      collectionAddress: "0xed5af388653567af2f388e6224dc7c4b3241c544", // azuki
      currency: WETH,
      principal: 0.1,
      apr: 0.5,
      durationInDays: 1,
      expiryInMinutes: 5,
    };

    // when
    await client.createCollectionOffer(params);
    // TODO: try to delete offer after
  });

  test.skip("createCollectionOffer:onTestnet", async () => {
    // given
    const client = new GondiClient({ privateKey: TestConfig.privateKey, testnet: true });
    const params: CollectionOfferParams = {
      collectionAddress: "0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D", // azuki
      currency: WETH,
      principal: 0.1,
      apr: 0.5,
      durationInDays: 1,
      expiryInMinutes: 5,
    };

    // when
    await client.createCollectionOffer(params);
    // TODO: try to delete offer after
  });

  test("createCollectionOffer:CollectionNotSupported", async () => {
    // given
    const client = new GondiClient({ privateKey: TestConfig.privateKey });
    const params: CollectionOfferParams = {
      collectionAddress: "0x60E4d786628Fea6478F785A6d7e704777c86a7c6", // mayc
      currency: WETH,
      principal: 0.1,
      apr: 0.5,
      durationInDays: 1,
      expiryInMinutes: 5,
    };

    // when and then
    try {
      await client.createCollectionOffer(params);
      throw Error("offer went through");
    } catch (error) {
      assert(error instanceof CollectionNotSupported, "Thrown error is not an instance of CollectionNotSupported");
    }
  });
});
