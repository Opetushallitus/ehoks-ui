import { Instance, types, getRoot, SnapshotOrInstance } from "mobx-state-tree"
import { EnrichKoodiUri } from "models/EnrichKoodiUri"
import { EPerusteetVastaus } from "models/EPerusteetVastaus"
import { LocaleRoot } from "models/helpers/LocaleRoot"
import parseISO from "date-fns/parseISO"
import subMonths from "date-fns/subMonths"
import isWithinInterval from "date-fns/isWithinInterval"
import { ISettings } from "models/Settings"
import find from "lodash.find"

export type ShareType = "naytto" | "tyossaoppiminen"

export const NotificationModel = types.model("NotificationModel", {
  hoksId: types.optional(types.string, ""),
  tutkinnonOsaKoodiUri: types.optional(types.string, ""),
  tutkinnonOsa: types.optional(EPerusteetVastaus, {}),
  tyyppi: types.optional(types.string, ""), // naytto, tyossaoppiminen
  alku: types.optional(types.string, ""),
  loppu: types.optional(types.string, ""),
  paikka: types.optional(types.string, ""),
  visible: types.optional(types.boolean, true)
})

export const Notification = types
  .compose(
    "Notification",
    EnrichKoodiUri,
    NotificationModel
  )
  .views(self => {
    const root: LocaleRoot = getRoot(self)
    return {
      get message() {
        return {
          hoksId: self.hoksId,
          koodiUri: self.tutkinnonOsaKoodiUri,
          title: self.tutkinnonOsa.nimi[root.translations.activeLocale],
          type: self.tyyppi,
          location: self.paikka,
          startDate: self.alku,
          endDate: self.loppu
        }
      }
    }
  })
  .actions(self => {
    const root: {
      session: { settings: ISettings; saveSettings: any }
    } = getRoot(self)

    const ackNotification = function() {
      root.session.settings.hiddenNotifications.hide(
        self.hoksId,
        self.tutkinnonOsaKoodiUri,
        self.tyyppi
      )
    }

    const hide = () => {
      self.visible = false
    }
    return { ackNotification, hide }
  })

export const NotificationStore = types
  .model("NotificationStore", {
    isLoading: types.optional(types.boolean, false),
    notifications: types.array(Notification)
  })
  .actions(self => {
    const addNotifications = (
      notifications: Array<SnapshotOrInstance<typeof Notification>>
    ) => {
      self.notifications.replace([
        ...self.notifications,
        ...notifications
      ] as any)
    }

    return { addNotifications }
  })
  .views(self => {
    const {
      session: { settings }
    }: { session: { settings: ISettings } } = getRoot(self)
    return {
      get retainedNotifications() {
        return self.notifications.filter(notification => {
          // NOTE: investigate why settings.hiddenNotifications.exists
          // is not reactive here (does not trigger re-render)
          return !find(
            settings.hiddenNotifications.notifications,
            hiddenNotification => {
              return (
                hiddenNotification.hoksId === notification.hoksId &&
                hiddenNotification.tutkinnonOsaKoodiUri ===
                  notification.tutkinnonOsaKoodiUri &&
                hiddenNotification.tyyppi === notification.tyyppi
              )
            }
          )
        })
      }
    }
  })
  .views(self => {
    return {
      get visible() {
        return self.retainedNotifications.filter(notification => {
          const notificationInterval = {
            start: subMonths(parseISO(notification.alku), 1),
            end: parseISO(notification.loppu)
          }
          return (
            notification.visible &&
            isWithinInterval(new Date(), notificationInterval)
          )
        })
      }
    }
  })

export interface INotificationStore
  extends Instance<typeof NotificationStore> {}
