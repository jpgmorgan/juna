import axios, { AxiosInstance } from "axios";

export class DeepNftValueClient {
  private readonly apiKey: string;
  private axiosInstance: AxiosInstance;

  constructor(apiKey: string = "6d3b85e2e7d3679c55dedc0f2b21ef2a72018061") {
    this.apiKey = apiKey;
    this.axiosInstance = axios.create({
      baseURL: "https://api.deepnftvalue.com/v2",
      headers: {
        Authorization: `Token ${this.apiKey}`,
        accept: "application/json",
      },
    });
  }

  public async getValuation(collectionAddress: `0x${string}`, tokenId: number, chainId: number = 1): Promise<number> {
    try {
      // Mapping certains addresses
      let collectionAddress2: `0x${string}`;
      if (collectionAddress.toLowerCase() === "0xb7f7f6c52f2e2fdb1963eab30438024864c313f6") {
        // Wrapped cryptopunks to cryptopunks
        collectionAddress2 = "0xb47e3cd837dDF8e4c57F05d70Ab865de6e193BBB";
      } else {
        collectionAddress2 = collectionAddress;
      }

      const response = await this.axiosInstance.get(`/valuations`, {
        params: {
          contract: collectionAddress2,
          chain_id: chainId,
          token_ids: tokenId.toString(),
        },
      });

      if (response.data.results[0] !== undefined) {
        return parseFloat(response.data.results[0].price);
      } else {
        return 0;
      }
    } catch (error) {
      console.error("Error fetching NFT value:", error);
      return 0;
    }
  }
}
