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
}
