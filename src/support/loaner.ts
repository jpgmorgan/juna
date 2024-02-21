import { PortfolioClient } from "..";
import { Currency } from "../types";
import { CollectionRegistry } from "./CollectionRegistry";

type LoanTerm = { currency: Currency; principal: number; durationInDays: number; apr: number };
type CollectionOffers = Record<`0x${string}`, LoanTerm[]>;

export class Loaner {
  private readonly portfolioClient: PortfolioClient;
  private collectionOffers: CollectionOffers;

  constructor(portfolioClient: PortfolioClient) {
    this.portfolioClient = portfolioClient;
    this.collectionOffers = {};
  }

  public updateCollectionOffers(collectionAddress: `0x${string}`, loanTerms: LoanTerm[]) {
    this.collectionOffers[collectionAddress] = loanTerms;
  }

  public async publishCollectionOffers(expiryInMinutes: number = 10, logs: boolean = true) {
    for (const [collectionAddress, loanTerms] of Object.entries(this.collectionOffers)) {
      const collectionName = CollectionRegistry.getCollectionDetails(collectionAddress as `0x${string}`).name;
      for (const loanTerm of loanTerms) {
        if (logs) {
          console.log(
            `publishing collection offer on ${collectionName}: principal=${
              loanTerm.principal
            } ${loanTerm.currency.symbol.toLowerCase()} | duration=${loanTerm.durationInDays} days | apr=${
              loanTerm.apr * 100
            }%`,
          );
        }
        await this.portfolioClient.createCollectionOffer(
          {
            collectionAddress: collectionAddress as `0x${string}`,
            currency: loanTerm.currency,
            principal: loanTerm.principal,
            apr: loanTerm.apr,
            durationInDays: loanTerm.durationInDays,
            expiryInMinutes: expiryInMinutes,
          },
          logs,
        );
      }
    }
  }
}
