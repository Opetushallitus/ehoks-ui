export function typeaheadProps(options: any[]) {
  return {
    options: options.sort((a: any, b: any) => {
      if (a.koodiUri > b.koodiUri) {
        return 1
      }
      if (a.koodiUri < b.koodiUri) {
        return -1
      } else {
        return 0
      }
    }),
    labelKey: { fields: ["koodiUri", "nimi"], separator: " - " },
    mapping: "koodiUri",
    minLength: 0,
    clearButton: true,
    placeholder: "Valitse..."
  }
}
