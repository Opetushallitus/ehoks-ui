import React from "react"

export const getOtsikko = (
  model: { otsikko: JSX.Element | string; osaamispisteet: number },
  ospLyhenne: string
): JSX.Element => (
  <span>
    {model.otsikko}
    {model.osaamispisteet ? ` ${model.osaamispisteet} ${ospLyhenne}` : ""}
  </span>
)
