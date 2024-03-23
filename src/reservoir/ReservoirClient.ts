import axios, { AxiosInstance } from "axios";

type CollectionsAnswer = {
  collections: {
    name: string;
    floorAsk: { price: { amount: { native: number; usd: number } } };
    topBid: { price: { amount: { native: number; usd: number } } };
  }[];
};

type Quotes = { bid: { eth: number; usd: number }; ask: { eth: number; usd: number } };

export class ReservoirClient {
  private readonly apiKey: string;
  private axiosInstance: AxiosInstance;

  constructor(apiKey: string = "demo-api-key") {
    this.apiKey = apiKey;
    this.axiosInstance = axios.create({
      baseURL: "https://api.reservoir.tools",
      headers: {
        "X-Api-Key": this.apiKey,
        Accept: "*/*",
      },
    });
  }

  public async getQuotes(collectionAddress: `0x${string}`): Promise<Quotes> {
    const response: CollectionsAnswer = await this.axiosInstance
      .get(`/collections/v7`, {
        params: { id: collectionAddress },
      })
      .then((response) => response.data);

    const bidPrice = response.collections[0].topBid.price || response.collections[0].floorAsk.price;
    const askPrice = response.collections[0].floorAsk.price || response.collections[0].topBid.price;

    return {
      bid: {
        eth: bidPrice.amount.native,
        usd: bidPrice.amount.usd,
      },
      ask: {
        eth: askPrice.amount.native,
        usd: askPrice.amount.usd,
      },
    };
  }
}
