import flattenDeep from "lodash.flattendeep"
import { flow, getEnv, getRoot, SnapshotIn, types } from "mobx-state-tree"
import { HOKS } from "models/HOKS"
import { Notification } from "stores/NotificationStore"
import { IRootStore } from "stores/RootStore"
import { APIResponse } from "types/APIResponse"
import { StoreEnvironment } from "types/StoreEnvironment"

const HOKSStoreModel = {
  isLoading: false,
  suunnitelmat: types.array(HOKS)
}

export const HOKSStore = types
  .model("HOKSStore", HOKSStoreModel)
  .views(self => {
    return {
      // shown as notification banners about current and upcoming demonstrations/learning periods
      get notifications() {
        return flattenDeep<SnapshotIn<typeof Notification>>(
          self.suunnitelmat.map(s => {
            return s.hankittavatTutkinnonOsat
              .filter(t => t.tutkinnonOsaKoodiUri)
              .map(to => {
                return [
                  ...(to.naytot || []).map(naytto => {
                    return {
                      hoksId: s.eid,
                      tutkinnonOsaKoodiUri: to.tutkinnonOsaKoodiUri,
                      tyyppi: "naytto",
                      alku: naytto.alku,
                      loppu: naytto.loppu,
                      paikka: naytto.ymparisto
                    }
                  }),
                  ...(to.osaamisenHankkimistavat || []).map(oh => {
                    return {
                      hoksId: s.eid,
                      tutkinnonOsaKoodiUri: to.tutkinnonOsaKoodiUri,
                      tyyppi: "tyossaoppiminen",
                      alku: oh.alku,
                      loppu: oh.loppu,
                      paikka: oh.selite
                    }
                  })
                ]
              })
          })
        )
      }
    }
  })
  .actions(self => {
    const root: IRootStore = getRoot(self)
    const { apiUrl, fetchCollection, errors, callerId } = getEnv<
      StoreEnvironment
    >(self)

    const haeSuunnitelmat = flow(function*(oid: string): any {
      self.isLoading = true
      try {
        const response: APIResponse = yield fetchCollection(
          apiUrl(`oppija/oppijat/${oid}/hoks`),
          { headers: callerId() }
        )
        self.suunnitelmat = response.data

        yield Promise.all(
          self.suunnitelmat.map(suunnitelma => {
            return suunnitelma.fetchOpiskeluoikeudet()
          })
        )

        // add computed notifications to notifications store
        root.notifications.addNotifications(self.notifications)

        self.isLoading = false
      } catch (error) {
        errors.logError(
          "HOKSStore.haeSuunnitelmat",
          `HOKSStore.haeSuunnitelmat.${error.message
            .replace(" ", "")
            .toLowerCase()}`
        )
        self.isLoading = false
      }
    })

    return { haeSuunnitelmat }
  })
