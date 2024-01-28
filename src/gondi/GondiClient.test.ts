import { GondiClient } from "./GondiClient";
import { CollectionOfferParams } from "../types";
import { WETH } from "../support/currencies";
import { describe, expect, test } from "bun:test";

describe("gondi", () => {
  // setup
  const privateKey = (process.env.PRIVATE_KEY === "" ? "0x" : process.env.PRIVATE_KEY) as `0x${string}`;
  const address1 = process.env.ADDRESS1 as `0x${string}`;

  test("it can get loans for the account", async () => {
    // given
    const client = new GondiClient({});

    // when
    const loans = await client.getLoansForAccount(address1);
    // console.log(loans);

    // then
    expect(loans).toBeArray();
  });

  test("it can create a collection offer", async () => {
    // cancel if no private key
    if (privateKey === "0x") {
      return;
    }

    // given
    const client = new GondiClient({ privateKey: privateKey });
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
  });
});
