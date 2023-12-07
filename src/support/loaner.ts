import { PortfolioClient } from "..";

type Offer = { ltv: number; durationInDays: number };
type CollectionOffers = Record<`0x${string}`, Offer[]>;
type SingleItemOffers = Record<`0x${string}`, { ids: number[]; multiplier: number; offers: Offer[] }[]>;

export class Loaner {
  private readonly portfolioClient: PortfolioClient;
  private singleItemOffers: SingleItemOffers;
  private collectionOffers: CollectionOffers;

  constructor(portfolioClient: PortfolioClient) {
    this.portfolioClient = portfolioClient;
    this.singleItemOffers = {};
    this.collectionOffers = {};
  }

  public addCollectionOffers(collectionAddress: `0x${string}`, offers: Offer[]) {
    this.collectionOffers[collectionAddress] = offers;
  }

  public publishCollectionOffers() {
    throw Error("Not implemented");
  }
}
