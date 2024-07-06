import * as path from "path";
import * as VitestConfig from "vitest/config";

export default VitestConfig.defineConfig({
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: [
      './tests/test-utilities/shopify.setup.js',
    ],
  },
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "app"),
    },
  },
});
