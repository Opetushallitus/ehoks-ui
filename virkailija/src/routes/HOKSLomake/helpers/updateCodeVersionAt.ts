import { codeCategoriesForPaths } from "../formConfig"
import { codeVersionByPath } from "./codeVersionByPath"
import { idToPathArray } from "./idToPathArray"

// creates (React state compatible) immutable state for formData
function updateValue(data: any, pathArray: string[], value: any): any {
  const [firstPath, ...rest] = pathArray
  if (!rest.length) {
    return { ...data, [firstPath]: value }
  } else if (!isNaN(Number(firstPath))) {
    const arrCopy = [...data]
    arrCopy[Number(firstPath)] = updateValue(data[firstPath], rest, value)
    return arrCopy
  } else {
    return { ...data, [firstPath]: updateValue(data[firstPath], rest, value) }
  }
}

// updates related code version value when code uri is selected or unselected
export function updateCodeVersionAt(
  path: string,
  selected: boolean,
  formData: any,
  koodiUris: any
) {
  const pathArray = idToPathArray(path.replace("koodi-uri", "koodi-versio"))
  const lastPath: keyof typeof codeCategoriesForPaths = pathArray[
    pathArray.length - 1
  ] as keyof typeof codeCategoriesForPaths

  return updateValue(
    formData,
    pathArray,
    selected ? codeVersionByPath(lastPath, koodiUris) : undefined
  )
}
