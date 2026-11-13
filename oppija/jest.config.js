module.exports = {
  transform: {
    "^.+\\.[tj]sx?$": [
      "ts-jest",
      {
        tsconfig: {
          allowJs: true
        }
      }
    ]
  },
  transformIgnorePatterns: [
    "<rootDir>/../node_modules/.pnpm/(?!(decode-uri-component)@)",
    "<rootDir>/../node_modules/(?!decode-uri-component/)"
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
