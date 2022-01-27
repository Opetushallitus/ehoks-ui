import { JSONSchema7, JSONSchema7Definition } from "json-schema"
import find from "lodash.find"
import { AjvError } from "@rjsf/core"
import { koodistoUrls } from "../formConfig"

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

export const stripUnsupportedFormats = (definitions: any) =>
  Object.keys(definitions).reduce((defs: any, def) => {
    defs[def] = stripUnsupportedFormat(definitions[def])
    return defs
  }, {})

export const transformErrors = (errors: AjvError[]) =>
  errors.map(error => {
    if (error.name === "required") {
      error.message = "pakollinen kenttä"
    }
    return error
  })

export const buildKoodiUris = () =>
  Object.keys(koodistoUrls).reduce((urls, key) => {
    urls[key] = []
    return urls
  }, {} as any)

export function mapKoodiUri({ koodiUri, versio, metadata }: any) {
  const meta = find(metadata, md => md.kieli === "FI")
  return {
    koodiUri,
    nimi: meta ? meta.nimi : "",
    versio
  }
}

export function schemaByStep(
  schema: JSONSchema7,
  properties: { [index: number]: string[] },
  currentStep: number
): JSONSchema7 {
  const schemaProperties = schema.properties || {}
  return {
    type: "object",
    // additionalProperties: false,
    definitions: schema.definitions,
    required: currentStep === 0 ? schema.required : [],
    properties: Object.keys(schema.properties || []).reduce<{
      [key: string]: JSONSchema7Definition
    }>((props, key) => {
      if (properties[currentStep].indexOf(key) > -1 && schemaProperties[key]) {
        props[key] = schemaProperties[key]
      }
      return props
    }, {})
  }
}
