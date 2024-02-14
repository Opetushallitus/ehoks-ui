import React from "react"
import { GrAlert } from "react-icons/gr"
import { IconInline } from "../../components/Icon"
import { IHankittavaTutkinnonOsa } from "../../models/helpers/TutkinnonOsa"

const fallbackMessage = (
  koodiUri: string,
  errormessage: string
): JSX.Element => {
  const [codetype = "ei koodistoa", code = "ei koodia"] = koodiUri.split("_")
  return (
    <span title={errormessage}>
      <IconInline>
        <GrAlert size="20" color="#EC7123" />
      </IconInline>
      {codetype}: {code.toUpperCase()}
    </span>
  )
}

export const getOtsikko = (
  model: IHankittavaTutkinnonOsa,
  ospLyhenne: string,
  errormessage: string
): JSX.Element | string => (
  <span>
    {model.otsikko
      ? model.otsikko
      : model.nimi
      ? model.nimi
      : model.tutkinnonOsaKoodiUri
      ? fallbackMessage(model.tutkinnonOsaKoodiUri, errormessage)
      : model.osaAlueKoodiUri
      ? fallbackMessage(model.osaAlueKoodiUri, errormessage)
      : fallbackMessage("moduleId: " + model.moduleId, errormessage)}
    {model.osaamispisteet ? ` ${model.osaamispisteet} ${ospLyhenne}` : ""}
  </span>
)
