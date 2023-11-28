# JUNA - a NFT lending client for serious lenders

## Setup

### For users (**_not implemented_**)

```bash
npm install juna
```

### For contributors

Clone the repository

```bash
git clone https://github.com/swissquant/juna.git
```

Install bun:

```bash
curl -fsSL https://bun.sh/install | bash
```

Install dependencies:

```bash
bun install
```

You're good to go!

## Usage

### Client initialization

```javascript
import { NftfiClient, ArcadeClient, GondiClient } from "juna";

// Arcade client
const arcadeClient = new ArcadeClient({ privateKey: PRIVATE_KEY, apiKey: API_KEY });

// Nftfi client
const nftfiClient = new NftfiClient({ privateKey: PRIVATE_KEY, apiKey: API_KEY });

// Gondi client
const gondiClient = new GondiClient({ privateKey: PRIVATE_KEY });
```

### Creating an offer

#### Collection offer

```javascript
import { WETH, DAI, USDC } from "juna";

const offer = await client.createCollectionOffer({
  collectionAddress: "0xed5af388653567af2f388e6224dc7c4b3241c544", // azuki
  currency: WETH,
  principal: 0.1, // 0.1 weth
  apr: 0.15, // 15%
  durationInDays: 30, // 30 days
  expiryInMinutes: 5, // offer expires in 5 minutes
});
```

#### Single item offer (**_not implemented_**)

```javascript
import { WETH, DAI, USDC } from "juna";

const offer = await client.createSingleItemOffer({
  collectionAddress: "0xed5af388653567af2f388e6224dc7c4b3241c544", // azuki
  nftId: 10, // offering only to the nft id 10
  currency: WETH,
  principal: 0.1, // 0.1 weth
  apr: 0.15, // 15%
  durationInDays: 30, // 30 days
  expiryInMinutes: 5, // offer expires in 5 minutes
});
```

### Getting loans

#### Format

```javascript
export interface Loan {
  id: string;
  platform: LendingPlatform;
  borrower: `0x${string}`;
  lender: `0x${string}`;
  status: LoanStatus;
  startDate: Date;
  endDate: Date;
  currency: Currency;
  principal: number;
  durationInDays: number;
  apr: number;
  collateral: Collateral[];
}

export interface Collateral {
  collectionAddress: `0x${string}`;
  collectionName: string;
  nftId: number;
}
```

#### All historical loans (**_not implemented_**)

```javascript
const loans = await client.getLoans();
```

#### By account

```javascript
const loans = await client.getLoansForAccount(ACCOUNT_ADDRESS);
```

#### By collection (**_not implemented_**)

```javascript
const loans = await client.getLoansForCollection(COLLECTION_ADDRESS);
```

### Getting offers

#### Format

```javascript
interface Offer {
  id: string;
  platform: LendingPlatform;
  lender: `0x${string}`;
  offerDate: Date;
  expiryDate: Date;
  type: OfferType;
  currency: Currency;
  principal: number;
  durationInDays: number;
  apr: number;
  collateral: {
    collectionAddress: `0x${string}`;
    collectionName: string;
    nftId: string;
  };
}

export enum OfferType {
  collectionOffer = "collectionOffer",
  singleItemOffer = "singleItemOffer",
}
```

#### All offers (**_not implemented_**)

```javascript
const offers = await client.getOffers();
```

#### By account (**_not implemented_**)

```javascript
const offers = await client.getOffersForAccount(ACCOUNT_ADDRESS);
```

#### By collection (**_not implemented_**)

```javascript
const offers = await client.getOffersForCollection(COLLECTION_ADDRESS);
```

## Tests

```bash
bun test
```

## Architecture

- The different clients all implement the interface `LendingClient` and use the common types in `src/types.ts` to offer
  a uniform API.
- Since the number of currency tokens is limited we export them as pre-defined const objects
  from `src/support/currencies.ts`.
- Each client has an API it interacts with; it uses specific types (e.g. `src/arcade/support/types.ts`) and uses mappers
  to transform them in the common types mentioned above.
- This library relies on Viem to handle Ethereum logic and Bun as runtime; however we don't explicitly use Bun global
  except for testing so that this can also be run from Node.

## Contributors

- [SwissQuant](https://github.com/swissquant)
- [NEMO Ventures](https://github.com/nemoengineering)
