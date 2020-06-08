module.exports = {
  preset: "ts-jest",
  setupFilesAfterEnv: ["<rootDir>/../shared/setupTests.ts"],
  modulePaths: ["<rootDir>/src", "<rootDir>/../shared"],
  roots: ["<rootDir>", "<rootDir>/../shared"],
  moduleNameMapper: {
    "\\.(css|jpg|png|svg)$": "<rootDir>/empty-module.js"
  }
}
