module.exports = {
  preset: "ts-jest",
  modulePaths: ["<rootDir>/src", "<rootDir>/../shared"],
  roots: ["<rootDir>", "<rootDir>/../shared"],
  moduleNameMapper: {
    "\\.(css|jpg|png|svg)$": "<rootDir>/empty-module.js"
  }
}
