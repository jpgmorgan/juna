import { PortfolioClient } from "..";
import { Currency } from "../types";

type LoanTerm = { currency: Currency; ltv: number; durationInDays: number; apr: number };
type CollectionOffer = { basePrice: number; loanTerms: LoanTerm[] };
type CollectionOffers = Record<`0x${string}`, CollectionOffer>;

export class Loaner {
  private readonly portfolioClient: PortfolioClient;
  private collectionOffers: CollectionOffers;

  constructor(portfolioClient: PortfolioClient) {
    this.portfolioClient = portfolioClient;
    this.collectionOffers = {};
  }

  public updateCollectionOffers(collectionAddress: `0x${string}`, basePrice: number, loanTerms: LoanTerm[]) {
    this.collectionOffers[collectionAddress] = { basePrice: basePrice, loanTerms: loanTerms };
  }

  public async publishCollectionOffers(expiryInMinutes: number = 10) {
    for (const [collectionAddress, offering] of Object.entries(this.collectionOffers)) {
      for (const loanTerm of offering.loanTerms) {
        await this.portfolioClient.createCollectionOffer({
          collectionAddress: collectionAddress as `0x${string}`,
          currency: loanTerm.currency,
          principal: loanTerm.ltv * offering.basePrice,
          apr: loanTerm.apr,
          durationInDays: loanTerm.durationInDays,
          expiryInMinutes: expiryInMinutes,
        });
      }
    }
  }
}
