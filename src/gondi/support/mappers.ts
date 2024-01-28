import { LendingPlatform, Loan, LoanStatus, Offer, OfferType } from "../../types";
import { currencyFromAddress } from "../../support/currencies";
import { GondiLoan, GondiOffer } from "./types";
import { CollectionRegistry } from "../../support/CollectionRegistry";
import { addDaysToDate, calculateDurationInDays } from "../../helpers";

const gondiStatusMapper = (status: string, sourceType: string): LoanStatus => {
  if (sourceType === "LostSource") {
    return LoanStatus.repaid;
  } else {
    if (status === "loan_initiated") {
      return LoanStatus.ongoing;
    } else if (status === "loan_repaid") {
      return LoanStatus.repaid;
    } else if (["loan_sent_to_auction", "loan_defaulted"]) {
      return LoanStatus.defaulted;
    } else {
      return LoanStatus.liquidated;
    }
  }
};

export const gondiLoanMapper = (gondiLoan: GondiLoan): Loan => {
  const currency = currencyFromAddress(gondiLoan.loan.currency.address);
  const durationInDays = calculateDurationInDays(parseInt(gondiLoan.duration ?? gondiLoan.loan.duration));
  const principal = parseInt(gondiLoan.principalAmount) / 10 ** currency.decimals;
  const apr = parseInt(gondiLoan.aprBps) / 10000;
  return {
    id: gondiLoan.id,
    platform: LendingPlatform.gondi,
    borrower: gondiLoan.loan.nft.owner.toLowerCase() as `0x${string}`,
    lender: gondiLoan.lenderAddress.toLowerCase() as `0x${string}`,
    status: gondiStatusMapper(gondiLoan.loan.status, gondiLoan.__typename),
    startDate: new Date(gondiLoan.startTime),
    endDate: gondiLoan.loan.repaidActivity
      ? new Date(gondiLoan.loan.repaidActivity.timestamp)
      : addDaysToDate(new Date(gondiLoan.startTime), durationInDays),
    currency: currency,
    principal: parseInt(gondiLoan.principalAmount) / 10 ** currency.decimals,
    interestPayment: (principal * apr * durationInDays) / 365,
    durationInDays: durationInDays,
    apr: parseInt(gondiLoan.aprBps) / 10000,
    collateral: [
      {
        collectionAddress: gondiLoan.loan.nft.collection.contractData.contractAddress.toLowerCase() as `0x${string}`,
        collectionName: CollectionRegistry.getCollectionDetails(
          gondiLoan.loan.nft.collection.contractData.contractAddress.toLowerCase() as `0x${string}`,
        ).name,
        nftId: parseInt(gondiLoan.loan.nft.id),
      },
    ],
  };
};

export const gondiOfferMapper = (gondiOffer: GondiOffer): Offer => {
  const currency = currencyFromAddress(gondiOffer.principalAddress);
  const durationInDays = Number(gondiOffer.duration) / 24 / 3600;
  console.log(gondiOffer);
  return {
    id: gondiOffer.id.toString(),
    platform: LendingPlatform.gondi,
    lender: gondiOffer.lenderAddress,
    offerDate: new Date(),
    expiryDate: new Date(Number(gondiOffer.expirationTime) * 1e3),
    type: gondiOffer.nftCollateralTokenId === 0n ? OfferType.collectionOffer : OfferType.singleItemOffer,
    currency: currency,
    principal: Number(gondiOffer.principalAmount) / 10 ** currency.decimals,
    durationInDays: durationInDays,
    apr: Number(gondiOffer.aprBps) / 10000,
    collateral: {
      collectionAddress: gondiOffer.nftCollateralAddress,
      collectionName: CollectionRegistry.getCollectionDetails(gondiOffer.nftCollateralAddress).name,
      nftId: Number(gondiOffer.nftCollateralTokenId).toString(),
    },
  };
};
