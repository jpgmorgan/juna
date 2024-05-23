export interface BlurOffer {
  contractAddress: `0x${string}`;
  interestRate: string;
  maxAmount: string;
  filledAmount: string;
  totalAmount: string;
  auctionDuration: number;
  expiresOn: string;
  createdAt: string;
  hash: string;
}

export interface BlurLoan {
  lien: Lien;
  nft: NFT;
}

export interface Lien {
  contractAddress: `0x${string}`;
  tokenId: string;
  lienId: string;
  lender: { address: `0x${string}` };
  borrower: { address: `0x${string}` };
  interestRateBips: string;
  principal: { amount: string; unit: string };
  auctionDurationBlocks: number;
  auctionStartBlockHeight: number | null;
  createdAt: string;
  auctionStartedAt: string | null;
  repaidAt: string | null;
  defaultedAt: string | null;
}

export interface NFT {
  contractAddress: string;
  tokenId: string;
  name: string;
  imageUrl: string;
  traits: any; // Replace 'any' with a more specific type if possible
  rarityScore: number;
  rarityRank: number;
  price: any; // Replace 'any' with a more specific type if possible
  highestBid: any | null; // Replace 'any' with a more specific type if possible
  lastSale: any; // Replace 'any' with a more specific type if possible
  lastCostBasis: any; // Replace 'any' with a more specific type if possible
  owner: any; // Replace 'any' with a more specific type if possible
}
