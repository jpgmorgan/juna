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

  public async getAll() {
    const limit = 100;
    let allLoans: NFTfiLoan[] = [];

    for (const status of ["active", "repaid", "liquidated", "defaulted"]) {
      let page = 1;
      let totalPages = 1;
      while (page <= totalPages) {
        const data = (
          await this.http.get("/v0.2/loans", {
            params: { status: status, page: page, limit: limit },
          })
        ).data;

        allLoans = allLoans.concat(data.results);

        if (page === 1) {
          // Calculate total pages only once using total count from the first page
          const totalLoans = data.pagination.total;
          totalPages = Math.ceil(totalLoans / limit);
        }

        page++;
      }
    }

    console.log(`Fetched ${allLoans.length} loans.`);
    return allLoans;
  }
}
