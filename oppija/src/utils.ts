import { IEnvironmentStore } from "stores/EnvironmentStore"
import { InjectedStores, IRootStore } from "stores/RootStore"
import { ITranslationStore } from "stores/TranslationStore"

export const injectSession = (stores: InjectedStores) => ({
  session: stores.store.session
})

export const getTranslations = (root: IRootStore): ITranslationStore => {
  return root.translations
}

export const getEnvironment = (root: IRootStore): IEnvironmentStore => {
  return root.environment
}
