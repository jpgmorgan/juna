import { LendingPlatform, Loan, LoanStatus, Offer, OfferType } from "../../types";
import { currencyFromAddress } from "../../support/currencies";
import { ArcadeLoan, ArcadeOffer } from "./types";
import { CollectionRegistry } from "../../support/CollectionRegistry";
import { addDaysToDate, calculateDurationInDays } from "../../helpers";

const arcadeStatusMapper = (status: string): LoanStatus => {
  switch (status) {
    case "Active":
      return LoanStatus.ongoing;
    case "Repaid":
      return LoanStatus.repaid;
    default:
      return LoanStatus.defaulted;
  }
};

export const arcadeLoanMapper = (arcadeLoan: ArcadeLoan): Loan => {
  const currency = currencyFromAddress(arcadeLoan.payableCurrency);
  const durationInDays = calculateDurationInDays(parseInt(arcadeLoan.durationSecs));
  return {
    id: arcadeLoan.loanId,
    platform: LendingPlatform.arcade,
    borrower: arcadeLoan.borrowerId.toLowerCase() as `0x${string}`,
    lender: arcadeLoan.lenderId.toLowerCase() as `0x${string}`,
    status: arcadeStatusMapper(arcadeLoan.state),
    startDate: new Date(parseInt(arcadeLoan.startDate) * 1e3),
    endDate: addDaysToDate(new Date(parseInt(arcadeLoan.startDate) * 1e3), durationInDays),
    currency: currency,
    principal: parseInt(arcadeLoan.principal) / 10 ** currency.decimals,
    durationInDays: durationInDays,
    apr: (parseInt(arcadeLoan.interestRate) / 1e18 / 10000) * (365.25 / durationInDays),
    collateral: arcadeLoan.collateral.map((collateral) => ({
      collectionAddress: collateral.collectionAddress,
      collectionName: CollectionRegistry.getCollectionDetails(collateral.collectionAddress).name,
      nftId: parseInt(collateral.tokenId),
    })),
  };
};

export const arcadeOfferMapper = (arcadeOffer: ArcadeOffer): Offer => {
  const currency = currencyFromAddress(arcadeOffer.payableCurrency);
  const durationInDays = calculateDurationInDays(arcadeOffer.durationSecs);
  return {
    id: arcadeOffer.id.toString(),
    platform: LendingPlatform.arcade,
    lender: arcadeOffer.creatorId,
    offerDate: new Date(arcadeOffer.createdAt),
    expiryDate: addDaysToDate(new Date(arcadeOffer.createdAt), durationInDays),
    type: arcadeOffer.collateralId === "-1" ? OfferType.collectionOffer : OfferType.singleItemOffer,
    currency: currency,
    principal: parseFloat(arcadeOffer.principal) / 10 ** currency.decimals,
    durationInDays: durationInDays,
    apr: (parseInt(arcadeOffer.interestRate) / 1e18 / 10000) * (365.25 / durationInDays),
    collateral: {
      collectionAddress: arcadeOffer.collateralAddress,
      collectionName: CollectionRegistry.getCollectionDetails(arcadeOffer.collateralAddress).name,
      nftId: arcadeOffer.collateralId,
    },
  };
};
