export function getOtsikko(
  model: { otsikko: string; osaamispisteet: number },
  ospLyhenne: string
): string {
  return `${model.otsikko}${
    model.osaamispisteet ? ` ${model.osaamispisteet} ${ospLyhenne}` : ""
  }`
}
