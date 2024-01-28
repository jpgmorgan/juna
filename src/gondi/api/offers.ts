import { Gondi } from "gondi";
import { AxiosInstance } from "axios";
import { CollectionOfferInput } from "gondi/dist/src/model";
import { GondiOffer } from "../support/types";

export default class Offers {
  private http: AxiosInstance;
  private client: Gondi;

  constructor(http: AxiosInstance, client: Gondi) {
    this.http = http;
    this.client = client;
  }

  async createCollectionOffer(offerParams: CollectionOfferInput): Promise<GondiOffer> {
    return this.client.makeCollectionOffer(offerParams);
  }
}
