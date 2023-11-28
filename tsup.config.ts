import { defineConfig } from "tsup";

export default defineConfig({
  name: "juna",
  entry: ["src/index.ts"],
  outDir: "dist",
  format: ["esm", "cjs"],
  splitting: false,
  sourcemap: true,
  dts: true,
  clean: true,
  treeshake: true,
  tsconfig: "tsconfig.build.json",
});
