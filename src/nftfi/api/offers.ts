import { encodePacked, keccak256, PrivateKeyAccount } from "viem";
import { generatePrivateKey } from "viem/accounts";
import { AxiosInstance } from "axios";
import { mainnet } from "viem/chains";

import { NFTfiOffer, NFTfiOfferParams, NFTfiPaginatedOffers } from "../support/types";

// @ts-ignore
BigInt.prototype["toJSON"] = function () {
  return this.toString();
};

export default class Offers {
  private account: PrivateKeyAccount;
  private http: AxiosInstance;

  constructor(account: PrivateKeyAccount, http: AxiosInstance) {
    this.account = account;
    this.http = http;
  }

  async get(address: `0x${string}`) {
    const res: NFTfiPaginatedOffers = await this.http
      .get(`/v0.1/offers`, {
        params: { lenderAddress: address.toLowerCase() },
      })
      .then((res) => res.data);

    return res.results;
  }

  async create(params: NFTfiOfferParams) {
    const contractName = params.nftfi.contract.name;

    switch (contractName) {
      case "v2-3.loan.fixed.collection": {
        let payload = await this.constructV2_3FixedCollectionOffer(params);

        const res: { result: NFTfiOffer } = await this.http.post("/v0.1/offers", payload).then((res) => res.data);
        return res.result;
      }
      default: {
        throw new Error(`${contractName} not supported`);
      }
    }
  }

  async delete(offerId: string) {
    await this.http.delete(`/v0.1/offers/${offerId}`);
  }

  private async constructV2_3FixedCollectionOffer(options: NFTfiOfferParams) {
    let offer = {
      nft: {
        id: BigInt(0), // offer is for whole collection
        address: options.nft.address,
      },
      lender: {
        address: this.account.address,
        nonce: BigInt(generatePrivateKey()),
      },
      referrer: {
        address: "0x0000000000000000000000000000000000000000" as `0x${string}`,
      },
      terms: {
        loan: {
          duration: options.terms.duration,
          repayment: options.terms.repayment,
          principal: options.terms.principal,
          currency: options.terms.currency,
          expiry: this.getExpiry(options.terms.expiry.seconds),
          interest: { prorated: false, bps: 0 },
        },
      },
      nftfi: {
        contract: { name: options.nftfi.contract.name },
        fee: { bps: 500 },
      },
      metadata: undefined,
      signature: "",
    };

    const packed = encodePacked(
      [
        "address",
        "uint256",
        "uint256",
        "address",
        "uint256",
        "address",
        "uint32",
        "uint16",
        "address",
        "uint256",
        "uint256",
        "address",
        "uint256",
      ],
      [
        offer.terms.loan.currency,
        offer.terms.loan.principal,
        offer.terms.loan.repayment,
        offer.nft.address,
        offer.nft.id,
        offer.referrer.address,
        offer.terms.loan.duration,
        offer.nftfi.fee.bps,
        this.account.address,
        offer.lender.nonce,
        offer.terms.loan.expiry,
        "0xD0C6e59B50C32530C627107F50Acc71958C4341F",
        BigInt(mainnet.id),
      ],
    );
    offer.signature = await this.account.signMessage({
      message: { raw: keccak256(packed) },
    });
    return offer;
  }

  private getExpiry(seconds: number) {
    const currentTimestampSecs = Math.floor(Date.now() / 1000);
    const secondsIntoTheFuture = seconds || 24 * 60 * 60; // 24 hours
    return BigInt(currentTimestampSecs + secondsIntoTheFuture);
  }
}
