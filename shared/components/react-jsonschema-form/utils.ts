export function toArray(el: any) {
  if (Array.isArray(el)) {
    return el
  } else {
    return [el]
  }
}

export const isObjectSchema = (schema: any) =>
  schema.type === "object" || (schema.items && schema.items.type === "object")

export const isArraySchema = (schema: any) => schema.type === "array"

export const isStringSchema = (schema: any) => schema.type === "string"

export const isNumberSchema = (schema: any) =>
  schema.type === "number" || schema.type === "integer"

export function getDefaultValueForSchema(schema: any) {
  if (isArraySchema(schema)) {
    return []
  }

  if (isObjectSchema(schema)) {
    return {}
  }

  if (isStringSchema(schema)) {
    return ""
  }

  if (isNumberSchema(schema)) {
    return NaN
  }
  return ""
}
