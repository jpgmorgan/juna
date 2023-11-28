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
