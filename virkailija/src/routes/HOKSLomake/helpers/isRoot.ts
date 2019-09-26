export function isRoot(rootKeys: string[]) {
  return (title: string) => {
    return rootKeys.indexOf(title) > -1
  }
}
