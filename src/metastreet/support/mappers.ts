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
    borrower: "0x" + borrower,
    maturity,
    duration,
    collateralToken: "0x" + collateralToken,
    collateralTokenId,
    collateralWrapperContextLen,
  };
}
