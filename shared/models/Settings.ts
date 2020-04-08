import { types, Instance, flow, getRoot } from "mobx-state-tree"
import find from "lodash.find"

const Notification = types.model("Notification", {
  hoksId: types.optional(types.string, ""),
  tutkinnonOsaKoodiUri: types.optional(types.string, ""),
  tyyppi: types.optional(types.string, "")
})

const HiddenNotifications = types
  .model("HiddenNotifications", {
    notifications: types.array(Notification)
  })
  .actions(self => {
    const exists = (
      hoksId: string,
      tutkinnonOsaKoodiUri: string,
      tyyppi: string
    ) => {
      return find(self.notifications, hidden => {
        return (
          hidden.hoksId === hoksId &&
          hidden.tutkinnonOsaKoodiUri === tutkinnonOsaKoodiUri &&
          hidden.tyyppi === tyyppi
        )
      })
    }
    return { exists }
  })
  .actions(self => {
    const {
      session
    }: { session: { saveSettings: () => Promise<void> } } = getRoot(self)
    const hide = flow(function*(
      hoksId: string,
      tutkinnonOsaKoodiUri: string,
      tyyppi: string
    ): any {
      const exists = self.exists(hoksId, tutkinnonOsaKoodiUri, tyyppi)
      if (!exists) {
        self.notifications.push({
          hoksId,
          tutkinnonOsaKoodiUri,
          tyyppi
        })
        yield session.saveSettings()
      }
    })
    return { hide }
  })

const IntroDialog = types
  .model("IntroDialog", {
    userAcknowledgedIntroDialog: types.optional(types.boolean, false)
  })
  .actions(self => ({
    toggleUserAcknowledgementOfIntro() {
      self.userAcknowledgedIntroDialog = !self.userAcknowledgedIntroDialog
    }
  }))

export const Settings = types.model("Settings", {
  hiddenNotifications: types.optional(HiddenNotifications, {}),
  introDialog: types.optional(IntroDialog, {})
})

export type ISettings = Instance<typeof Settings>
