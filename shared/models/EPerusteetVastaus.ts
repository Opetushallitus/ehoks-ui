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
  otsikko: types.optional(Otsikko, {}),
  arviointiAsteikko: types.optional(types.string, ""),
  osaamistasonKriteerit: types.array(OsaamistasonKriteeri)
})

const ArvioinninKohdealue = types.model({
  otsikko: types.optional(Otsikko, {}),
  arvioinninKohteet: types.array(ArvioinninKohde)
})

const EPerusteetArviointi = types.model({
  id: types.optional(types.number, 0),
  arvioinninKohdealueet: types.array(ArvioinninKohdealue)
})

const EPerusteetAmmattitaitovaatimukset = types.model({
  fi: types.optional(types.string, ""),
  sv: types.optional(types.string, "")
})

const EPerusteetAmmattitaidonOsoittamistavat = types.model({
  fi: types.optional(types.string, ""),
  sv: types.optional(types.string, "")
})

const EPerusteetNimi = types.model({
  fi: types.optional(types.string, ""),
  sv: types.optional(types.string, "")
})

export const EPerusteetVastaus = types.model("EPerusteet", {
  id: types.optional(types.number, 0),
  koodiUri: types.optional(types.string, ""),
  arviointi: types.optional(EPerusteetArviointi, {}),
  ammattitaitovaatimukset: types.optional(
    EPerusteetAmmattitaitovaatimukset,
    {}
  ),
  ammattitaidonOsoittamistavat: types.optional(
    EPerusteetAmmattitaidonOsoittamistavat,
    {}
  ),
  nimi: types.optional(EPerusteetNimi, {})
})
