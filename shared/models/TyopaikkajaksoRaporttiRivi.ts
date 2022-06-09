import { types, getRoot, Instance } from "mobx-state-tree"
import { EPerusteetVastaus } from "models/EPerusteetVastaus"
import { LocaleRoot } from "models/helpers/LocaleRoot"
import { EnrichTutkinnonOsaKoodiUri } from "./Enrichment/EnrichTutkinnonOsaKoodiUri"
import { KoodistoVastaus } from "models/KoodistoVastaus"
import { EnrichKoodistoKoodiUri } from "./Enrichment/EnrichKoodistoKoodiUri"

export const Model = types.model({
  hoksId: types.number,
  hoksEid: types.string,
  opiskeluoikeusOid: types.string,
  oppijaOid: types.string,
  osaamisenHankkimistapaKoodiUri: types.maybe(types.string),
  osaamisenHankkimistapa: types.optional(KoodistoVastaus, {}),
  alkupvm: types.maybe(types.string),
  loppupvm: types.maybe(types.string),
  osaAikaisuus: types.maybe(types.number),
  oppisopimuksenPerustaKoodiUri: types.maybe(types.string),
  oppisopimuksenPerusta: types.optional(KoodistoVastaus, {}),
  tyopaikanNimi: types.maybe(types.string),
  ytunnus: types.maybe(types.string),
  ohjaajaNimi: types.maybe(types.string),
  ohjaajaEmail: types.maybe(types.string),
  ohjaajaPuhelinnumero: types.maybe(types.string),
  tutkinnonOsaKoodiUri: types.maybe(types.string),
  tutkinnonOsa: types.optional(EPerusteetVastaus, {}),
  customColumn: types.maybe(types.number)
})

export const TyopaikkajaksoRaporttiRivi = types
  .compose(
    "TyopaikkajaksoRaporttiRivi",
    EnrichTutkinnonOsaKoodiUri,
    Model,
    EnrichKoodistoKoodiUri({
      enrichedProperty: "osaamisenHankkimistapa",
      koodiUriProperty: "osaamisenHankkimistapaKoodiUri"
    }),
    EnrichKoodistoKoodiUri({
      enrichedProperty: "oppisopimuksenPerusta",
      koodiUriProperty: "oppisopimuksenPerustaKoodiUri"
    })
  )
  .views(self => {
    const root: LocaleRoot = getRoot(self)
    return {
      get tutkinnonOsanNimi() {
        return self.tutkinnonOsa && self.tutkinnonOsa.nimi
          ? self.tutkinnonOsa.nimi[root.translations.activeLocale]
          : ""
      }
    }
  })

export type ITyopaikkajaksoRaporttiRivi = Instance<
  typeof TyopaikkajaksoRaporttiRivi
>
