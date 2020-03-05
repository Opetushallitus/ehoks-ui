import { getRoot, types } from "mobx-state-tree"
import { EnrichOrganisaatioOid } from "./EnrichOrganisaatioOid"
import { LocaleRoot } from "./helpers/LocaleRoot"

const Organisaatio = types.model("Organisaatio", {
  oid: types.optional(types.string, ""),
  nimi: types.optional(
    types.model({
      fi: types.optional(types.string, ""),
      sv: types.optional(types.string, "")
    }),
    {}
  )
})

const Model = types.model("OppilaitoshenkiloModel", {
  id: types.optional(types.number, 0),
  nimi: types.optional(types.string, ""),
  rooli: types.optional(types.string, ""),
  oppilaitosOid: types.optional(types.string, ""),
  oppilaitos: types.optional(Organisaatio, {})
})

export const Oppilaitoshenkilo = types
  .compose("Oppilaitoshenkilo", EnrichOrganisaatioOid, Model)
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
        return (
          self.nimi + (self.oppilaitosNimi ? ", " + self.oppilatosNimi : "")
        )
      }
    }
  })
