import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import { Page, Browser } from "puppeteer";
import { PrivateKeyAccount } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { BlurLoan, BlurOffer } from "./support/types";
import { LendingPlatform, Offer, OfferType } from "../types";
import { BETH } from "../support/currencies";

puppeteer.use(StealthPlugin());

export class GhostApi {
  private account: PrivateKeyAccount;
  private browser: Browser | null;
  private page: Page | null;
  private initialised: boolean;

  constructor(privateKey: `0x${string}`) {
    this.account = privateKeyToAccount(privateKey);
    this.browser = null;
    this.page = null;
    this.initialised = false;
  }

  public async initialise() {
    if (this.initialised) {
      return;
    }
    this.browser = await puppeteer.launch({
      headless: "new",
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-accelerated-2d-canvas",
        "--no-first-run",
        "--no-zygote",
        "--disable-gpu",
      ],
    });
    this.page = await this.browser.newPage();
    await this.page.goto("https://blur.io/");
    const challenge: any = await this.challenge();
    const signedMessage = await this.account.signMessage({ message: challenge.message });
    const authToken: any = await this.login(challenge, signedMessage);
    this.createCookie(authToken);
    this.initialised = true;
  }

  private getPage(): Page {
    return this.page as Page;
  }

  private async challenge() {
    return await this.getPage().evaluate(
      async (options) => {
        const response = await fetch("https://core-api.prod.blur.io/auth/challenge", options);
        return response.json();
      },
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ walletAddress: this.account.address }),
        credentials: "include",
      } as RequestInit,
    );
  }

  private async login(challenge: {}, signedMessage: `0x${string}`) {
    return await this.getPage().evaluate(
      async (options) => {
        const response = await fetch("https://core-api.prod.blur.io/auth/login", options);
        return response.json();
      },
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...challenge, signature: signedMessage }),
        credentials: "include",
      } as RequestInit,
    );
  }

  private async createCookie(authToken: { accessToken: string }) {
    await this.getPage().evaluate(
      async (options) => {
        const response = await fetch("https://core-api.prod.blur.io/auth/cookie", options);
        return response.json();
      },
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ authToken: authToken.accessToken }),
        credentials: "include",
      } as RequestInit,
    );
  }

  public async getLiens(address: `0x${string}`): Promise<BlurLoan[]> {
    await this.initialise();
    const options = {
      method: "GET",
      credentials: "include",
    } as RequestInit;
    const liens: any = await this.getPage().evaluate(
      async (options, address) => {
        const response = await fetch(
          `https://core-api.prod.blur.io/v1/portfolio/${address.toLowerCase()}/liens`,
          options,
        );
        return response.json();
      },
      options,
      address,
    );

    return liens.liens;
  }

  public async getLoanOffers(accountAddress: `0x${string}`, collectionAddress?: `0x${string}`): Promise<BlurOffer[]> {
    await this.initialise();
    const options = {
      method: "GET",
      credentials: "include",
    } as RequestInit;
    const loans: any = await this.getPage().evaluate(
      async (options, accountAddress, collectionAddress) => {
        const response = await fetch(
          `https://core-api.prod.blur.io/v1/portfolio/${accountAddress.toLowerCase()}/loan-offers?contractAddress=${collectionAddress}`,
          options,
        );
        return response.json();
      },
      options,
      accountAddress,
      collectionAddress,
    );

    return loans.loanOffers;
  }

  public async postLoanOffer(
    collectionAddress: `0x${string}`,
    principal: number,
    limit: number,
    apr: number,
    expiryInMinutes: number,
  ): Promise<Offer> {
    await this.initialise();

    // Format the query
    const options = {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contractAddress: collectionAddress.toLowerCase(),
        orders: [
          {
            contractAddress: collectionAddress.toLowerCase(),
            expirationTime: new Date(new Date().getTime() + expiryInMinutes * 60 * 1000).toISOString(),
            maxAmount: principal.toString(),
            rate: apr * 10000,
            totalAmount: limit.toString(),
          },
        ],
        userAddress: this.account.address.toLowerCase(),
      }),
    } as RequestInit;
    const format: any = await this.getPage().evaluate(async (options) => {
      const response = await fetch("https://core-api.prod.blur.io/v1/blend/loan-offer/format", options);
      return response.json();
    }, options);
    if (format.statusCode && format.statusCode !== 200) {
      throw Error(format.message);
    }

    // Signing
    const signData = format.signatures[0].signData;
    signData.value.minAmount = BigInt(signData.value.minAmount.hex);
    signData.value.maxAmount = BigInt(signData.value.maxAmount.hex);
    signData.value.totalAmount = BigInt(signData.value.totalAmount.hex);
    signData.value.salt = BigInt(signData.value.salt.hex);
    signData.value.auctionDuration = BigInt(signData.value.auctionDuration.hex);
    signData.value.expirationTime = BigInt(signData.value.expirationTime.hex);

    const signature = await this.account.signTypedData({
      domain: signData.domain,
      types: signData.types,
      primaryType: "LoanOffer",
      message: signData.value,
    });

    // Submit the offer
    const options2 = {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contractAddress: collectionAddress.toLowerCase(),
        orders: [
          {
            contractAddress: collectionAddress.toLowerCase(),
            expirationTime: new Date(new Date().getTime() + expiryInMinutes * 60 * 1000).toISOString(),
            maxAmount: principal.toString(),
            rate: apr * 10000,
            totalAmount: limit.toString(),
            signature: signature,
            marketplaceData: format.signatures[0].marketplaceData,
          },
        ],
        userAddress: this.account.address.toLowerCase(),
      }),
    } as RequestInit;
    const response: any = await this.getPage().evaluate(async (options2) => {
      const response = await fetch("https://core-api.prod.blur.io/v1/blend/loan-offer/submit", options2);
      return response.json();
    }, options2);

    return {
      id: response.hashes[0],
      platform: LendingPlatform.blur,
      lender: this.account.address,
      offerDate: new Date(),
      expiryDate: new Date(new Date().getTime() + expiryInMinutes * 60 * 1000),
      type: OfferType.collectionOffer,
      currency: BETH,
      principal: principal,
      durationInDays: 0,
      apr: apr,
      collateral: {
        collectionAddress: collectionAddress,
        collectionName: "",
        nftId: "",
      },
    };
  }
}
