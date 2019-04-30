import { types } from "mobx-state-tree"
import find from "lodash.find"

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

const Koulutusmoduuli = types.model("Koulutusmoduuli", {
  perusteenNimi: types.optional(Nimi, {}),
  perusteenDiaarinumero: types.optional(types.string, "")
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

const Oppilaitos = types.model("Oppilaitos", {
  oid: types.optional(types.string, ""),
  nimi: types.optional(Nimi, {})
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
      return find(self.suoritukset, suoritus => {
        return suoritus.suoritustapa.isAmmatillinenPerustutkinto
      })
    }
  }))
