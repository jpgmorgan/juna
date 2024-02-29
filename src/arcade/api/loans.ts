import { PrivateKeyAccount } from "viem";
import { AxiosInstance } from "axios";

import { ArcadeLoan } from "../support/types";

export default class Loans {
  private account: PrivateKeyAccount;
  private http: AxiosInstance;

  constructor(account: PrivateKeyAccount, http: AxiosInstance) {
    this.account = account;
    this.http = http;
  }

  public async get(address: `0x${string}`): Promise<ArcadeLoan[]> {
    return await this.http.get(`/accounts/${address}/loans`).then((res) => res.data);
  }

  public async getAll(): Promise<ArcadeLoan[]> {
    const params: { cursor?: number } = {};
    const allLoans: ArcadeLoan[] = [];

    do {
      console.log(params);
      const response = await this.http.get("/loans", { params });
      console.log(response.data);
      params.cursor = response.data[-1].cursor;
      allLoans.push(...response.data);
    } while (params.cursor !== 1);

    return allLoans;
  }
}
