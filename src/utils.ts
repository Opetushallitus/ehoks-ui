export const mockFetch = (path: string) => {
  return Promise.resolve(require("./models/mocks/" + path))
}
