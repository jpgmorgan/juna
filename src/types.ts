export type Currency = { address: `0x${string}`; symbol: string; decimals: number };
export type Currencies = Record<`0x${string}`, Currency>;

export type CollectionDetails = { address: `0x${string}`; name: string; gondiCollectionId?: string };
export type Collections = Record<`0x${string}`, CollectionDetails>;

export interface LendingClient {
  getListings: () => Promise<Listing[]>;
  getListingsForCollection: (address: `0x${string}`) => Promise<Listing[]>;
  getLoans: () => Promise<Loan[]>;
  getLoansForAccount: (address: `0x${string}`) => Promise<Loan[]>;
  getLoansForCollection: (address: `0x${string}`) => Promise<Loan[]>;
  getMyLoans: () => Promise<Loan[]>;
  createSingleItemOffer: (offerParams: SingleItemOfferParams) => Promise<Offer>;
  createCollectionOffer: (offerParams: CollectionOfferParams) => Promise<Offer>;
  getOffers: () => Promise<Offer[]>;
  getOffersForAccount: (address: `0x${string}`) => Promise<Offer[]>;
  getOffersForCollection: (address: `0x${string}`) => Promise<Offer[]>;
  getMyOffers: () => Promise<Offer[]>;
  deleteOffer: (offerId: string) => Promise<void>;
}

export interface LendingClientBlur {
  recallLoan: (collectionAddress: `0x${string}`, loanId: string, nftId: number) => Promise<void>;
}

export interface LendingClientWithPromissoryNotes extends LendingClient {
  getPromissoryNote: (loanId: number) => Promise<PromissoryNote>;
}

export interface LendingClientParameters {
  apiKey?: string;
  privateKey?: `0x${string}`;
  rpcUrl?: `https://${string}`;
  testnet?: boolean;
}

export enum LendingPlatform {
  nftfi = "nftfi",
  arcade = "arcade",
  gondi = "gondi",
  blur = "blur",
}

export interface Listing {
  id: string;
}

export enum LoanStatus {
  ongoing = "ongoing",
  repaid = "repaid",
  liquidated = "liquidated",
  defaulted = "defaulted",
}

export interface Collateral {
  collectionAddress: `0x${string}`;
  collectionName: string;
  nftId: number;
}

export interface Loan {
  id: string;
  platform: LendingPlatform;
  borrower: `0x${string}`;
  lender: `0x${string}`;
  status: LoanStatus;
  startDate: Date;
  endDate: Date;
  currency: Currency;
  principal: number;
  interestPayment: number;
  durationInDays: number;
  apr: number;
  collateral: Collateral[];
  valuation?: number;
}

export enum OfferType {
  collectionOffer = "collectionOffer",
  singleItemOffer = "singleItemOffer",
}

export interface Offer {
  id: string;
  platform: LendingPlatform;
  lender: `0x${string}`;
  offerDate: Date;
  expiryDate: Date;
  type: OfferType;
  currency: Currency;
  principal: number;
  durationInDays: number;
  apr: number;
  collateral: {
    collectionAddress: `0x${string}`;
    collectionName: string;
    nftId: string;
  };
}

export interface CollectionOfferParams {
  collectionAddress: `0x${string}`;
  currency: Currency;
  principal: number;
  apr: number;
  durationInDays: number;
  expiryInMinutes: number;
  lenderAddress?: `0x${string}`;
  limit?: number;
}

export interface SingleItemOfferParams extends CollectionOfferParams {
  nftId: number;
}

export interface PromissoryNote {
  address: `0x${string}`;
  id: number;
}
