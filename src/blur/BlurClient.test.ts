import { TestConfig } from "../support/config.test";
import { BlurClient } from "./BlurClient";
import { describe, expect, test } from "bun:test";

describe("blur", () => {
  // setup
  const client = new BlurClient({});

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
