import { describe, expect, test } from "bun:test";

import { NftfiClient, ArcadeClient, PortfolioClient } from "..";
import { BlurClient } from "..";
import { TestConfig } from "./config.test";

describe("portfolio client", () => {
  // setup
  const nftfiClient = new NftfiClient({ apiKey: TestConfig.nftfiApiKey });
  const arcadeClient = new ArcadeClient({ apiKey: TestConfig.arcadeApiKey });
  const blurClient = new BlurClient({});
  const portfolio = new PortfolioClient(
    [nftfiClient, arcadeClient],
    [TestConfig.addressArcade, TestConfig.addressGondi, TestConfig.addressBlur],
  );

  test("getMyLoans", async () => {
    // when
    const loans = await portfolio.getMyLoans();
    console.log(loans);

    // then
    expect(loans).toBeArray();
    expect(loans).toBeGreaterThan(0);
  });
});
