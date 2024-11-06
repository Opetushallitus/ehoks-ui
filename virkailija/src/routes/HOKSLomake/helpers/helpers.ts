import find from "lodash.find"
import { RJSFSchema, RJSFValidationError } from "@rjsf/utils"
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

const fields = ["oneOf", "allOf", "anyOf"]

function convertFieldNames(property: any) {
  fields.forEach((key) => {
    if (property[`x-${key}`]) {
      property[key] = property[`x-${key}`]
      delete property[`x-${key}`]
    }
  })
}

export const convertSchema = (schema: any) => {
  // delete unsupported schemas
  if (schema.format && SUPPORTED_SCHEMA_FORMATS.indexOf(schema.format) === -1) {
    delete schema.format
  }
  if (schema.properties) {
    Object.keys(schema.properties).forEach((propertyName) => {
      const property = schema.properties[propertyName]
      convertFieldNames(property)
      convertSchema(property)
    })
  }
  return schema
}

export const convertSchemaDefinitions = (definitions: any) =>
  Object.keys(definitions).reduce((defs: any, def) => {
    defs[def] = convertSchema(definitions[def])
    return defs
  }, {})

export const transformErrors = (errors: RJSFValidationError[]) =>
  errors.map((error) => {
    if (error.name === "required") {
      error.message = "pakollinen kenttä"
    }
    return error
  })

const humanReadablePrefix = (prefix: any[]) => {
  if (!prefix.length) return ""
  return prefix
    .map(
      (part: any, index: number) =>
        "" +
        part +
        (typeof prefix[index + 1] === "number"
          ? " "
          : typeof prefix[index + 1] === "string"
            ? ", "
            : "")
    )
    .join("")
}

export const reportHOKSErrors = (
  json: any,
  intl: any,
  report: (errorId: string, message: string) => void
) => {
  const ohtErrors: string[] = []
  const APIErrorsToNotifications = (prefix: any[], subtree: any) => {
    if (subtree === null || subtree === "") {
      return
    }
    if (Array.isArray(subtree)) {
      subtree.forEach((item: any, index: number) =>
        APIErrorsToNotifications(prefix.concat([index + 1]), item)
      )
    } else if (typeof subtree === "object") {
      Object.keys(subtree).forEach((key: string) =>
        APIErrorsToNotifications(prefix.concat([key]), subtree[key])
      )
    } else if (
      typeof subtree === "string" &&
      subtree.includes("Tieto oppisopimuksen perustasta puuttuu")
    ) {
      ohtErrors.push(humanReadablePrefix(prefix))
    } else if (typeof subtree === "string" && prefix.length) {
      report(
        "HOKS.TallennusAPIVirhe",
        intl.formatMessage(
          { id: "errors.HOKS.MuuVirheTallennuksessa" },
          { field: humanReadablePrefix(prefix), apierror: subtree }
        )
      )
    }
  }
  APIErrorsToNotifications([], json.errors)

  if (ohtErrors.length) {
    report("HOKS.OppisopimuksenPerustaPuuttuu", ohtErrors.join("; "))
  }

  if (json.error && typeof json.error === "string") {
    report(
      json.error.includes(
        "HOKSin rakenteen tulee vastata siihen liitetyn opiskeluoikeuden tyyppiä"
      )
        ? "HOKS.RakenneVirhe"
        : "HOKS.TallennusAPIVirhe",
      json.error
    )
  }
}

export const buildKoodiUris = () =>
  Object.keys(koodistoUrls).reduce((urls, key) => {
    urls[key] = []
    return urls
  }, {} as any)

export function mapKoodiUri({ koodiUri, versio, metadata }: any) {
  const meta = find(metadata, (md) => md.kieli === "FI")
  return {
    koodiUri,
    nimi: meta ? meta.nimi : "",
    versio
  }
}

export function schemaByStep(
  schema: RJSFSchema,
  properties: { [index: number]: string[] },
  currentStep: number
): RJSFSchema {
  const schemaProperties = schema.properties || {}
  return {
    type: "object",
    // additionalProperties: false,
    definitions: schema.definitions,
    required: currentStep === 0 ? schema.required : [],
    properties: Object.keys(schema.properties || []).reduce<{
      [key: string]: RJSFSchema | boolean
    }>((props, key) => {
      if (properties[currentStep].indexOf(key) > -1 && schemaProperties[key]) {
        props[key] = schemaProperties[key]
      }
      return props
    }, {})
  }
}
