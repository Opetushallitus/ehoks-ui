module.exports = {
  preset: "ts-jest",
  transform: {
    "^.+\\.[tj]sx?$": [
      "ts-jest",
      { tsconfig: { allowJs: true, module: "commonjs", target: "es2018" } }
    ]
  },
  transformIgnorePatterns: [
    "/node_modules/(?!query-string|decode-uri-component|filter-obj|split-on-first)/"
  ],
  setupFilesAfterEnv: ["<rootDir>/../shared/setupTests.ts"],
  modulePaths: ["<rootDir>/src", "<rootDir>/../shared"],
  roots: ["<rootDir>", "<rootDir>/../shared"],
  testMatch: ["**/__tests__/**/*.ts?(x)", "**/?(*.)+(spec|test).ts?(x)"],
  moduleNameMapper: {
    "\\.(css|jpg|png|svg)$": "<rootDir>/empty-module.js"
  },
  testEnvironment: "jsdom"
}
