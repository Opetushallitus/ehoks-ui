import {
  flow,
  getEnv,
  getRoot,
  Instance,
  SnapshotOrInstance,
  types
} from "mobx-state-tree"
import { EPerusteetVastaus } from "models/EPerusteetVastaus"
import { LocaleRoot } from "models/helpers/LocaleRoot"
import parseISO from "date-fns/parseISO"
import subMonths from "date-fns/subMonths"
import isWithinInterval from "date-fns/isWithinInterval"
import { ISettings } from "models/Settings"
import find from "lodash.find"
import { StoreEnvironment } from "types/StoreEnvironment"
import { APIResponse } from "types/APIResponse"
import { EnrichTutkinnonOsaKoodiUri } from "models/Enrichment/EnrichTutkinnonOsaKoodiUri"

export const NotificationModel = types.model("NotificationModel", {
  hoksId: types.optional(types.string, ""),
  tutkinnonOsaKoodiUri: types.optional(types.string, ""),
  tutkinnonOsa: types.optional(EPerusteetVastaus, {}),
  tyyppi: types.optional(types.string, ""), // naytto, tyossaoppiminen
  alku: types.optional(types.string, ""),
  loppu: types.optional(types.string, ""),
  paikka: types.optional(types.string, ""),
  visible: types.optional(types.boolean, true),
  moduleId: types.optional(types.string, "")
})

export const Notification = types
  .compose("Notification", EnrichTutkinnonOsaKoodiUri, NotificationModel)
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
    notifications: types.array(Notification),
    studentFeedbackLinks: types.array(types.string)
  })
  .volatile(() => ({
    showFeedbackModal: true
  }))
  .actions(self => {
    const addNotifications = (
      notifications: SnapshotOrInstance<typeof Notification>[]
    ) => {
      self.notifications.replace([
        ...self.notifications,
        ...notifications
      ] as any)
    }

    return { addNotifications }
  })
  .actions(self => {
    const { apiUrl, fetchPrimitiveCollection, errors, callerId } = getEnv<
      StoreEnvironment
    >(self)

    const hideFeedbackModal = () => {
      self.showFeedbackModal = false
    }

    const makeFeedbackModalVisible = () => {
      self.showFeedbackModal = true
    }

    const haeOpiskelijapalautelinkit = flow(function*(oid: string): any {
      try {
        const response: APIResponse = yield fetchPrimitiveCollection(
          apiUrl(`oppija/oppijat/${oid}/kyselylinkit`),
          { headers: callerId() }
        )

        self.studentFeedbackLinks = response.data
      } catch (error) {
        errors.logError(
          "errors.NotificationStore.haeOpiskelijapalautelinkit",
          error.message
        )
      }
    })

    const removeOpiskelijapalautelinkki = (feedbackLinkToRemove: string) => {
      self.studentFeedbackLinks.remove(feedbackLinkToRemove)
    }

    return {
      haeOpiskelijapalautelinkit,
      removeOpiskelijapalautelinkki,
      hideFeedbackModal,
      makeFeedbackModalVisible
    }
  })
  .views(self => {
    const {
      session: { settings }
    }: { session: { settings: ISettings } } = getRoot(self)
    return {
      get retainedNotifications() {
        return self.notifications.filter(
          notification =>
            // NOTE: investigate why settings.hiddenNotifications.exists
            // is not reactive here (does not trigger re-render)
            !find(
              settings.hiddenNotifications.notifications,
              hiddenNotification =>
                hiddenNotification.hoksId === notification.hoksId &&
                hiddenNotification.tutkinnonOsaKoodiUri ===
                  notification.tutkinnonOsaKoodiUri &&
                hiddenNotification.tyyppi === notification.tyyppi
            )
        )
      }
    }
  })
  .views(self => ({
    get hasUnanswaredFeedbackLinks() {
      return Boolean(self.studentFeedbackLinks?.length)
    },

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
  }))

export type INotificationStore = Instance<typeof NotificationStore>
