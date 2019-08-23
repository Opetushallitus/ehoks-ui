export function idToPathArray(id: string = "") {
  return id.replace("root_", "").split("_")
}
