import { LendingPlatform, LoanStatus } from "../../types";

type DecodedLoanReceipt = {
  version: number;
  principal: bigint;
  repayment: bigint;
  adminFee: bigint;
  borrower: string;
  maturity: number;
  duration: number;
  collateralToken: string;
  collateralTokenId: bigint;
  collateralWrapperContextLen: number;
};

export function decodeLoanReceipt(hexString: string): DecodedLoanReceipt {
  // Remove the 0x prefix if present
  if (hexString.startsWith("0x")) {
    hexString = hexString.slice(2);
  }

  // Convert hex string to buffer
  const buffer = Buffer.from(hexString, "hex");

  // Decode the buffer according to the structure
  const version = buffer.readUInt8(0);
  const principal = BigInt("0x" + buffer.slice(1, 33).toString("hex"));
  const repayment = BigInt("0x" + buffer.slice(33, 65).toString("hex"));
  const adminFee = BigInt("0x" + buffer.slice(65, 97).toString("hex"));
  const borrower = buffer.slice(97, 117).toString("hex");
  const maturity = Number(BigInt("0x" + buffer.slice(117, 125).toString("hex")));
  const duration = Number(BigInt("0x" + buffer.slice(125, 133).toString("hex")));
  const collateralToken = buffer.slice(133, 153).toString("hex");
  const collateralTokenId = BigInt("0x" + buffer.slice(153, 185).toString("hex"));
  const collateralWrapperContextLen = buffer.readUInt16BE(185);

  return {
    version,
    principal,
    repayment,
    adminFee,
    borrower,
    maturity,
    duration,
    collateralToken: "0x" + collateralToken,
    collateralTokenId,
    collateralWrapperContextLen,
  };

  return {
    id: 0,
    platform: LendingPlatform.gondi,
    borrower: "0x" + borrower,
    lender: "0x",
    status: LoanStatus.ongoing,
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
        nftId: parseInt(gondiLoan.loan.nft.tokenId),
      },
    ],
  };
}
