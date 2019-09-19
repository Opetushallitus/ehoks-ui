import flattenDeep from "lodash.flattendeep"
import { Locale } from "stores/TranslationStore"
import { idToTranslationKey } from "./idToTranslationKey"

// Iterates through all the descriptions
// in JSON schema and generates array of localisations
// formatted for localisation service
export function schemaToTranslations(
  schema: any,
  prevPath: string = "",
  definitions?: any
) {
  const defs = definitions || schema.definitions
  const properties = schema.properties
  const keys = Object.keys(properties)
  return keys.reduce(
    (arr, key) => {
      const property = properties[key]
      if (property.type === "array" || property.$ref) {
        if (property.$ref || (property.items && property.items.$ref)) {
          const ref = (property.$ref || property.items.$ref).replace(
            "#/definitions/",
            ""
          )
          if (defs[ref]) {
            arr.push(
              schemaToTranslations(defs[ref], `${prevPath}_${key}`, defs)
            )
          }
        }
      }
      if (property.description || schema.description) {
        arr.push({
          category: "ehoks",
          locale: Locale.FI,
          key: idToTranslationKey(`${prevPath}_${key}`) + ".description",
          value: property.description || schema.description
        })
      }

      return flattenDeep(arr)
    },
    [] as any[]
  )
}
