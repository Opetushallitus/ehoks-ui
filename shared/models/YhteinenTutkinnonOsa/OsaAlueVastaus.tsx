import React from "react"
import { getRoot, Instance, types } from "mobx-state-tree"
import {
  EPerusteetArviointi,
  EPerusteetNimi,
  EPerusteKoodi
} from "../EPerusteetVastaus"
import { GrAlert } from "react-icons/gr"
import { IconInline } from "../../components/Icon"
import { IRootStore } from "../../../virkailija/src/stores/RootStore"
import { Locale } from "../../stores/TranslationStore"

const OsaamisTavoitteet = types.model({
  laajuus: types.optional(types.number, 0, [null, undefined]),
  pakollinen: types.maybe(types.boolean),
  arviointi: types.maybeNull(EPerusteetArviointi)
})

const fallbackMessage = (
  koodiUri: string | undefined,
  message: string
): JSX.Element => (
  <span title={message}>
    <IconInline>
      <GrAlert size="20" color="#EC7123" />
    </IconInline>
    {koodiUri ? koodiUri.split("_")[1].toUpperCase() : ""}
  </span>
)

export const OsaAlueVastaus = types
  .model("OsaAlueVastaus", {
    koodiUri: types.maybe(types.string),
    nimi: types.optional(EPerusteetNimi, {}),
    koodi: types.optional(EPerusteKoodi, {}),
    osaamistavoitteet: types.array(OsaamisTavoitteet)
  })
  .views(self => {
    const root: IRootStore = getRoot(self)
    const activeLocale: Locale = root.translations.activeLocale
    return {
      get osaAlueNimi(): JSX.Element | string {
        if (!self.koodi && !self.koodiUri) return ""
        return (
          self.koodi?.nimi[activeLocale] ||
          fallbackMessage(
            self.koodiUri,
            root.translations.messages[activeLocale][
              "errors.OsaAlueVastaus.nimeaEiLoytynyt"
            ] ||
              "Osa-alueen nimen lataaminen ei onnistunut. Tämä on tilapäinen häiriö."
          )
        )
      },
      get laajuus() {
        return self.osaamistavoitteet
          .filter(osaamistavoite => osaamistavoite.pakollinen)
          .reduce((sum, osaamistavoite) => sum + osaamistavoite.laajuus, 0)
      }
    }
  })

export type IOsaAlueVastaus = Instance<typeof OsaAlueVastaus>
