// ------------------------------------------------------------
//  LOANS
// ------------------------------------------------------------

import { CollectionOfferParams } from "../../types";

export enum ArcadeLoanStatus {
  Repaid = "Repaid",
}

export interface ArcadeLoan {
  cursor: number;
  id: `0x${string}`;
  protocolVersion: string;
  loanCoreAddress: `0x${string}`;
  loanId: string;
  state: ArcadeLoanStatus;
  borrowerId: `0x${string}`;
  lenderId: `0x${string}`;
  startDate: string;
  collateralKind: string;
  collateralAddress: `0x${string}`;
  collateralId: string;
  payableCurrency: `0x${string}`;
  durationSecs: string;
  deadline: string;
  numInstallments: string;
  principal: string;
  interestRate: string;
  affiliateCode: `0x${string}`;
  borrowerOriginationFee: number;
  lenderOriginationFee: number;
  lenderDefaultFee: number;
  lenderInterestFee: number;
  lenderPrincipalFee: number;
  vaultAddress: null | `0x${string}`;
  collateral: [
    {
      kind: string;
      collectionAddress: `0x${string}`;
      tokenId: string;
      amount: string;
    },
  ];
  rolledOverFromId: null;
  rolledOverToId: null;
  createdAt: number;
  createdAtBlock: number;
  createdAtTx: `0x${string}`;
  closedAt: number;
  closedAtBlock: number;
  closedAtTx: `0x${string}`;
}

// ------------------------------------------------------------
//  OFFERS
// ------------------------------------------------------------

export interface ArcadeOffer {
  id: number;
  contractTokenId: `0x${string}`;
  collateralAddress: `0x${string}`;
  collateralId: string;
  role: string;
  state: string;
  creatorId: `0x${string}`;
  durationSecs: number;
  interestRate: string;
  principal: string;
  payableCurrency: `0x${string}`;
  deadline: string;
  createdAt: string;
  updatedAt: string;
  kind: string;
  collectionId: `0x${string}`;
  itemPredicates: [
    {
      data: `0x${string}`;
      verifier: `0x${string}`;
    },
  ];
  loanCoreId: any | null;
  loanId: any | null;
  loanStartedOn: any | null;
  fundingAddress: any | null;
  expiresAt: string;
  protocolVersion: number;
  affiliateCode: `0x${string}`;
}

export interface ArcadeOfferParams extends CollectionOfferParams {
  nftId?: number;
}

export interface ItemsPayload {
  durationSecs: number;
  principal: bigint;
  proratedInterestRate: bigint;
  collateralAddress: string;
  payableCurrency: string;
  nonce: bigint;
  side: 0 | 1;
  deadline: bigint;
  affiliateCode: string;
  collateralId: string;
}
