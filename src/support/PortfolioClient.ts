import { DeepNftValueClient } from "../deepnftvalue/DeepNftValueClient";
import { LendingClient, Loan, Offer, CollectionOfferParams } from "../types";

export class PortfolioClient {
  private readonly clients: LendingClient[];
  private readonly addresses: `0x${string}`[];
  private readonly pricer: DeepNftValueClient;

  constructor(clients: LendingClient[], addresses: `0x${string}`[]) {
    this.clients = clients;
    this.addresses = addresses;
    this.pricer = new DeepNftValueClient();
  }

  public async createCollectionOffer(offerParams: CollectionOfferParams, logs: boolean = true) {
    const promises = [];
    for (const client of this.clients) {
      promises.push(
        client
          .createCollectionOffer(offerParams)
          .then(() => (logs ? console.log(`${client.constructor.name} ✓`) : null))
          .catch((error) => (logs ? console.error(`${client.constructor.name} ${error}`) : null)),
      );
    }
    await Promise.all(promises);
  }

  public async getMyLoans(): Promise<Loan[]> {
    let loans: Loan[] = [];
    for (const client of this.clients) {
      for (const address of this.addresses) {
        loans = loans.concat(await client.getLoansForAccount(address));
      }
    }

    return loans;
  }

  public async priceMyLoans(loans: Loan[]): Promise<Loan[]> {
    for (const loan of loans) {
      if (loan.status === "ongoing" || loan.status === "auctioned") {
        const collateralPrice = await this.pricer.getValuation(
          loan.collateral[0].collectionAddress,
          loan.collateral[0].nftId,
        );
        if (collateralPrice === 0) {
          loan.valuation = loan.principal;
        } else {
          loan.valuation = Math.min(loan.principal, collateralPrice);
        }
      } else {
        loan.valuation = 0;
      }
    }

    return loans;
  }

  public async getMyOffers(): Promise<Offer[]> {
    throw Error("Not implemented");
  }
}
