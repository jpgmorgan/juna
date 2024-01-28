export interface GondiLoan {
  id: string;
  originationFee: string;
  principalAmount: string;
  lenderAddress: string;
  accruedInterest: string;
  aprBps: string;
  startTime: string;
  duration: string;
  loan: {
    duration: string;
    principalAmount: string;
    principalAddress: string;
    status: string;
    currency: {
      symbol: string;
      decimals: number;
      address: `0x${string}`;
      __typename: string;
    };
    repaidActivity: {
      totalInterest: string;
      timestamp: string;
      __typename: string;
    };
    nft: {
      id: string;
      name: string;
      tokenId: string;
      nftId: string;
      owner: `0x${string}`;
      image: [];
      collection: {
        id: string;
        slug: string;
        name: string;
        nftsCount: number;
        contractData: {
          contractAddress: `0x${string}`;
          __typename: string;
        };
        __typename: string;
      };
      __typename: string;
    };
    __typename: string;
  };
  __typename: string;
}

export interface GondiOffer {
  aprBps: bigint;
  borrowerAddress: `0x${string}`;
  capacity: bigint;
  collectionId: number;
  contractAddress: `0x${string}`;
  duration: bigint;
  expirationTime: bigint;
  fee: bigint;
  lenderAddress: `0x${string}`;
  offerHash: `0x${string}`;
  offerId: bigint;
  principalAddress: `0x${string}`;
  principalAmount: bigint;
  signature: `0x${string}`;
  id: string;
  nftCollateralAddress: `0x${string}`;
  nftCollateralTokenId: bigint;
}
