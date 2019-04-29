export function toArray(el: any) {
  if (Array.isArray(el)) {
    return el
  } else {
    return [el]
  }
}

export function isObjectSchema(schema: any) {
  return (
    schema.type === "object" || (schema.items && schema.items.type === "object")
  )
}

export function isArraySchema(schema: any) {
  return schema.type === "array"
}

export function isStringSchema(schema: any) {
  return schema.type === "string"
}

export function isNumberSchema(schema: any) {
  return schema.type === "number" || schema.type === "integer"
}

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
