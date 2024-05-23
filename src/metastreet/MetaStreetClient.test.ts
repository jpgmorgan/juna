import { describe, expect, test } from "bun:test";
import { MetaStreetClient } from "./MetaStreetClient";

describe("arcade", () => {
  test("getLoans", async () => {
    // given
    const client = new MetaStreetClient();

    // when
    const loans = await client.getLoans();

    // then
    console.log(loans);
  });
});
