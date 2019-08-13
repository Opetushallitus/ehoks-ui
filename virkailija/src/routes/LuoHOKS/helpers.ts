import { JSONSchema6, JSONSchema6Definition } from "json-schema"
import find from "lodash.find"
import { AjvError } from "react-jsonschema-form"
import { koodistoUrls } from "./koodistoUrls"
import { propertiesByStep } from "./propertiesByStep"

// Schema formats supported by react-jsonschema-form
export const SUPPORTED_SCHEMA_FORMATS = [
  "data-url",
  "date",
  "date-time",
  "email",
  "hostname",
  "ipv4",
  "ipv6",
  "uri"
]

export const stripUnsupportedFormat = (schema: any) => {
  if (schema.format && SUPPORTED_SCHEMA_FORMATS.indexOf(schema.format) === -1) {
    delete schema.format
  }
  if (schema.properties) {
    Object.keys(schema.properties).forEach(property => {
      stripUnsupportedFormat(schema.properties[property])
    })
  }
  return schema
}

export const stripUnsupportedFormats = (definitions: any) => {
  return Object.keys(definitions).reduce((defs: any, def) => {
    defs[def] = stripUnsupportedFormat(definitions[def])
    return defs
  }, {})
}

export function transformErrors(errors: AjvError[]) {
  return errors.map(error => {
    if (error.name === "required") {
      error.message = "pakollinen kenttä"
    }
    return error
  })
}

export function buildKoodiUris() {
  return Object.keys(koodistoUrls).reduce(
    (urls, key) => {
      urls[key] = []
      return urls
    },
    {} as any
  )
}

export function mapKoodiUri({ koodiUri, versio, metadata }: any) {
  const meta = find(metadata, md => md.kieli === "FI")
  return {
    koodiUri,
    nimi: meta ? meta.nimi : "",
    versio
  }
}

export function schemaByStep(
  schema: JSONSchema6,
  currentStep: number
): JSONSchema6 {
  const properties = schema.properties || {}
  return {
    type: "object",
    // additionalProperties: false,
    definitions: schema.definitions,
    required: currentStep === 0 ? schema.required : [],
    properties: Object.keys(schema.properties || []).reduce<{
      [key: string]: JSONSchema6Definition
    }>((props, key) => {
      if (propertiesByStep[currentStep].indexOf(key) > -1 && properties[key]) {
        props[key] = properties[key]
      }
      return props
    }, {})
  }
}
