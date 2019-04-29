module.exports = {
  preset: "ts-jest",
  setupFilesAfterEnv: ["<rootDir>/../shared/setupTests.ts"],
  modulePaths: [
    "<rootDir>/src",
    "<rootDir>/../shared",
    "<rootDir>/../virkailija/src"
  ],
  roots: ["<rootDir>", "<rootDir>/../shared", "<rootDir>/../virkailija"],
  moduleNameMapper: {
    "\\.(css|jpg|png|svg)$": "<rootDir>/empty-module.js"
  }
}
