import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import { Page, Browser } from "puppeteer";
import { PrivateKeyAccount } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { BlurLoan } from "./support/types";

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
    this.browser = await puppeteer.launch({ headless: "new" });
    this.page = await this.browser.newPage();
    await this.page.goto("https://blur.io/");
    const challenge = await this.challenge();
    const signedMessage = await this.account.signMessage({ message: challenge.message });
    const authToken = await this.login(challenge, signedMessage);
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
    const liens = await this.getPage().evaluate(
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
}
