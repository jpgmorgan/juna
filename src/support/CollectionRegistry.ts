import { Collections, CollectionDetails } from "../types";

export const defaultRegistry: Collections = {
  "0xbd3531da5cf5857e7cfaa92426877b022e612cf8": {
    address: "0xbd3531da5cf5857e7cfaa92426877b022e612cf8",
    name: "Pudgy Penguins",
  },
  "0x6efc003d3f3658383f06185503340c2cf27a57b6": {
    address: "0x6efc003d3f3658383f06185503340c2cf27a57b6",
    name: "YouTheRealMVP",
  },
  "0x60e4d786628fea6478f785a6d7e704777c86a7c6": {
    address: "0x60e4d786628fea6478f785a6d7e704777c86a7c6",
    name: "Mutant Ape Yacht Club",
  },
  "0xe56dd80688f913e36e2e20c2b4a62669a3e23968": {
    address: "0xe56dd80688f913e36e2e20c2b4a62669a3e23968",
    name: "DigiDaigaku",
  },
  "0xddbe45515c5982abcbb315d8bcdf203dd07c81d1": {
    address: "0xddbe45515c5982abcbb315d8bcdf203dd07c81d1",
    name: "CloneX",
  },
  "0x769272677fab02575e84945f03eca517acc544cc": {
    address: "0x769272677fab02575e84945f03eca517acc544cc",
    name: "The Captainz",
  },
  "0x054c122109b3c658ef2780c9ef6bd0b80818dab8": {
    address: "0x054c122109b3c658ef2780c9ef6bd0b80818dab8",
    name: "CryptoDickButts",
  },
  "0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d": {
    address: "0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d",
    name: "Bored Ape Yacht Club",
  },
  "0x34d85c9cdeb23fa97cb08333b511ac86e1c4e258": {
    address: "0x34d85c9cdeb23fa97cb08333b511ac86e1c4e258",
    name: "Otherdeed",
  },
  "0x314ff4acfe223831e132fb959414e5e6176a9127": {
    address: "0x314ff4acfe223831e132fb959414e5e6176a9127",
    name: "Renga",
  },
  "0xb852c6b5892256c264cc2c888ea462189154d8d7": {
    address: "0xb852c6b5892256c264cc2c888ea462189154d8d7",
    name: "RektGuy",
  },
  "0xed5af388653567af2f388e6224dc7c4b3241c544": {
    address: "0xed5af388653567af2f388e6224dc7c4b3241c544",
    name: "Azuki",
  },
  "0x5af0d9827e0c53e4799bb226655a1de152a425a5": {
    address: "0x5af0d9827e0c53e4799bb226655a1de152a425a5",
    name: "Milady",
  },
  "0xb7f7f6c52f2e2fdb1963eab30438024864c313f6": {
    address: "0xb7f7f6c52f2e2fdb1963eab30438024864c313f6",
    name: "Wrapped Cryptopunks",
  },
  "0x3bf2922f4520a8ba0c2efc3d2a1539678dad5e9d": {
    address: "0x3bf2922f4520a8ba0c2efc3d2a1539678dad5e9d",
    name: "0N1 Force",
  },
  "0x39ee2c7b3cb80254225884ca001f57118c8f21b6": {
    address: "0x39ee2c7b3cb80254225884ca001f57118c8f21b6",
    name: "Potatoz",
  },
  "0x7bd29408f11d2bfc23c34f18275bbf23bb716bc7": {
    address: "0x7bd29408f11d2bfc23c34f18275bbf23bb716bc7",
    name: "Meebits",
  },
  "0x8821bee2ba0df28761afff119d66390d594cd280": {
    address: "0x8821bee2ba0df28761afff119d66390d594cd280",
    name: "DeGods",
  },
  "0x23581767a106ae21c074b2276d25e5c3e136a68b": {
    address: "0x23581767a106ae21c074b2276d25e5c3e136a68b",
    name: "Moonbirds",
  },
  "0x8a90cab2b38dba80c64b7734e58ee1db38b8992e": {
    address: "0x8a90cab2b38dba80c64b7734e58ee1db38b8992e",
    name: "Doodles",
  },
  "0xd774557b647330c91bf44cfeab205095f7e6c367": {
    address: "0xd774557b647330c91bf44cfeab205095f7e6c367",
    name: "Nakamigos",
  },
};

export class CollectionRegistry {
  private static collectionRegistry: Collections;

  static initialize(initialRegistry: Collections) {
    this.collectionRegistry = initialRegistry;
  }

  static getCollectionDetails(address: `0x${string}`): CollectionDetails {
    return this.collectionRegistry[address.toLowerCase() as `0x${string}`] ?? { name: "others", address: address };
  }

  static addCollection(address: string, name: string): void {
    this.collectionRegistry[address.toLowerCase() as `0x${string}`] = {
      address: address.toLowerCase() as `0x${string}`,
      name: name,
    };
  }
}

CollectionRegistry.initialize(defaultRegistry);
