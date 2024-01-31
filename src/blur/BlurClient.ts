import {
  Loan,
  Offer,
  LendingClientParameters,
  PromissoryNote,
  LendingClientWithPromissoryNotes,
  Listing,
  SingleItemOfferParams,
  CollectionOfferParams,
} from "../types";
import { GhostApi } from "./GhostApi";
import { blurLoanMapper } from "./support/mappers";
import { generatePrivateKey } from "viem/accounts";

export class BlurClient implements LendingClientWithPromissoryNotes {
  private api: GhostApi;

  constructor(p: LendingClientParameters) {
    this.api = new GhostApi(p.privateKey ?? generatePrivateKey());
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
    return await this.api.getLiens(address).then((res) => res.map(blurLoanMapper));
  }

  public async getMyLoans(): Promise<Loan[]> {
    throw Error("Not implemented");
  }

  public async createSingleItemOffer(offerParams: SingleItemOfferParams): Promise<Offer> {
    console.log(offerParams);
    throw Error("Not implemented");
  }

  public async createCollectionOffer(offerParams: CollectionOfferParams): Promise<Offer> {
    console.log(offerParams);
    throw Error("Not implemented");
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
