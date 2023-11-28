import { LendingClient, Loan, Offer } from "../types";

export class PortfolioClient {
  private readonly clients: LendingClient[];
  private readonly addresses: `0x${string}`[];

  constructor(clients: LendingClient[], addresses: `0x${string}`[]) {
    this.clients = clients;
    this.addresses = addresses;
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
