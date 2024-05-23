import { BETH, WETH } from "../..";
import { BlurLoan, BlurOffer } from "./types";
import { Loan, LendingPlatform, LoanStatus, Offer, OfferType } from "../../types";
import { CollectionRegistry } from "../../support/CollectionRegistry";

export const blurLoanMapper = (blurLoan: BlurLoan): Loan => {
  return {
    id: blurLoan.lien.lienId,
    platform: LendingPlatform.blur,
    borrower: blurLoan.lien.borrower.address,
    lender: blurLoan.lien.lender.address,
    status: blurLoan.lien.repaidAt ? LoanStatus.repaid : LoanStatus.ongoing,
    startDate: new Date(blurLoan.lien.createdAt),
    endDate: new Date(blurLoan.lien.createdAt),
    currency: WETH,
    principal: parseFloat(blurLoan.lien.principal.amount),
    interestPayment: 0,
    durationInDays: 0,
    apr: parseFloat(blurLoan.lien.interestRateBips) / 10000,
    collateral: [
      {
        collectionAddress: blurLoan.lien.contractAddress,
        collectionName: CollectionRegistry.getCollectionDetails(blurLoan.lien.contractAddress).name,
        nftId: 0,
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
