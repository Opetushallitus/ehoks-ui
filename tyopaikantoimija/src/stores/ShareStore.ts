import { flow, getEnv, types, Instance } from "mobx-state-tree"
import { APIResponse } from "types/APIResponse"
import { StoreEnvironment } from "types/StoreEnvironment"
import { OsaamisenOsoittaminen } from "models/OsaamisenOsoittaminen"
import { OsaamisenHankkimistapa } from "models/OsaamisenHankkimistapa"

const tutkintoNimi = types.model("tutkintoNimi", {
  fi: types.optional(types.string, ""),
  sv: types.optional(types.string, "")
})

const osaamisalaNimi = types.model("osaamisalaNimi", {
  fi: types.optional(types.string, ""),
  sv: types.optional(types.string, "")
})

const tutkinnonosa = types.model("tutkinnonosa", {
  koulutuksenJarjestajaOid: types.optional(types.string, ""),
  moduleId: types.optional(types.string, ""),
  olennainenSeikka: types.optional(types.boolean, false),
  tutkinnonOsaKoodiUri: types.optional(types.string, ""),
  tutkinnonOsaKoodiVersio: types.optional(types.number, 1)
})

export const Share = types.model("Share", {
  oppijaNimi: types.optional(types.string, ""),
  oppijaOid: types.optional(types.string, ""),
  tutkintoNimi: types.optional(tutkintoNimi, {}),
  voimassaoloAlku: types.optional(types.string, ""),
  voimassaoloLoppu: types.optional(types.string, ""),
  osaamisenOsoittaminen: types.maybeNull(OsaamisenOsoittaminen),
  osaamisenHankkimistapa: types.maybeNull(OsaamisenHankkimistapa),
  tutkinnonosa: types.maybe(tutkinnonosa),
  osaamisalaNimi: types.optional(osaamisalaNimi, {})
})

export const ShareStoreModel = {
  shareData: types.optional(Share, {}),
  isLoading: types.optional(types.boolean, false)
}

export const ShareStore = types
  .model("ShareStore", ShareStoreModel)
  .actions(self => {
    const { apiUrl, apiPrefix, fetchSingle, errors, appendCallerId } = getEnv<
      StoreEnvironment
    >(self)

    const fetchShareData = flow(function*(shareUuid: string): any {
      self.isLoading = true
      try {
        const response: APIResponse = yield fetchSingle(
          apiUrl(`${apiPrefix}/jaot/jakolinkit/${shareUuid}`),
          { headers: appendCallerId(), credentials: "include" }
        )
        self.shareData = response.data
      } catch (error) {
        errors.logError(
          "ShareSTore.fetchShareData",
          `ShareSTore.fetchShareData.${error.message
            .replace(" ", "")
            .toLowerCase()}`
        )
      }
      self.isLoading = false
    })

    return { fetchShareData }
  })

export type IShareStore = Instance<typeof ShareStore>
