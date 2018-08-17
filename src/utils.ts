// mocked fetch using local json files
export const mockFetch = (url: string) => {
  return Promise.resolve(require("./models/mocks/" + url))
}

// fetch that returns the JSON directly
export const fetch = (url: string) =>
  window.fetch(url).then(response => response.json())
