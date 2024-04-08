import { describe, expect, test } from "bun:test";

import { NftfiClient, ArcadeClient, GondiClient, BlurClient, PortfolioClient } from "..";
import { TestConfig } from "./config.test";

describe("portfolio client", () => {
  // setup
  const nftfiClient = new NftfiClient({ apiKey: TestConfig.nftfiApiKey });
  const arcadeClient = new ArcadeClient({ apiKey: TestConfig.arcadeApiKey });
  const gondiClient = new GondiClient({});
  const portfolio = new PortfolioClient(
    [nftfiClient, arcadeClient, gondiClient],
    [TestConfig.addressArcade, TestConfig.addressGondi, TestConfig.addressBlur],
  );

  test("getMyLoans", async () => {
    // when
    const loans = await portfolio.getMyLoans();

    // then
    expect(loans).toBeArray();
    expect(loans.length).toBeGreaterThan(0);
  }, 10000);
});
