export const gondiConfig = {
  baseUrl: "https://api.gondi.xyz/lending/",
  rpcTestnet: "https://dev.floridast.xyz/rpc",
};

export const testChain = {
  id: 31337,
  name: "testnet",
  network: "testnet",
  nativeCurrency: {
    name: "ETH",
    symbol: "ETH",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: [gondiConfig.rpcTestnet],
    },
    public: {
      http: [gondiConfig.rpcTestnet],
    },
  },
};
