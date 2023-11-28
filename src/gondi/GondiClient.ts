import axios, { AxiosInstance } from "axios";
import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";
import { PrivateKeyAccount } from "viem";
import {
  Loan,
  Offer,
  LendingClientParameters,
  PromissoryNote,
  LendingClientWithPromissoryNotes,
  Listing,
  SingleItemOfferParams,
} from "../types";
import Loans from "./api/loans";
import { gondiLoanMapper } from "./support/mappers";

export class GondiClient implements LendingClientWithPromissoryNotes {
  private http: AxiosInstance;
  private readonly account: PrivateKeyAccount;
  private loans: Loans;

  constructor(p: LendingClientParameters) {
    this.account = privateKeyToAccount(p.privateKey ?? generatePrivateKey());
    this.http = axios.create({
      baseURL: "https://api.gondi.xyz/lending/",
    });
    this.loans = new Loans(this.http);
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
    return await this.loans.get(address).then((res) => res.map(gondiLoanMapper));
  }

  public async getMyLoans(): Promise<Loan[]> {
    return await this.getLoansForAccount(this.account.address);
  }

  public async createSingleItemOffer(offerParams: SingleItemOfferParams): Promise<Offer> {
    console.log(offerParams);
    throw Error("Not implemented");
  }

  public async createCollectionOffer(): Promise<Offer> {
    throw new Error("Not implemented!");
  }

  public async deleteOffer(offerId: string): Promise<void> {
    console.log(offerId);
    throw new Error("Not implemented!");
  }

  public async getOffers(): Promise<Offer[]> {
    throw Error("Not implemented");
  }

  public async getOffersForAccount(address: `0x${string}`): Promise<Offer[]> {
    console.log(address);
    throw new Error("Not implemented!");
  }

  public async getOffersForCollection(address: `0x${string}`): Promise<Offer[]> {
    console.log(address);
    throw Error("Not implemented");
  }

  public async getMyOffers(): Promise<Offer[]> {
    throw new Error("Not implemented!");
  }

  public async getPromissoryNote(loanId: number): Promise<PromissoryNote> {
    console.log(loanId);
    throw Error("Not implemented");
  }
}
