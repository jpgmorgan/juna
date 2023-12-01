import { LendingPlatform, Loan, LoanStatus } from "../../types";
import { currencyFromAddress } from "../../support/currencies";
import { GondiLoan } from "./types";
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
    endDate: addDaysToDate(new Date(gondiLoan.startTime), durationInDays),
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
