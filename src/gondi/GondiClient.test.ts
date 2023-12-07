import { GondiClient } from "./GondiClient";
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
    console.log(loans);

    // then
    expect(loans).toBeArray();
  });
});
