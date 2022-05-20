// These methods have been adapted from this pull request:
// https://github.com/rjsf-team/react-jsonschema-form/pull/1228
// This is not a perfect solution but provides ok-ish workaround
// until issue:
// https://github.com/rjsf-team/react-jsonschema-form/issues/675
// has been resolved

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

export const trimEmptyValues = (value: any) =>
  Array.isArray(value)
    ? trimArray(value)
    : typeof value === "object"
    ? trimObject(value)
    : value
