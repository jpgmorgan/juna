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
    // In case it's an address within the cryptopunks universe
    if (
      [
        "0xb47e3cd837dDF8e4c57F05d70Ab865de6e193BBB",
        "0xb7F7F6C52F2e2fdb1963Eab30438024864c313F6",
        "0x000000000000003607fce1aC9e043a86675C5C2F",
      ].includes(collectionAddress)
    ) {
      return await this.getQuotesForPunks();
    }

    // Otherwise
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

  public async getQuotesForPunks(): Promise<Quotes> {
    const response: CollectionsAnswer = await this.axiosInstance
      .get(`/collections/v7`, {
        params: {
          contract: [
            "0xb47e3cd837dDF8e4c57F05d70Ab865de6e193BBB",
            "0xb7F7F6C52F2e2fdb1963Eab30438024864c313F6",
            "0x000000000000003607fce1aC9e043a86675C5C2F",
          ],
        },
      })
      .then((response) => response.data);

    let bidPriceNative = 0;
    let bidPriceUsd = 0;
    let askPriceNative = 999999999;
    let askPriceUsd = 999999999;
    for (let i = 0; i < 3; i++) {
      if (response.collections[i].topBid.price) {
        bidPriceNative = Math.max(response.collections[i].topBid.price.amount.native, bidPriceNative);
        bidPriceUsd = Math.max(response.collections[i].topBid.price.amount.usd, bidPriceUsd);
      }
      if (response.collections[i].floorAsk.price) {
        askPriceNative = Math.min(response.collections[i].floorAsk.price.amount.native, askPriceNative);
        askPriceUsd = Math.min(response.collections[i].floorAsk.price.amount.usd, askPriceUsd);
      }
    }

    return {
      bid: {
        eth: bidPriceNative,
        usd: bidPriceUsd,
      },
      ask: {
        eth: askPriceNative,
        usd: askPriceUsd,
      },
    };
  }

  public async getCollectionActivity(collection: string, attributes: string, continuation: string) {
    const url = `/collections/activity/v6`;
    const response = await this.axiosInstance.get(url, {
      params: {
        collection,
        attributes,
        continuation,
      },
    });

    return response.data;
  }
}
