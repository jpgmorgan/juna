import { Gondi } from "gondi";
import { gondiConfig, testChain } from "./config";
import axios, { AxiosInstance } from "axios";
import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";
import { PrivateKeyAccount, createWalletClient, http } from "viem";
import { mainnet } from "viem/chains";
import {
  Loan,
  Offer,
  LendingClientParameters,
  PromissoryNote,
  LendingClientWithPromissoryNotes,
  Listing,
  SingleItemOfferParams,
  CollectionOfferParams,
} from "../types";
import Loans from "./api/loans";
import Offers from "./api/offers";
import { gondiLoanMapper, gondiOfferMapper, mapError } from "./support/mappers";
import { CollectionNotSupported } from "../errors";

const nowPlusOffset = (offset: number) => {
  const currentTime = new Date();
  const currentTimePlusOffset = new Date(currentTime.getTime() + offset * 60 * 1000); // Add offset
  return Math.floor(currentTimePlusOffset.getTime() / 1000); // Convert to seconds
};

export class GondiClient implements LendingClientWithPromissoryNotes {
  private http: AxiosInstance;
  private readonly account: PrivateKeyAccount;
  private loans: Loans;
  private offers: Offers;
  private client: Gondi;

  constructor(p: LendingClientParameters) {
    this.account = privateKeyToAccount(p.privateKey ?? generatePrivateKey());
    this.http = axios.create({
      baseURL: gondiConfig.baseUrl,
    });

    const wallet = createWalletClient({
      account: privateKeyToAccount(p.privateKey ?? generatePrivateKey()),
      transport: p.testnet ? http(gondiConfig.rpcTestnet) : http(),
      chain: p.testnet ? testChain : mainnet,
    });
    this.client = new Gondi({ wallet });

    this.loans = new Loans(this.http);
    this.offers = new Offers(this.http, this.client);
  }

  public async _getCollectionId(collectionAddress: `0x${string}`): Promise<any> {
    const collectionId = (
      await this.client.collectionId({
        contractAddress: collectionAddress,
      })
    )[0];
    if (collectionId === undefined) {
      throw new CollectionNotSupported();
    }
    return collectionId;
  }

  public async getListings(): Promise<Listing[]> {
    throw Error("Not implemented");
  }

  public async getListingsForCollection(): Promise<Listing[]> {
    throw Error("Not implemented");
  }

  public async getLoans(): Promise<Loan[]> {
    throw Error("Not implemented");
  }

  public async getLoansForCollection(address: `0x${string}`): Promise<Loan[]> {
    console.log(address);
    throw Error("Not implemented");
  }

  public async getLoansForAccount(address: `0x${string}`): Promise<Loan[]> {
    return await this.loans.get(address).then((res) => res.map(gondiLoanMapper));
  }

  public async getMyLoans(): Promise<Loan[]> {
    return await this.getLoansForAccount(this.account.address);
  }

  public async createSingleItemOffer(offerParams: SingleItemOfferParams): Promise<Offer> {
    console.log(offerParams);
    throw Error("Not implemented");
  }

  public async createCollectionOffer(offerParams: CollectionOfferParams): Promise<Offer> {
    const payload = {
      collectionId: await this._getCollectionId(offerParams.collectionAddress),
      principalAddress: offerParams.currency.address,
      principalAmount: BigInt(offerParams.principal * 1e18),
      capacity: BigInt(offerParams.principal * 1e18),
      fee: 0n, // Origination fee
      aprBps: BigInt(Math.round(offerParams.apr * 10000)),
      expirationTime: BigInt(nowPlusOffset(offerParams.expiryInMinutes)),
      duration: BigInt(Math.round(offerParams.durationInDays * 24 * 3600)),
      requiresLiquidation: false, // Sets the collateral to be liquidated on default.
      lenderAddress: offerParams.lenderAddress ?? this.account.address,
      // borrowerAddress: null, // Optional: allow only this borrower to accept the offer.
    };
    return await this.offers
      .createCollectionOffer(payload)
      .then((res) => gondiOfferMapper(res))
      .catch((error) => {
        throw mapError(error);
      });
  }

  public async deleteOffer(offerId: string): Promise<void> {
    console.log(offerId);
    throw new Error("Not implemented!");
  }

  public async getOffers(): Promise<Offer[]> {
    throw Error("Not implemented");
  }

  public async getOffersForAccount(address: `0x${string}`): Promise<Offer[]> {
    console.log(address);
    throw new Error("Not implemented!");
  }

  public async getOffersForCollection(address: `0x${string}`): Promise<Offer[]> {
    console.log(address);
    throw Error("Not implemented");
  }

  public async getMyOffers(): Promise<Offer[]> {
    throw new Error("Not implemented!");
  }

  public async getPromissoryNote(loanId: number): Promise<PromissoryNote> {
    console.log(loanId);
    throw Error("Not implemented");
  }
}
