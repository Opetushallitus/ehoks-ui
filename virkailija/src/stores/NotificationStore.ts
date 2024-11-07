import { Instance, SnapshotOrInstance, types, getEnv } from "mobx-state-tree"
import { StoreEnvironment } from "types/StoreEnvironment"

const NotificationTypes = types.union(
  types.literal("success"),
  types.literal("question"),
  types.literal("error"),
  types.literal("warning"),
  types.literal("alert")
)

export const Notification = types
  .model("Notification", {
    tyyppi: types.optional(NotificationTypes, "success"),
    visible: types.optional(types.boolean, true),
    default: types.optional(types.string, ""), // Default message
    title: types.optional(types.string, ""), // käännösavain
    source: types.optional(types.string, ""), // notifikaation lähde
    sahkoposti: types.optional(types.string, "")
  })
  .views(self => ({
    get message() {
      return {
        title: self.title,
        type: self.tyyppi,
        default: self.default,
        values: { sahkoposti: self.sahkoposti }
      }
    }
  }))
  .actions(self => {
    const hide = () => {
      self.visible = false
    }

    return { hide }
  })

export const NotificationStore = types
  .model("NotificationStore", {
    notifications: types.array(Notification)
  })
  .actions(self => {
    const { errors } = getEnv<StoreEnvironment>(self)

    const addNotifications = (
      notifications: SnapshotOrInstance<typeof Notification>[]
    ) => {
      self.notifications.replace([
        ...self.notifications,
        ...notifications
      ] as any)
    }

    const addError = (id: string, errorText?: string) =>
      errors.logError(id, errorText)

    const removeNotificationsBySource = (source: "Opiskelijapalaute") => {
      self.notifications.replace(
        self.notifications.filter(n => n.source !== source)
      )
    }

    return {
      addNotifications,
      removeNotificationsBySource,
      addError,
      markAllErrorsHandled: errors.markAllErrorsHandled
    }
  })
  .views(self => ({
    get visible() {
      return self.notifications.filter(notification => notification.visible)
    }
  }))

export type INotificationStore = Instance<typeof NotificationStore>
