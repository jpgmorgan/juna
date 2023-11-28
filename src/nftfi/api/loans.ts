import { PrivateKeyAccount } from "viem";
import { AxiosInstance } from "axios";

import { NFTFfiLoanCounterparty, NFTFfiLoanStatus, NFTfiLoan } from "../support/types";

export default class Loans {
  private account: PrivateKeyAccount;
  private http: AxiosInstance;

  constructor(account: PrivateKeyAccount, http: AxiosInstance) {
    this.account = account;
    this.http = http;
  }

  public async get(
    address: `0x${string}`,
    counterparty: NFTFfiLoanCounterparty = NFTFfiLoanCounterparty.Lender,
    status?: NFTFfiLoanStatus,
  ) {
    const res: { results: NFTfiLoan[] } = await this.http
      .get("/v0.1/loans", {
        params: {
          accountAddress: address,
          counterparty: counterparty,
          status: status,
        },
      })
      .then((res) => res.data);

    return res.results;
  }
}
