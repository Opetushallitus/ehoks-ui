export function isRoot(rootKeys: string[]) {
  return (title: string) => rootKeys.indexOf(title) > -1
}
