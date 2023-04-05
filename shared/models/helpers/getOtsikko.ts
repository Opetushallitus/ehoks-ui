export const getOtsikko = (
  model: { otsikko: JSX.Element | string; osaamispisteet: number },
  ospLyhenne: string
): JSX.Element | string =>
  `${model.otsikko}${
    model.osaamispisteet ? ` ${model.osaamispisteet} ${ospLyhenne}` : ""
  }`
