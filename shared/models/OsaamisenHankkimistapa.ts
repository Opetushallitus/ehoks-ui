import { types } from "mobx-state-tree"
import { Oppilaitoshenkilo } from "./Oppilaitoshenkilo"
import { TyopaikallaJarjestettavaKoulutus } from "./TyopaikallaJarjestettavaKoulutus"
import { MuuOppimisymparisto } from "./MuuOppimisymparisto"
import { Keskeytymisajanjakso } from "./Keskeytymisajanjakso"
import { KoodistoVastaus } from "models/KoodistoVastaus"
import { EnrichKoodistoKoodiUri } from "./Enrichment/EnrichKoodistoKoodiUri"

export enum OsaamisenHankkimistapaType {
  Workplace = "WORKPLACE",
  Other = "OTHER"
}

const Model = types.model("OsaamisenHankkimistapaModel", {
  id: types.optional(types.number, 0),
  moduleId: types.maybe(types.string),
  hankkijanEdustaja: types.maybe(Oppilaitoshenkilo),
  tyopaikallaJarjestettavaKoulutus: types.maybe(
    TyopaikallaJarjestettavaKoulutus
  ),
  osaamisenHankkimistapaKoodiUri: types.optional(types.string, ""),
  osaamisenHankkimistapa: types.optional(KoodistoVastaus, {}),
  jarjestajanEdustaja: types.maybe(Oppilaitoshenkilo),
  ajanjaksonTarkenne: types.optional(types.string, ""),
  alku: types.optional(types.string, ""),
  muutOppimisymparistot: types.array(MuuOppimisymparisto),
  loppu: types.optional(types.string, ""),
  osaAikaisuustieto: types.maybe(types.number),
  oppisopimuksenPerustaKoodiUri: types.maybe(types.string),
  oppisopimuksenPerusta: types.optional(KoodistoVastaus, {}),
  keskeytymisajanjaksot: types.array(Keskeytymisajanjakso)
})

export const OsaamisenHankkimistapa = types
  .compose(
    "OsaamisenHankkimistapa",
    EnrichKoodistoKoodiUri({
      enrichedProperty: "osaamisenHankkimistapa",
      koodiUriProperty: "osaamisenHankkimistapaKoodiUri"
    }),
    EnrichKoodistoKoodiUri({
      enrichedProperty: "oppisopimuksenPerusta",
      koodiUriProperty: "oppisopimuksenPerustaKoodiUri"
    }),
    Model
  )
  .views((self) => ({
    get selite() {
      return self.tyyppi === OsaamisenHankkimistapaType.Workplace
        ? self.tyopaikallaJarjestettavaKoulutus?.tyopaikanNimi
        : ""
    },
    get workplaceSelite() {
      if (
        self.tyyppi !== OsaamisenHankkimistapaType.Workplace ||
        !self.tyopaikallaJarjestettavaKoulutus
      ) {
        return ""
      }

      return [
        self.tyopaikallaJarjestettavaKoulutus.tyopaikanNimi,
        self.tyopaikallaJarjestettavaKoulutus.tyopaikanYTunnus
      ]
        .filter(Boolean)
        .join(", ")
    },
    get tyyppi() {
      return self.osaamisenHankkimistapaKoodiUri.includes("koulutussopimus") ||
        self.osaamisenHankkimistapaKoodiUri.includes("oppisopimus")
        ? OsaamisenHankkimistapaType.Workplace
        : OsaamisenHankkimistapaType.Other
    }
  }))
