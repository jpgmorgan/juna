import { createPublicClient, http, parseAbiItem } from "viem";
import { mainnet } from "viem/chains";

export class MetaStreetClient {
  private client;

  constructor() {
    this.client = createPublicClient({
      chain: mainnet,
      transport: http("https://eth-mainnet.g.alchemy.com/v2/XK8GAkL3ZHEsivr8IAuaRBu23IRLFidV"),
    });
  }

  public async getLoans(): Promise<void> {
    const contractAddress = "0xc0874b4b9a1bae857b054936167f8ef79257a757";

    const logs = await this.client.getLogs({
      address: contractAddress,
      event: parseAbiItem("event LoanOriginated(bytes32 indexed loanReceiptHash, bytes loanReceipt)"),
      fromBlock: 0n,
    });

    // console.log(parseAbiItem("event LoanOriginated(bytes32 indexed loanReceiptHash, bytes loanReceipt)"));
    console.log("Fetched logs:", logs);
  }
}
