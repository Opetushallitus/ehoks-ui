import { types } from "mobx-state-tree"

const Otsikko = types.model({
  fi: types.optional(types.string, ""),
  sv: types.optional(types.string, "")
})

const Kriteeri = types.model({
  fi: types.optional(types.string, ""),
  sv: types.optional(types.string, "")
})

const OsaamistasonKriteeri = types.model({
  osaamistaso: types.optional(types.string, ""),
  kriteerit: types.array(Kriteeri)
})

const ArvioinninKohde = types.model({
  otsikko: types.maybeNull(Otsikko),
  arviointiAsteikko: types.optional(types.string, ""),
  osaamistasonKriteerit: types.array(OsaamistasonKriteeri)
})

const ArvioinninKohdealue = types.model({
  otsikko: types.optional(Otsikko, {}),
  arvioinninKohteet: types.array(ArvioinninKohde)
})

export const EPerusteetArviointi = types.model({
  id: types.optional(types.number, 0),
  arvioinninKohdealueet: types.maybeNull(types.array(ArvioinninKohdealue))
})

const EPerusteetAmmattitaitovaatimukset = types.model({
  fi: types.optional(types.string, ""),
  sv: types.optional(types.string, "")
})

const EPerusteetAmmattitaidonOsoittamistavat = types.model({
  fi: types.optional(types.string, ""),
  sv: types.optional(types.string, "")
})

export const EPerusteetNimi = types.model({
  fi: types.optional(types.string, ""),
  sv: types.optional(types.string, "")
})

export const EPerusteetVastaus = types.model("EPerusteet", {
  id: types.optional(types.number, 0),
  koodiUri: types.optional(types.string, ""),
  arviointi: types.maybeNull(EPerusteetArviointi),
  ammattitaitovaatimukset: types.maybeNull(EPerusteetAmmattitaitovaatimukset),
  ammattitaidonOsoittamistavat: types.maybeNull(
    EPerusteetAmmattitaidonOsoittamistavat
  ),
  nimi: types.optional(EPerusteetNimi, {}),
  koulutuksenOsaId: types.optional(types.string, "")
})
