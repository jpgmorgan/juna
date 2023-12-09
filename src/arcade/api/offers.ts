import { encodeAbiParameters, pad, PrivateKeyAccount } from "viem";
import { AxiosInstance } from "axios";

import { ArcadeOffer, ArcadeOfferParams, ItemsPayload } from "../support/types";

// @ts-ignore
BigInt.prototype["toJSON"] = function () {
  return this.toString();
};

const typedLoanTermsItemsData = {
  LoanTermsWithItems: [
    { name: "proratedInterestRate", type: "uint256" },
    { name: "principal", type: "uint256" },
    { name: "collateralAddress", type: "address" },
    { name: "durationSecs", type: "uint96" },
    { name: "items", type: "Predicate[]" },
    { name: "payableCurrency", type: "address" },
    { name: "deadline", type: "uint96" },
    { name: "affiliateCode", type: "bytes32" },
    { name: "nonce", type: "uint160" },
    { name: "side", type: "uint8" },
  ],
  Predicate: [
    { name: "data", type: "bytes" },
    { name: "verifier", type: "address" },
  ],
};

export default class Offers {
  private account: PrivateKeyAccount;
  private http: AxiosInstance;

  private ARCADE_ITEMS_VERIFIER = "0x1B6e58AaE43bFd2a435AA348F3328f3137DDA544";
  private ARCADE_ORIGINATION_CONTROLLER = "0xB7BFcca7D7ff0f371867B770856FAc184B185878";
  private readonly domain = {
    name: "OriginationController",
    version: "3",
    chainId: 1,
    verifyingContract: this.ARCADE_ORIGINATION_CONTROLLER as `0x${string}`,
  };

  constructor(account: PrivateKeyAccount, http: AxiosInstance) {
    this.account = account;
    this.http = http;
  }

  async get(address: `0x${string}`): Promise<ArcadeOffer[]> {
    return await this.http
      .get(`/accounts/${address}/loanterms`)
      .then((res) => res.data)
      .catch((err) => console.log(err));
  }

  async create(offerParams: ArcadeOfferParams): Promise<ArcadeOffer> {
    const { principal, currency, apr, durationInDays } = offerParams;
    const nonce = this.getNonce();

    const predicate = {
      verifier: this.ARCADE_ITEMS_VERIFIER,
      data: encodeAbiParameters([{ type: "address" }], [offerParams.collectionAddress]),
    };

    const loanTerms: ItemsPayload = {
      durationSecs: durationInDays * 24 * 3600,
      proratedInterestRate: BigInt(Math.floor(((apr * durationInDays) / 365.25) * 10000)) * BigInt(1e18),
      principal: BigInt(Math.floor(principal * 10000)) * BigInt(1e14),
      collateralAddress: offerParams.collectionAddress.toLowerCase(),
      collateralId: "-1",
      payableCurrency: currency.address,
      deadline: this.getExpiry(offerParams.expiryInMinutes * 60),
      affiliateCode: pad("0x0"),
      nonce: nonce,
      side: 1,
    };

    const data = {
      loanTerms: {
        durationSecs: loanTerms.durationSecs,
        payableCurrency: loanTerms.payableCurrency,
        collateralAddress: loanTerms.collateralAddress,
        collateralId: loanTerms.collateralId,
        deadline: loanTerms.deadline.toString(),
        principal: loanTerms.principal.toString(),
        proratedInterestRate: loanTerms.proratedInterestRate.toString(),
        affiliateCode: loanTerms.affiliateCode,
      },
      role: "lender",
      signature: await this.account.signTypedData({
        domain: this.domain,
        types: typedLoanTermsItemsData,
        primaryType: "LoanTermsWithItems",
        message: {
          ...loanTerms,
          items: [predicate],
        },
      }),
      nonce: nonce.toString(),
      kind: "collection",
      collectionId: offerParams.collectionAddress.toLowerCase(),
      itemPredicates: [predicate],
    };

    return await this.http.post(`/accounts/${this.account.address}/loanterms/`, data).then((res) => res.data);
  }

  async delete(offerId: string) {
    await this.http.delete(`/accounts/${this.account.address}/loanterms/${offerId}`);
  }

  private getExpiry(offset: number) {
    const currentTime = new Date();
    const currentTimePlusOffset = new Date(currentTime.getTime() + offset * 1000); // Add offset
    return BigInt(Math.floor(currentTimePlusOffset.getTime() / 1000)); // Convert to seconds
  }

  private getNonce(): bigint {
    return BigInt(Date.now());
  }
}
