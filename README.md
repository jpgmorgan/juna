# JUNA - a NFT lending client for serious lenders

## Setup

Install bun:

```bash
curl -fsSL https://bun.sh/install | bash
```

Install dependencies:

```bash
bun install
```

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

#### All historical loans (**_not implemented_**)

TBD

#### By account

TBD

#### By collection (**_not implemented_**)

TBD

### Getting offers

#### All offers (**_not implemented_**)

TBD

#### By account (**_not implemented_**)

TBD

#### By collection (**_not implemented_**)

TBD

## Architecture

- The different clients all implement the interface `LendingClient` and use the common types in `src/types.ts` to offer
  a uniform API.
- Since the number of currency tokens is limited we export them as pre-defined const objects
  from `src/support/currencies.ts`.
- Each client has an API it interacts with; it uses specific types (e.g. `src/arcade/support/types.ts`) and uses mappers
  to transform them in the common types mentioned above.
- The `OmniClient` is just an experimental wrapper that can be instantiated once and we can pass the platform as param
  when sending a request.
- This library relies on Viem to handle Ethereum logic and Bun as runtime; however we don't explicitly use Bun global
  except for testing so that this can also be run from Node.

## Contributors

- [SwissQuant](https://github.com/swissquant)
- [NEMO Ventures](https://github.com/nemoengineering)
