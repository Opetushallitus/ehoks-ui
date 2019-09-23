import { codeCategoriesForPaths } from "../formConfig"

export const codeVersionByPath = (
  path: keyof typeof codeCategoriesForPaths,
  koodiUris: any
) => {
  const codeCategory = codeCategoriesForPaths[path]
  if (koodiUris[codeCategory]) {
    // all koodiUris have the same version in this scenario
    return koodiUris[codeCategory][0].versio
  } else {
    return 1
  }
}
