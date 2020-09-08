import { flow, getEnv, types } from "mobx-state-tree"
import { APIResponse } from "types/APIResponse"
import { StoreEnvironment } from "types/StoreEnvironment"
import { OsaamisenOsoittaminen } from "models/OsaamisenOsoittaminen"
import { OsaamisenHankkimistapa } from "models/OsaamisenHankkimistapa"

export const Share = types.model("Share", {
  oppijaNimi: types.optional(types.string, ""),
  oppijaOid: types.optional(types.string, ""),
  tutkintoNimi: types.optional(types.string, ""),
  voimassaoloAlku: types.optional(types.string, ""),
  voimassaoloLoppu: types.optional(types.string, ""),
  osaamisenOsoittaminen: types.array(OsaamisenOsoittaminen),
  osaamisenHankkimistapa: types.array(OsaamisenHankkimistapa)
})

export const ShareStoreModel = {
  shareData: types.optional(Share, {})
}

export const ShareStore = types
  .model("ShareStore", ShareStoreModel)
  .actions(self => {
    const { apiUrl, apiPrefix, fetchSingle, errors, callerId } = getEnv<
      StoreEnvironment
    >(self)

    const fetchShareData = flow(function*(shareUuid: string): any {
      try {
        const response: APIResponse = yield fetchSingle(
          apiUrl(`${apiPrefix}/jaot/jakolinkit/${shareUuid}`),
          { headers: callerId(), credentials: "include" }
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
    })

    return { fetchShareData }
  })
