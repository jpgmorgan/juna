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
    const allLoans: ArcadeLoan[] = [];
    let cursor = 1000000000;

    do {
      const response = await fetch(`https://api-v2.arcade.xyz/api/v2/loans?cursor=${cursor}`);
      const data = (await response.json()) as ArcadeLoan[];
      cursor = data[data.length - 1].cursor;
      allLoans.push(...data);
    } while (cursor !== 1);

    return allLoans;
  }
}
