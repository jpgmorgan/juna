import { LendingClient, Loan, Offer, CollectionOfferParams } from "../types";

export class PortfolioClient {
  private readonly clients: LendingClient[];
  private readonly addresses: `0x${string}`[];

  constructor(clients: LendingClient[], addresses: `0x${string}`[]) {
    this.clients = clients;
    this.addresses = addresses;
  }

  public async createCollectionOffer(offerParams: CollectionOfferParams) {
    const promises = [];
    for (const client of this.clients) {
      promises.push(client.createCollectionOffer(offerParams));
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

  public async getMyOffers(): Promise<Offer[]> {
    throw Error("Not implemented");
  }
}
