import { defineChain, Chain } from "viem";

export const gondiConfig = {
  baseUrl: "https://api.gondi.xyz/lending/",
  rpcTestnet: "https://dev.floridast.xyz/rpc",
};

export const testChain: Chain = defineChain({
  id: 31337,
  name: "GondiChain",
  network: "GondiChain",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
  },
  rpcUrls: {
    default: {
      http: [gondiConfig.rpcTestnet],
      webSocket: [gondiConfig.rpcTestnet],
    },
    public: {
      http: [gondiConfig.rpcTestnet],
      webSocket: [gondiConfig.rpcTestnet],
    },
  },
  blockExplorers: {
    default: { name: "Explorer", url: "https://explorer.zora.energy" },
  },
  contracts: {},
});
