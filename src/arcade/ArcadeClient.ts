import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";
import axios, { AxiosInstance } from "axios";
import { PrivateKeyAccount } from "viem";

import { arcadeLoanMapper, arcadeOfferMapper } from "./support/mappers";
import {
  Loan,
  Offer,
  LendingClientParameters,
  LendingClientWithPromissoryNotes,
  PromissoryNote,
  Listing,
  SingleItemOfferParams,
  CollectionOfferParams,
} from "../types";
import Offers from "./api/offers";
import Loans from "./api/loans";

export class ArcadeClient implements LendingClientWithPromissoryNotes {
  private readonly account: PrivateKeyAccount;
  private readonly http: AxiosInstance;

  private offers: Offers;
  private loans: Loans;

  constructor(p: LendingClientParameters) {
    this.account = privateKeyToAccount(p.privateKey ?? generatePrivateKey());

    this.http = axios.create({
      baseURL: "https://api-v2.arcade.xyz/api/v2",
      headers: { "x-api-key": p.apiKey },
    });
    this.http.interceptors.request.use(function (config) {
      config.headers["x-expires-at"] = (Date.now() + 10 * 1000).toString();
      return config;
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
    throw Error("Not implemented");
  }

  public async getLoansForCollection(address: `0x${string}`): Promise<Loan[]> {
    console.log(address);
    throw Error("Not implemented");
  }

  public async getLoansForAccount(address: `0x${string}`): Promise<Loan[]> {
    return await this.loans.get(address).then((res) => res.map(arcadeLoanMapper));
  }

  public async getMyLoans(): Promise<Loan[]> {
    return await this.getLoansForAccount(this.account.address);
  }

  public async createSingleItemOffer(offerParams: SingleItemOfferParams): Promise<Offer> {
    return await this.offers
      .create(offerParams)
      .then((res) => arcadeOfferMapper(res))
      .catch((error) => {
        throw Error(error); // TODO: error mapping
      });
  }

  public async createCollectionOffer(offerParams: CollectionOfferParams): Promise<Offer> {
    return await this.offers
      .create(offerParams)
      .then((res) => arcadeOfferMapper(res))
      .catch((error) => {
        throw Error(error); // TODO: error mapping
      });
  }

  public async deleteOffer(offerId: string): Promise<void> {
    await this.offers.delete(offerId);
  }

  public async getOffers(): Promise<Offer[]> {
    throw Error("Not implemented");
  }

  public async getOffersForAccount(address: `0x${string}`): Promise<Offer[]> {
    return await this.offers.get(address).then((res) => res.map(arcadeOfferMapper));
  }

  public async getOffersForCollection(address: `0x${string}`): Promise<Offer[]> {
    console.log(address);
    throw Error("Not implemented");
  }

  public async getMyOffers(): Promise<Offer[]> {
    return await this.offers.get(this.account.address).then(async (res) => res.map(arcadeOfferMapper));
  }

  public async getPromissoryNote(loanId: number): Promise<PromissoryNote> {
    return { address: "0x349A026A43FFA8e2Ab4c4e59FCAa93F87Bd8DdeE", id: loanId };
  }
}
