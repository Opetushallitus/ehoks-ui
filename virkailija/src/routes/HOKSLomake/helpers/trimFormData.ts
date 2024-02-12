function trimObject(object: any) {
  if (object === null) {
    return null
  }
  if (!Object.keys(object).length) {
    return undefined
  }
  return Object.keys(object).reduce<any>((acc, key) => {
    const trimmed = trimEmptyValues(object[key])
    if (trimmed || trimmed === false || trimmed === 0) {
      if (!acc) {
        acc = {}
      }
      acc[key] = trimmed
    }
    return acc
  }, undefined)
}

const trimArray = (array: any[]) =>
  array.reduce((acc, value) => {
    const trimmed = trimEmptyValues(value)
    if (trimmed || trimmed === false || trimmed === null || trimmed === 0) {
      acc.push(trimmed)
    }
    return acc
  }, [])

const trimString = (value: string) => value.trim()

export const trimEmptyValues = (value: any) => {
  console.log("Trimming", value)
  return Array.isArray(value)
    ? trimArray(value)
    : typeof value === "object"
    ? trimObject(value)
    : typeof value === "string"
    ? trimString(value)
    : value
}
