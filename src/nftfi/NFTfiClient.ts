import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";
import axios, { AxiosInstance } from "axios";
import { PrivateKeyAccount, PublicClient, createPublicClient, http, parseAbi } from "viem";
import { mainnet } from "viem/chains";

import { nftfiOfferMapper, nftfiLoanMapper, mapError } from "./support/mappers";
import {
  Loan,
  Offer,
  LendingClient,
  LendingClientParameters,
  PromissoryNote,
  Listing,
  CollectionOfferParams,
  SingleItemOfferParams,
} from "../types";
import Offers from "./api/offers";
import Loans from "./api/loans";

export class NftfiClient implements LendingClient {
  private readonly account: PrivateKeyAccount;
  private readonly http: AxiosInstance;
  private rpc: PublicClient;

  private offers: Offers;
  private loans: Loans;

  constructor(p: LendingClientParameters) {
    this.account = privateKeyToAccount(p.privateKey ?? generatePrivateKey());

    this.http = axios.create({
      baseURL: "https://sdk-api.nftfi.com",
      headers: { "X-API-Key": p.apiKey },
    });
    this.rpc = createPublicClient({
      chain: mainnet,
      transport: http(p.rpcUrl),
    });

    this.offers = new Offers(this.account, this.http);
    this.loans = new Loans(this.account, this.http);
  }

  public async getListings(): Promise<Listing[]> {
    throw Error("Not implemented");
  }

  public async getListingsForCollection(): Promise<Listing[]> {
    throw Error("Not implemented");
  }

  public async getLoans(): Promise<Loan[]> {
    return await this.loans.getAll().then((res) => res.map((o) => nftfiLoanMapper(o)));
  }

  public async getLoansForCollection(address: `0x${string}`): Promise<Loan[]> {
    console.log(address);
    throw Error("Not implemented");
  }

  public async getLoansForAccount(address: `0x${string}`): Promise<Loan[]> {
    return await this.loans.get(address).then((res) => res.map((o) => nftfiLoanMapper(o, address)));
  }

  public async getMyLoans(): Promise<Loan[]> {
    return await this.getLoansForAccount(this.account.address);
  }

  public async createSingleItemOffer(offerParams: SingleItemOfferParams): Promise<Offer> {
    console.log(offerParams);
    throw Error("Not implemented");
  }

  public async createCollectionOffer(offerParams: CollectionOfferParams): Promise<Offer> {
    const { principal, currency, apr, durationInDays } = offerParams;
    const payload = {
      terms: {
        principal: BigInt(Math.round(principal * 10 ** currency.decimals)),
        repayment: BigInt(Math.round(principal * (1 + apr * (durationInDays / 365)) * 10 ** currency.decimals)),
        duration: 24 * 3600 * durationInDays,
        currency: currency.address,
        expiry: { seconds: 60 * offerParams.expiryInMinutes },
      },
      nft: { address: offerParams.collectionAddress },
      nftfi: { contract: { name: "v2-3.loan.fixed.collection" } },
    };

    return await this.offers
      .create(payload)
      .then((res) => nftfiOfferMapper(res))
      .catch((error) => {
        throw mapError(error);
      });
  }

  public async deleteOffer(offerId: string): Promise<void> {
    await this.offers.delete(offerId);
  }

  public async getOffers(): Promise<Offer[]> {
    throw Error("Not implemented");
  }

  public async getOffersForAccount(address: `0x${string}`): Promise<Offer[]> {
    return await this.offers.get(address).then((res) => res.map(nftfiOfferMapper));
  }

  public async getOffersForCollection(address: `0x${string}`): Promise<Offer[]> {
    console.log(address);
    throw Error("Not implemented");
  }

  public async getMyOffers(): Promise<Offer[]> {
    return await this.offers.get(this.account.address).then((res) => res.map(nftfiOfferMapper));
  }

  public async getPromissoryNote(loanId: number): Promise<PromissoryNote> {
    const contractAddress = "0x329E090aCE410aC8D86f1f0c2a13486884E7072a";
    const response = await this.rpc.readContract({
      address: contractAddress,
      abi: parseAbi(["function getLoanData(uint32 _loanId) public view returns (address, uint64, uint8)"]),
      functionName: "getLoanData",
      args: [loanId],
    });

    return {
      address: response[0],
      id: Number(response[1]),
    };
  }
}
