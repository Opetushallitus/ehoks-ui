import camelCase from "lodash.camelcase"
import { idToPathArray } from "./idToPathArray"

export function idToTranslationKey(id: string = "") {
  const key = idToPathArray(id)
    .map(part => {
      if (!isNaN(Number(part))) {
        return ""
      } else {
        return camelCase(part)
      }
    })
    .filter(Boolean)
    .join(".")
  return `luoHoks.${key}`
}
