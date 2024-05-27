import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import { Page, Browser } from "puppeteer";
import { PrivateKeyAccount, createWalletClient, WalletClient, http } from "viem";
import { mainnet } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";
import { BlurLoan, BlurOffer } from "./support/types";
import { LendingPlatform, Offer, OfferType } from "../types";
import { BETH } from "../support/currencies";
import { config } from "../config";

puppeteer.use(StealthPlugin());

export class GhostApi {
  private client: WalletClient;
  private account: PrivateKeyAccount;
  private browser: Browser | null;
  private page: Page | null;
  private initialised: boolean;

  constructor(privateKey: `0x${string}`, rpcUrl: `https://${string}` = config.defaultRpc) {
    this.account = privateKeyToAccount(privateKey);
    this.client = createWalletClient({
      account: this.account,
      chain: mainnet,
      transport: http(rpcUrl),
    });
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
    await this.page.goto(config.blur.baseUrlHome);
    const challenge: any = await this.challenge();
    const signedMessage = await this.account.signMessage({ message: challenge.message });
    const authToken: any = await this.login(challenge, signedMessage);
    this.createCookie(authToken);
    this.initialised = true;
  }

  private getPage(): Page {
    return this.page as Page;
  }

  private async get(url: string): Promise<any> {
    return await this.getPage().evaluate(
      async (url, options) => {
        const response = await fetch(url, options);
        return response.json();
      },
      url,
      {
        method: "GET",
        credentials: "include",
      } as RequestInit,
    );
  }

  private async post(url: string, payload: {}): Promise<any> {
    const response = (await this.getPage().evaluate(
      async (url, options) => {
        const response = await fetch(url, options);
        return response.json();
      },
      url,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include",
      } as RequestInit,
    )) as any;

    if (response.statusCode && response.statusCode !== 200) {
      throw Error(response.message);
    }

    return response;
  }

  private async challenge() {
    return await this.post(`${config.blur.baseUrlAuth}/challenge`, { walletAddress: this.account.address });
  }

  private async login(challenge: {}, signedMessage: `0x${string}`) {
    return await this.post(`${config.blur.baseUrlAuth}/login`, { ...challenge, signature: signedMessage });
  }

  private async createCookie(authToken: { accessToken: string }) {
    return await this.post(`${config.blur.baseUrlAuth}/cookie`, { authToken: authToken.accessToken });
  }

  public async getLiens(address: `0x${string}`): Promise<BlurLoan[]> {
    await this.initialise();
    const liens = await this.get(`${config.blur.baseUrlPortfolio}/${address.toLowerCase()}/liens`);

    return liens.liens;
  }

  public async getLoanOffers(accountAddress: `0x${string}`, collectionAddress?: `0x${string}`): Promise<BlurOffer[]> {
    await this.initialise();
    const loans = await this.get(
      `${config.blur.baseUrlPortfolio}/${accountAddress.toLowerCase()}/loan-offers?contractAddress=${collectionAddress}`,
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
    const format = await this.post(`${config.blur.baseUrlBlend}/loan-offer/format`, {
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
    });

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
    const response = await this.post(`${config.blur.baseUrlBlend}/loan-offer/submit`, {
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
    });

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

  public async recallLoan(collectionAddress: `0x${string}`, loanId: string, nftId: string) {
    await this.initialise();

    // Fetching the tx data
    const payload = {
      userAddress: this.account.address.toLowerCase(),
      contractAddress: collectionAddress.toLowerCase(),
      lienRequests: [
        {
          lienId: loanId,
          tokenId: nftId,
        },
      ],
    };
    const format = await this.post(`${config.blur.baseUrlBlend}/loan-offer/end`, payload);

    // Sending the transaction
    console.log(format.data);
    console.log(format.data.cancelreasons);
    const tx = format.data.actions[0].txnData;
    tx.account = this.account.address;
    await this.client.sendTransaction(tx);
  }
}
