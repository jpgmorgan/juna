import { describe, expect, test } from "bun:test";

import { NftfiClient, ArcadeClient, PortfolioClient } from "..";
import { BlurClient } from "..";

describe("portfolio client", () => {
  // setup
  const nftfiApiKey = process.env.NFTFI_API_KEY ?? "";
  const arcadeApiKey = process.env.ARCADE_API_KEY ?? "";
  const address1 = process.env.ADDRESS1 as `0x${string}`;
  const address2 = process.env.ADDRESS2 as `0x${string}`;

  const nftfiClient = new NftfiClient({ apiKey: nftfiApiKey });
  const arcadeClient = new ArcadeClient({ apiKey: arcadeApiKey });
  const blurClient = new BlurClient({});
  const portfolio = new PortfolioClient([nftfiClient, arcadeClient, blurClient], [address1, address2]);

  test("it can get loans for the portfolio", async () => {
    // when
    const loans = await portfolio.getMyLoans();
    console.log(loans);

    // then
    expect(loans).toBeArray();
  });
});
