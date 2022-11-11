module.exports = {
  env: {
    browser: false,
    es2021: true,
    mocha: true,
    node: true,
  },
  plugins: ["@typescript-eslint"],
  extends: [
    "standard",
    "plugin:prettier/recommended",
    "plugin:node/recommended",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 12,
  },
  rules: {
    "node/no-unsupported-features/es-syntax": [
      "error",
      { ignores: ["modules"] },
    ],
    "node/no-unpublished-import": [
      "error",
      {
        allowModules: [
          "hardhat",
          "hardhat-deploy",
          "ethers",
          "@nomiclabs/hardhat-ethers",
        ],
      },
    ],
    "node/no-missing-import": [
      "error",
      {
        allowModules: ["hardhat-deploy"],
        tryExtensions: [".js", ".json", ".node", ".ts", ".d.ts"],
      },
    ],
  },
};
