import { types, getEnv, flow, getRoot } from "mobx-state-tree"
import { StoreEnvironment } from "types/StoreEnvironment"
import { LocaleRoot } from "models/helpers/LocaleRoot"
import { APIResponse } from "types/APIResponse"

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

export const KoulutuksenJarjestajaOrganisaatio = types
  .model("KoulutuksenJarjestajaOrganisaatio", {
    oppilaitosOid: types.optional(types.string, ""),
    oppilaitos: types.optional(Organisaatio, {})
  })
  // TODO: extract fetching organisation to a helper like EnrichKoodiUri
  .actions(self => {
    const { apiUrl, apiPrefix, errors, fetchSingle } = getEnv<StoreEnvironment>(
      self
    )

    const fetchOrganisation = flow(function*(): any {
      try {
        const response: APIResponse = yield fetchSingle(
          apiUrl(`${apiPrefix}/external/organisaatio/${self.oppilaitosOid}`)
        )
        self.oppilaitos = response.data
      } catch (error) {
        errors.logError(
          "KoulutuksenJarjestajaOrganisaatio.fetchOrganisation",
          error.message
        )
      }
    })

    return { fetchOrganisation }
  })
  .actions(self => {
    return {
      afterCreate() {
        self.fetchOrganisation()
      }
    }
  })
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
