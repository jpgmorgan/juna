import { PortfolioClient, WETH } from "..";
import { Currency } from "../types";
import { CollectionRegistry } from "./CollectionRegistry";

type LoanTerm = { currency: Currency; ltv: number; durationInDays: number; apr: number };
type BasePrice = { eth: number; usd: number };
type CollectionOffer = { basePrice: BasePrice; loanTerms: LoanTerm[] };
type CollectionOffers = Record<`0x${string}`, CollectionOffer>;

export class Loaner {
  private readonly portfolioClient: PortfolioClient;
  private collectionOffers: CollectionOffers;

  constructor(portfolioClient: PortfolioClient) {
    this.portfolioClient = portfolioClient;
    this.collectionOffers = {};
  }

  public updateCollectionOffers(
    collectionAddress: `0x${string}`,
    basePriceInEth: number,
    basePriceInUsd: number,
    loanTerms: LoanTerm[],
  ) {
    this.collectionOffers[collectionAddress] = {
      basePrice: { eth: basePriceInEth, usd: basePriceInUsd },
      loanTerms: loanTerms,
    };
  }

  private getBasePriceForCurrency(basePrice: BasePrice, currency: Currency) {
    if ([WETH].includes(currency)) {
      return basePrice.eth;
    } else {
      return basePrice.usd;
    }
  }

  public async publishCollectionOffers(expiryInMinutes: number = 10) {
    for (const [collectionAddress, offering] of Object.entries(this.collectionOffers)) {
      const collectionName = CollectionRegistry.getCollectionDetails(collectionAddress as `0x${string}`).name;
      console.log(`${collectionName}: base_price = ${offering.basePrice.eth} eth | ${offering.basePrice.usd} usd`);

      for (const loanTerm of offering.loanTerms) {
        const principal = loanTerm.ltv * this.getBasePriceForCurrency(offering.basePrice, loanTerm.currency);

        console.log(
          `publishing collection offer on ${collectionName}: ltv=${
            loanTerm.ltv * 100
          }% | principal=${principal} ${loanTerm.currency.symbol.toLowerCase()} | duration=${
            loanTerm.durationInDays
          } days | apr=${loanTerm.apr * 100}%`,
        );

        await this.portfolioClient.createCollectionOffer({
          collectionAddress: collectionAddress as `0x${string}`,
          currency: loanTerm.currency,
          principal: principal,
          apr: loanTerm.apr,
          durationInDays: loanTerm.durationInDays,
          expiryInMinutes: expiryInMinutes,
        });
      }
    }
  }
}
