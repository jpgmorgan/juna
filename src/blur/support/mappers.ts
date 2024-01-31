import { WETH } from "../..";
import { BlurLoan } from "./types";
import { Offer, Loan, LendingPlatform, OfferType, LoanStatus } from "../../types";
import { CollectionRegistry } from "../../support/CollectionRegistry";

export const blurLoanMapper = (blurLoan: BlurLoan): Loan => {
  return {
    id: blurLoan.lien.lienId,
    platform: LendingPlatform.blur,
    borrower: blurLoan.lien.borrower.address,
    lender: blurLoan.lien.lender.address,
    status: blurLoan.lien.repaidAt
      ? LoanStatus.repaid
      : blurLoan.lien.auctionStartedAt
      ? LoanStatus.liquidated
      : LoanStatus.ongoing,
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
