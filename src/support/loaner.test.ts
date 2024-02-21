import { describe, test } from "bun:test";

import { NftfiClient, ArcadeClient, PortfolioClient, Loaner, WETH, USDC } from "..";
import { TestConfig } from "./config.test";

describe("loaner", () => {
  // setup
  const nftfiClient = new NftfiClient({ apiKey: TestConfig.nftfiApiKey, privateKey: TestConfig.privateKey });
  const arcadeClient = new ArcadeClient({ apiKey: TestConfig.arcadeApiKey, privateKey: TestConfig.privateKey });
  const portfolio = new PortfolioClient([nftfiClient, arcadeClient], []);
  const loaner = new Loaner(portfolio);

  test("updateCollectionOffers", async () => {
    // when
    const loanTerms = [
      { currency: WETH, principal: 0.1, durationInDays: 10, apr: 0.12 },
      { currency: WETH, principal: 0.5, durationInDays: 10, apr: 0.12 },
      { currency: USDC, principal: 0.1, durationInDays: 10, apr: 0.12 },
    ];
    loaner.updateCollectionOffers("0xb7f7f6c52f2e2fdb1963eab30438024864c313f6", loanTerms); // cryptopunks
    await loaner.publishCollectionOffers(1, false);

    // then
  }, 10000);
});
