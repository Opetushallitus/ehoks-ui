import { types, getRoot } from "mobx-state-tree"
import find from "lodash.find"
import { LocaleRoot } from "models/helpers/LocaleRoot"

const Suoritustapa = types
  .model("Suoritustapa", {
    koodiarvo: types.optional(types.string, "")
  })
  .views(self => ({
    get isAmmatillinenPerustutkinto() {
      return self.koodiarvo === "ops"
    }
  }))

const Nimi = types.model("Nimi", {
  fi: types.optional(types.string, ""),
  sv: types.optional(types.string, "")
})

const Tunniste = types.model("Tunniste", {
  nimi: types.optional(Nimi, {})
})

const Koulutusmoduuli = types
  .model("Koulutusmoduuli", {
    perusteenNimi: types.optional(Nimi, {}),
    tunniste: types.optional(Tunniste, {}),
    perusteenDiaarinumero: types.optional(types.string, "")
  })
  .views(self => {
    const root: LocaleRoot = getRoot(self)

    return {
      get nimi() {
        return (
          self.perusteenNimi[root.translations.activeLocale] ||
          self.tunniste.nimi[root.translations.activeLocale] ||
          ""
        )
      }
    }
  })

const Tutkintonimike = types.model("Tutkintonimike", {
  nimi: types.optional(Nimi, {})
})

const Vahvistus = types.model("Vahvistus", {
  paiva: types.optional(types.string, "")
})

const Osaamisala = types.model("Osaamisala", {
  osaamisala: types.optional(
    types.model({
      nimi: types.optional(Nimi, {})
    }),
    {}
  )
})

const Suoritus = types.model("Suoritus", {
  oid: types.optional(types.string, ""),
  vahvistus: types.optional(Vahvistus, {}),
  osaamisala: types.array(Osaamisala),
  koulutusmoduuli: types.optional(Koulutusmoduuli, {}),
  tutkintonimike: types.array(Tutkintonimike),
  suoritustapa: types.optional(Suoritustapa, {})
})

const Oppilaitos = types
  .model("Oppilaitos", {
    oid: types.optional(types.string, ""),
    nimi: types.optional(Nimi, {})
  })
  .views(self => {
    const root: LocaleRoot = getRoot(self)

    return {
      get oppilaitosNimi() {
        return self.nimi[root.translations.activeLocale] || ""
      }
    }
  })

export const Opiskeluoikeus = types
  .model("Opiskeluoikeus", {
    oid: types.optional(types.string, ""),
    oppilaitos: types.optional(Oppilaitos, {}),
    suoritukset: types.array(Suoritus),
    aikaleima: types.optional(types.string, ""),
    alkamispaiva: types.optional(types.string, ""),
    paattymispaiva: types.optional(types.string, ""),
    arvioituPaattymispaiva: types.optional(types.string, "")
  })
  .views(self => ({
    get perustutkinto() {
      return find(
        self.suoritukset,
        suoritus => suoritus.suoritustapa.isAmmatillinenPerustutkinto
      )
    },
    get oppilaitosNimi() {
      return self.oppilaitos.oppilaitosNimi
    }
  }))
