import { getRoot, types } from "mobx-state-tree"
import { LocaleRoot } from "./helpers/LocaleRoot"
import { Organisaatio } from "./Organisaatio"
import { EnrichOrganisaatioOid } from "./Enrichment/EnrichOrganisaatioOid"

const Model = types.model("OppilaitoshenkiloModel", {
  id: types.optional(types.number, 0),
  nimi: types.optional(types.string, ""),
  rooli: types.optional(types.string, ""),
  oppilaitosOid: types.optional(types.string, ""),
  oppilaitos: types.optional(Organisaatio, {})
})

export const Oppilaitoshenkilo = types
  .compose(
    "Oppilaitoshenkilo",
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
      },
      get oppilaitosHenkiloDescription() {
        return [self.nimi, self.rooli, self.oppilaitosNimi]
          .filter(Boolean)
          .join(", ")
      }
    }
  })
