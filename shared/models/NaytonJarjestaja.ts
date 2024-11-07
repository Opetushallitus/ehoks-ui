import { getRoot, types } from "mobx-state-tree"
import { Organisaatio } from "./Organisaatio"
import { LocaleRoot } from "./helpers/LocaleRoot"
import { EnrichOrganisaatioOid } from "./Enrichment/EnrichOrganisaatioOid"

const Model = types.model("NaytonJarjestajaModel", {
  id: types.optional(types.number, 0),
  oppilaitosOid: types.optional(types.string, ""),
  oppilaitos: types.optional(Organisaatio, {})
})

export const NaytonJarjestaja = types
  .compose(
    "NaytonJarjestaja",
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
