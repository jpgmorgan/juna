import { describe, expect, test } from "bun:test";

import { NftfiClient, ArcadeClient, PortfolioClient, Loaner, WETH } from "..";

describe("loaner", () => {
  // setup
  //   const nftfiApiKey = process.env.NFTFI_API_KEY ?? "";
  const nftfiApiKey = process.env.NFTFI_API_KEY ?? "";
  const arcadeApiKey = process.env.ARCADE_API_KEY ?? "";
  const privateKey = (process.env.PRIVATE_KEY ?? "0x") as `0x${string}`;

  const nftfiClient = new NftfiClient({ apiKey: nftfiApiKey, privateKey: privateKey });
  const arcadeClient = new ArcadeClient({ apiKey: arcadeApiKey, privateKey: privateKey });
  const portfolio = new PortfolioClient([nftfiClient, arcadeClient], []);
  const loaner = new Loaner(portfolio);

  test("it can get loans for the portfolio", async () => {
    // when
    const loanTerms = [{ currency: WETH, ltv: 0.1, durationInDays: 10, apr: 0.12 }];
    loaner.updateCollectionOffers("0xb7f7f6c52f2e2fdb1963eab30438024864c313f6", 1, loanTerms); // cryptopunks
    await loaner.publishCollectionOffers(1);

    // then
    // expect(loans).toBeArray();
  });
});
