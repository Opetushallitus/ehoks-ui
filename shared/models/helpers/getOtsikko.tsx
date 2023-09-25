import React from "react"
import { GrAlert } from "react-icons/gr"
import { IconInline } from "../../components/Icon"
import { IHankittavaTutkinnonOsa } from "../../models/helpers/TutkinnonOsa"
import { ITranslationStore } from "../../stores/TranslationStore"

const fallbackMessage = (koodiUri: string): JSX.Element => {
  const [codetype, code] = koodiUri.split("_")
  //const errormessage = (translations.messages[translations.activeLocale]
  //	["errors.OsaAlueVastaus.nimeaEiLoytynyt"] ||
  const errormessage = "tietojen lataaminen ePerusteet-palvelusta epäonnistui."
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
  ospLyhenne: string
): JSX.Element | string => {
  return (
    <span>
      {model.otsikko
        ? model.otsikko
        : model.nimi
        ? model.nimi
        : model.tutkinnonOsaKoodiUri
        ? fallbackMessage(model.tutkinnonOsaKoodiUri)
        : model.osaAlueKoodiUri
        ? fallbackMessage(model.osaAlueKoodiUri)
        : fallbackMessage("moduleId: " + model.moduleId)}
      {model.osaamispisteet ? ` ${model.osaamispisteet} ${ospLyhenne}` : ""}
    </span>
  )
}
