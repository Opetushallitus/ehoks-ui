import { getRoot, Instance, types } from "mobx-state-tree"
import { LanguageVersion } from "models/LanguageVersion"
import { IRootStore } from "stores/RootStore"
import { getEnvironment, getTranslations } from "utils"

export const PerusteNimi = types.model("PerusteNimi", {
  nimi: LanguageVersion
})

export const Peruste = types
  .model("Peruste", {
    id: types.number,
    nimi: LanguageVersion,
    osaamisalat: types.array(PerusteNimi),
    tutkintonimikkeet: types.array(PerusteNimi)
  })
  .views(self => {
    const root = getRoot<IRootStore>(self)
    const activeLocale = () => getTranslations(root).activeLocale
    return {
      get title(): string {
        return self.nimi[activeLocale()]
      },
      get qualificationTitles(): string[] {
        return self.tutkintonimikkeet.map(tn => tn.nimi[activeLocale()])
      },
      get competenceAreas(): string[] {
        return self.osaamisalat.map(oa => oa.nimi[activeLocale()])
      },
      get link(): string {
        const urlPrefix = getEnvironment(root).eperusteetPerusteUrl
        return `${urlPrefix}/#/fi/esitys/${self.id}/naytto/tiedot`
      }
    }
  })

export interface IPeruste extends Instance<typeof Peruste> {}
