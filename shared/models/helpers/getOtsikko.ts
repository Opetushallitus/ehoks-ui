export const getOtsikko = (
  model: { otsikko: string; osaamispisteet: number },
  ospLyhenne: string
): string =>
  `${model.otsikko}${
    model.osaamispisteet ? ` ${model.osaamispisteet} ${ospLyhenne}` : ""
  }`
