import format from "date-fns/format"
import parseISO from "date-fns/parseISO"
import { types } from "mobx-state-tree"
import { Ajankohta } from "models/Ajankohta"

const Organisaatio = types.model({
  nimi: types.optional(types.string, "")
})

export const Oppija = types
  .model("Oppija", {
    nimi: types.optional(types.string, ""),
    tutkinnonOsa: types.optional(
      types.model({
        nimi: types.optional(types.string, ""),
        laajuus: types.optional(types.number, 0)
      }),
      {}
    ),
    tutkinto: types.optional(
      types.model({
        nimi: types.optional(types.string, ""),
        laajuus: types.optional(types.number, 0),
        suunnitelma: types.optional(types.string, "")
      }),
      {}
    ),
    osaamisenHankkimistapa: types.optional(
      types.model({
        ajankohta: types.optional(Ajankohta, {}),
        tyopaikallaHankittavaOsaaminen: types.optional(
          types.model({
            jarjestajanEdustaja: types.optional(
              types.model({ organisaatio: types.optional(Organisaatio, {}) }),
              {}
            ),
            vastuullinenOhjaaja: types.optional(
              types.model({
                organisaatio: types.optional(Organisaatio, {}),
                nimi: types.optional(types.string, "")
              }),
              {}
            ),
            keskeisetTyotehtavat: types.array(types.string)
          }),
          {}
        )
      }),
      {}
    ),
    hankitunOsaamisenNaytto: types.optional(
      types.model({
        ajankohta: types.optional(Ajankohta, {}),
        jarjestaja: types.optional(Organisaatio, {}),
        nayttoYmparisto: types.optional(Organisaatio, {}),
        arvioijat: types.array(
          types.model({
            nimi: types.optional(types.string, "")
          })
        ),
        yksilollisetArviointikriteerit: types.array(
          types.model({
            kuvaus: types.optional(types.string, "")
          })
        )
      }),
      {}
    ),
    ammattitaitovaatimukset: types.array(
      types.model({
        kuvaus: types.optional(types.string, ""),
        kriteerit: types.array(
          types.model({
            kuvaus: types.optional(types.string, ""),
            kriteerit: types.array(types.string)
          })
        )
      })
    )
  })
  .views(self => {
    return {
      get tutkinnonOsanOtsikko() {
        return `${self.tutkinnonOsa.nimi} ${self.tutkinnonOsa.laajuus}`
      },
      get naytot() {
        const { hankitunOsaamisenNaytto: naytto } = self
        return [
          {
            ajankohta: {
              alku: naytto.ajankohta.alku,
              loppu: naytto.ajankohta.loppu
            },
            organisaatio: naytto.jarjestaja.nimi,
            ymparisto: naytto.nayttoYmparisto.nimi,
            arvioijat: naytto.arvioijat.map(a => a.nimi),
            tyotehtavat: naytto.yksilollisetArviointikriteerit.map(
              k => k.kuvaus
            )
          }
        ]
      },
      get ajankohta() {
        if (
          !self.osaamisenHankkimistapa.ajankohta.alku ||
          !self.osaamisenHankkimistapa.ajankohta.loppu
        ) {
          return ""
        }
        return [
          format(parseISO(self.osaamisenHankkimistapa.ajankohta.alku), "d.M."),
          format(
            parseISO(self.osaamisenHankkimistapa.ajankohta.loppu),
            "d.M.yyyy"
          )
        ].join("-")
      },
      get oppijanOtsikko() {
        return `${self.nimi}, ${
          self.osaamisenHankkimistapa.tyopaikallaHankittavaOsaaminen
            .jarjestajanEdustaja.organisaatio.nimi
        } ${this.ajankohta}`
      },
      get harjoittelujaksot() {
        const {
          osaamisenHankkimistapa: { ajankohta, tyopaikallaHankittavaOsaaminen }
        } = self
        return [
          {
            ajankohta: { alku: ajankohta.alku, loppu: ajankohta.loppu },
            ohjaaja: tyopaikallaHankittavaOsaaminen.vastuullinenOhjaaja.nimi,
            tyotehtavat: tyopaikallaHankittavaOsaaminen.keskeisetTyotehtavat.map(
              t => t
            )
          }
        ]
      }
    }
  })
