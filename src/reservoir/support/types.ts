export interface CollectionActivityResponse {
  activities: CollectionActivity[];
  continuation: string;
}

export interface CollectionActivity {
  type: string;
  fromAddress: string;
  toAddress: string;
  price: {
    currency: {
      contract: string;
      name: string;
      symbol: string;
      decimals: number;
    };
    amount: {
      raw: string;
      decimal: number;
      usd: number;
      native: number;
    };
  };
  amount: number;
  timestamp: number;
  createdAt: string;
  contract: string;
  token: {
    tokenId: string;
    isSpam: boolean;
    isNsfw: boolean;
    tokenName: string;
    tokenImage: string;
    rarityScore: number;
    rarityRank: number;
  };
  collection: {
    collectionId: string;
    isSpam: boolean;
    isNsfw: boolean;
    collectionName: string;
    collectionImage: string;
  };
  txHash: string;
  logIndex: number;
  batchIndex: number;
  fillSource: {
    domain: string;
    name: string;
    icon: string;
  };
  order: {
    id: string;
    side: string;
    source: {
      domain: string;
      name: string;
      icon: string;
    };
    criteria?: {
      kind: string;
      data: {
        collection: {
          id: string;
          name: string;
          image: string;
          isSpam: boolean;
          isNsfw: boolean;
        };
      };
    };
  };
}

export interface SimplifiedCollectionActivity {}
