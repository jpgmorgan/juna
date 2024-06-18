import { BETH, WETH } from "../..";
import { BlurLoan, BlurOffer } from "./types";
import { Loan, LendingPlatform, LoanStatus, Offer, OfferType } from "../../types";
import { CollectionRegistry } from "../../support/CollectionRegistry";

export const blurLoanMapper = (blurLoan: BlurLoan): Loan => {
  const durationInDays = (new Date().getTime() - new Date(blurLoan.lien.createdAt).getTime()) / (1000 * 3600 * 24);

  return {
    id: blurLoan.lien.lienId,
    platform: LendingPlatform.blur,
    borrower: blurLoan.lien.borrower.address,
    lender: blurLoan.lien.lender.address,
    status: blurLoan.lien.repaidAt
      ? LoanStatus.repaid
      : blurLoan.lien.auctionStartedAt
        ? LoanStatus.auctioned
        : LoanStatus.ongoing,
    startDate: new Date(blurLoan.lien.createdAt),
    endDate: new Date(),
    currency: WETH,
    principal: parseFloat(blurLoan.lien.principal.amount),
    interestPayment:
      (((durationInDays / 365) * parseFloat(blurLoan.lien.interestRateBips)) / 10000) *
      parseFloat(blurLoan.lien.principal.amount),
    durationInDays: durationInDays,
    apr: parseFloat(blurLoan.lien.interestRateBips) / 10000,
    collateral: [
      {
        collectionAddress: blurLoan.lien.contractAddress,
        collectionName: CollectionRegistry.getCollectionDetails(blurLoan.lien.contractAddress).name,
        nftId: parseInt(blurLoan.nft.tokenId),
      },
    ],
  };
};

export const blurOfferMapper = (blurOffer: BlurOffer, lender: `0x${string}`): Offer => {
  return {
    id: blurOffer.hash,
    platform: LendingPlatform.blur,
    lender: lender,
    offerDate: new Date(blurOffer.createdAt),
    expiryDate: new Date(blurOffer.expiresOn),
    type: OfferType.collectionOffer,
    currency: BETH,
    principal: Number(blurOffer.maxAmount),
    durationInDays: 0,
    apr: Number(blurOffer.interestRate),
    collateral: {
      collectionAddress: blurOffer.contractAddress,
      collectionName: CollectionRegistry.getCollectionDetails(blurOffer.contractAddress).name,
      nftId: "0",
    },
  };
};
