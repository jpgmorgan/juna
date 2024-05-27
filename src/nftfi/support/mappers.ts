import { Offer, LendingPlatform, Loan, LoanStatus, OfferType } from "../../types";
import { currencyFromAddress } from "../../support/currencies";
import { NFTfiLoan, NFTfiOffer } from "./types";
import { addDaysToDate, calculateDurationInDays } from "../../helpers";
import { CollectionRegistry } from "../../support/CollectionRegistry";
import { AccountUnderfunded, UnsufficientAllowance } from "../../errors";

const nftfiStatusMapper = (status: string): LoanStatus => {
  switch (status) {
    case "active":
      return LoanStatus.ongoing;
    case "escrow":
      return LoanStatus.ongoing;
    case "repaid":
      return LoanStatus.repaid;
    case "foreclosed":
      return LoanStatus.liquidated;
    case "liquidated":
      return LoanStatus.liquidated;
    case "defaulted":
      return LoanStatus.defaulted;
    default:
      throw new Error(`Loan status ${status} is not supported!`);
  }
};

export const nftfiLoanMapper = (nftfiLoan: NFTfiLoan, lender?: `0x${string}`): Loan => {
  const currency = currencyFromAddress(nftfiLoan.terms.loan.currency);
  const durationInDays = calculateDurationInDays(nftfiLoan.terms.loan.duration);
  return {
    id: nftfiLoan.id.toString(),
    platform: LendingPlatform.nftfi,
    borrower: nftfiLoan.borrower.address,
    lender: (lender?.toLowerCase() ?? nftfiLoan.lender.address) as `0x${string}`,
    status: nftfiStatusMapper(nftfiLoan.status),
    startDate: new Date(nftfiLoan.date.started),
    endDate: nftfiLoan.date.repaid
      ? new Date(nftfiLoan.date.repaid)
      : addDaysToDate(new Date(nftfiLoan.date.started), durationInDays),
    currency: currency,
    principal: parseFloat(nftfiLoan.terms.loan.principal.toString()) / 10 ** currency.decimals,
    interestPayment:
      parseFloat(nftfiLoan.terms.loan.repayment.toString()) / 10 ** currency.decimals -
      parseFloat(nftfiLoan.terms.loan.principal.toString()) / 10 ** currency.decimals,
    durationInDays: durationInDays,
    apr:
      (parseFloat(nftfiLoan.terms.loan.repayment.toString()) / parseFloat(nftfiLoan.terms.loan.principal.toString()) -
        1) *
      (365 / durationInDays),
    collateral: [
      {
        collectionAddress: nftfiLoan.nft.address,
        collectionName: CollectionRegistry.getCollectionDetails(nftfiLoan.nft.address).name,
        nftId: parseInt(nftfiLoan.nft.id),
      },
    ],
  };
};

export const nftfiOfferMapper = (nftfiOffer: NFTfiOffer): Offer => {
  const currency = currencyFromAddress(nftfiOffer.terms.loan.currency);
  const durationInDays = calculateDurationInDays(nftfiOffer.terms.loan.duration);
  return {
    id: nftfiOffer.id,
    platform: LendingPlatform.nftfi,
    lender: nftfiOffer.lender.address.toLowerCase() as `0x${string}`,
    offerDate: new Date(nftfiOffer.date.offered),
    expiryDate: addDaysToDate(new Date(nftfiOffer.terms.loan.expiry * 1e3), durationInDays),
    type: nftfiOffer.nft.id === "0" ? OfferType.collectionOffer : OfferType.singleItemOffer,
    currency: currency,
    principal: parseFloat(nftfiOffer.terms.loan.principal.toString()) / 10 ** currency.decimals,
    durationInDays: durationInDays,
    apr:
      (parseFloat(nftfiOffer.terms.loan.repayment.toString()) / parseFloat(nftfiOffer.terms.loan.principal.toString()) -
        1) *
      (365.25 / durationInDays),
    collateral: {
      collectionAddress: nftfiOffer.nft.address,
      collectionName: CollectionRegistry.getCollectionDetails(nftfiOffer.nft.address).name,
      nftId: nftfiOffer.nft.id,
    },
  };
};

export const mapError = (error: any) => {
  const errorMessage = JSON.stringify(error.response.data.errors);
  switch (errorMessage) {
    case `{"terms.loan.principal":["principal is greater than available funds in lender account"]}`:
      return new AccountUnderfunded();
    case `{"terms.loan.principal":["principal is greater than approved allowance on lender account"]}`:
      return new UnsufficientAllowance();
    default:
      return Error(errorMessage);
  }
};
