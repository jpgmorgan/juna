import {
  Loan,
  Offer,
  LendingClientParameters,
  Listing,
  SingleItemOfferParams,
  CollectionOfferParams,
  LendingClientBlur,
} from "../types";
import { config } from "../config";
import { GhostApi } from "./GhostApi";
import { blurLoanMapper, blurOfferMapper } from "./support/mappers";

export class BlurClient implements LendingClientBlur {
  private api: GhostApi;

  constructor(p: LendingClientParameters) {
    this.api = new GhostApi(p.privateKey ?? config.defaultPrivateKey, p.rpcUrl ?? config.defaultRpc);
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
    return await this.api.postLoanOffer(
      offerParams.collectionAddress,
      offerParams.principal,
      offerParams.limit ?? offerParams.principal,
      offerParams.apr,
      offerParams.expiryInMinutes,
    );
  }

  public async deleteOffer(offerId: string): Promise<void> {
    console.log(offerId);
    throw new Error("Not implemented!");
  }

  public async getOffers(): Promise<Offer[]> {
    throw Error("Not implemented");
  }

  public async getOffersForAccount(address: `0x${string}`): Promise<Offer[]> {
    return await this.api.getLoanOffers(address).then((res) => res.map((x) => blurOfferMapper(x, address)));
  }

  public async getOffersForCollection(address: `0x${string}`): Promise<Offer[]> {
    console.log(address);
    throw Error("Not implemented");
  }

  public async getMyOffers(): Promise<Offer[]> {
    throw new Error("Not implemented!");
  }

  public async recallLoan(collectionAddress: `0x${string}`, loanId: string, nftId: number): Promise<void> {
    await this.api.recallLoan(collectionAddress, loanId, nftId.toString());
  }
}
