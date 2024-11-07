import { types, getRoot } from "mobx-state-tree"
import { LocaleRoot } from "models/helpers/LocaleRoot"
import { Organisaatio } from "./Organisaatio"
import { EnrichOrganisaatioOid } from "./Enrichment/EnrichOrganisaatioOid"

const Model = types.model({
  oppilaitosOid: types.optional(types.string, ""),
  oppilaitos: types.optional(Organisaatio, {})
})

export const KoulutuksenJarjestajaOrganisaatio = types
  .compose(
    "KoulutuksenJarjestajaOrganisaatio",
    EnrichOrganisaatioOid({
      enrichedProperty: "oppilaitos",
      organzationOidProperty: "oppilaitosOid"
    }),
    Model
  )
  .views(self => {
    const root: LocaleRoot = getRoot(self)
    return {
      get oppilaitosNimi() {
        return self.oppilaitos.nimi &&
          self.oppilaitos.nimi[root.translations.activeLocale]
          ? self.oppilaitos.nimi[root.translations.activeLocale]
          : ""
      }
    }
  })
