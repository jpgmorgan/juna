// ------------------------------------------------------------
//  LOANS
// ------------------------------------------------------------

export enum NFTFfiLoanCounterparty {
  Lender = "lender",
  Borrower = "borrower",
}

export enum NFTFfiLoanStatus {
  Escrow = "escrow",
  Defaulted = "defaulted",
  Repaid = "repaid",
  Liquidated = "liquidated",
}

export interface NFTfiLoan {
  id: number;
  status: NFTFfiLoanStatus;
  date: {
    started: string;
    repaid: string;
  };
  nft: {
    id: string;
    address: `0x${string}`;
    name: string;
    project: { name: string };
  };
  borrower: {
    address: `0x${string}`;
  };
  lender: {
    address: `0x${string}`;
  };
  terms: {
    loan: {
      duration: number;
      repayment: bigint;
      principal: bigint;
      currency: `0x${string}`;
      unit: string;
    };
  };
  nftfi: {
    contract: { name: string };
  };
}

// ------------------------------------------------------------
//  OFFERS
// ------------------------------------------------------------

export interface NFTfiPaginatedOffers {
  results: NFTfiOffer[];
  pagination: { total: number };
}

export interface NFTfiOffer {
  nft: {
    id: string;
    address: `0x${string}`;
    project?: { name: string };
  };
  lender: {
    address: `0x${string}`;
    nonce: string;
  };
  borrower?: { address: `0x${string}` };
  referrer: { address: `0x${string}` };
  terms: {
    loan: {
      duration: number;
      repayment: string;
      principal: string;
      currency: `0x${string}`;
      expiry: number;
      interest: { prorated: boolean; bps: number };
      unit?: string;
      apr?: number;
      cost?: number;
    };
  };
  nftfi: {
    contract: { name: string };
    fee: { bps: number };
  };
  signature: `0x${string}`;
  date: { offered: string };
  id: string;
}

export interface NFTfiOfferParams {
  terms: {
    repayment: bigint;
    principal: bigint;
    duration: number;
    currency: `0x${string}`;
    expiry: { seconds: number };
  };
  nft: { address: `0x${string}` };
  nftfi: { contract: { name: string } };
}
