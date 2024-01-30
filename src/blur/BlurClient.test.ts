import { BlurClient } from "./BlurClient";
import { describe, expect, test } from "bun:test";

describe("blur", () => {
  // setup
  const privateKey = (process.env.PRIVATE_KEY === "" ? "0x" : process.env.PRIVATE_KEY) as `0x${string}`;
  const address1 = process.env.ADDRESS1 as `0x${string}`;
  const client = new BlurClient({ privateKey: privateKey });

  test("it can get loans for the account", async () => {
    // given

    // when
    const loans = await client.getLoansForAccount(address1.toLowerCase() as `0x${string}`);
    console.log(loans);

    // then
    expect(loans).toBeArray();
  });
});
