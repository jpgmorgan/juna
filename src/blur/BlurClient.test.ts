import { TestConfig } from "../support/config.test";
import { BETH } from "../support/currencies";
import { BlurClient } from "./BlurClient";
import { describe, expect, test } from "bun:test";

describe("blur", () => {
  // setup
  const client = new BlurClient({ privateKey: TestConfig.privateKey });

  test("createCollectionOffer", async () => {
    // given
    // when
    await client.createCollectionOffer({
      collectionAddress: "0x5Af0D9827E0c53E4799BB226655A1de152A425a5",
      currency: BETH,
      principal: 0.5,
      apr: 0.2,
      durationInDays: 0,
      expiryInMinutes: 15,
      limit: 1,
    });

    // then
    // expect(loans).toBeArray();
    // expect(loans.length).toBeGreaterThan(0);
  }, 10000);

  test("getLoansForAccount:getMultipleLoans", async () => {
    // given
    // when
    const loans = await client.getLoansForAccount(TestConfig.addressBlur);

    // then
    expect(loans).toBeArray();
    expect(loans.length).toBeGreaterThan(0);
  }, 10000);

  test("getLoansForAccount:getMultipleLoans", async () => {
    // given
    // when
    const loans = await client.getLoansForAccount(TestConfig.addressBlur);

    // then
    expect(loans).toBeArray();
    expect(loans.length).toBeGreaterThan(0);
  }, 10000);

  // TODO: to fix
  test.skip("getLoansForAccount:getNoLoan", async () => {
    // given
    // when
    const loans = await client.getLoansForAccount("0x0000000000000000000000000000000000000000");

    // then
    expect(loans).toBeArray();
    expect(loans.length).toBe(0);
  }, 10000);
});
