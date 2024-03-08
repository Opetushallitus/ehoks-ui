import { types } from "mobx-state-tree"

const EPerusteetText = types.model("EPerusteetText", {
  fi: types.optional(types.string, ""),
  sv: types.optional(types.string, "")
})

const defaultText = { fi: "", sv: "" }

const OsaamistasonKriteeri = types
  .model("OsaamistasonKriteeri", {
    osaamistaso: types.optional(types.string, ""),
    kriteerit: types.array(EPerusteetText)
  })
  .preProcessSnapshot(sn => ({
    ...sn,
    osaamistaso:
      typeof sn.osaamistaso === "string"
        ? sn.osaamistaso
        : typeof sn.osaamistaso === "object" && sn.osaamistaso
        ? // the syntax is needed because of a bug in typescript
          // https://github.com/microsoft/TypeScript/issues/42999
          /* eslint dot-notation: "off" */
          sn.osaamistaso["koodi"]["arvo"] || "" + sn.osaamistaso["id"]
        : ""
  }))

const ArvioinninKohde = types
  .model("ArvioinninKohde", {
    otsikko: types.optional(types.maybeNull(EPerusteetText), defaultText),
    arviointiAsteikko: types.optional(types.string, ""),
    osaamistasonKriteerit: types.array(OsaamistasonKriteeri)
  })
  .preProcessSnapshot(sn => ({
    ...sn,
    arviointiAsteikko:
      typeof sn.arviointiAsteikko === "string"
        ? sn.arviointiAsteikko
        : typeof sn.arviointiAsteikko === "object" && sn.arviointiAsteikko
        ? // the syntax is needed because of a bug in typescript
          // https://github.com/microsoft/TypeScript/issues/42999
          /* eslint dot-notation: "off" */
          "" + sn.arviointiAsteikko["id"]
        : ""
  }))

const ArvioinninKohdealue = types.model("ArvioinninKohdealue", {
  otsikko: types.optional(EPerusteetText, defaultText),
  arvioinninKohteet: types.array(ArvioinninKohde)
})

export const EPerusteetArviointi = types.model("EPerusteetArviointi", {
  id: types.optional(types.number, 0),
  arvioinninKohdealueet: types.maybeNull(types.array(ArvioinninKohdealue))
})

export const EPerusteetNimi = EPerusteetText

export const EPerusteKoodi = types.model("EPerusteKoodi", {
  nimi: types.optional(EPerusteetNimi, defaultText)
})

export const EPerusteetVastaus = types.model("EPerusteet", {
  id: types.optional(types.number, 0),
  koodiUri: types.optional(types.string, ""),
  arviointi: types.maybeNull(EPerusteetArviointi),
  ammattitaitovaatimukset: types.optional(EPerusteetText, defaultText),
  ammattitaidonOsoittamistavat: types.optional(EPerusteetText, defaultText),
  nimi: types.optional(EPerusteetNimi, defaultText),
  koodi: types.optional(EPerusteKoodi, { nimi: defaultText }),
  koulutuksenOsaViiteId: types.optional(types.number, 0),
  muokattu: types.optional(types.number, 0)
})
