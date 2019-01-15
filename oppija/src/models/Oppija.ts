import format from "date-fns/format"
import parseISO from "date-fns/parseISO"
import { types } from "mobx-state-tree"

const Ajankohta = types.model({
  alku: types.optional(types.string, ""),
  loppu: types.optional(types.string, "")
})

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
        arviointikriteerit: types.array(
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
      get naytonTiedot() {
        const { hankitunOsaamisenNaytto: naytto } = self
        return [
          {
            period: [naytto.ajankohta.alku, naytto.ajankohta.loppu],
            organisation: naytto.jarjestaja.nimi,
            environment: naytto.nayttoYmparisto.nimi,
            assessors: naytto.arvioijat.map(a => a.nimi),
            assignments: naytto.yksilollisetArviointikriteerit.map(
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
      get oppimisjaksot() {
        const {
          osaamisenHankkimistapa: { ajankohta, tyopaikallaHankittavaOsaaminen }
        } = self
        return [
          {
            period: [ajankohta.alku, ajankohta.loppu],
            instructor: tyopaikallaHankittavaOsaaminen.vastuullinenOhjaaja.nimi,
            assignments: tyopaikallaHankittavaOsaaminen.keskeisetTyotehtavat.map(
              t => t
            )
          }
        ]
      }
    }
  })
