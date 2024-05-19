import { Loan } from "../types";

export class MetaStreetClient {
  constructor() {}

  public async getLoans(): Promise<Loan[]> {
    throw Error("Not implemented");
  }
}
