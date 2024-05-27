import { generatePrivateKey } from "viem/accounts";

export const config = {
  defaultRpc: "https://eth.llamarpc.com" as `https://${string}`,
  defaultPrivateKey: generatePrivateKey(),
  blur: {
    baseUrlHome: "https://blur.io/",
    baseUrlAuth: "https://core-api.prod.blur.io/auth",
    baseUrlBlend: "https://core-api.prod.blur.io/v1/blend",
    baseUrlPortfolio: "https://core-api.prod.blur.io/v1/portfolio",
  },
};
