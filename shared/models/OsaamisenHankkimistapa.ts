import { types } from "mobx-state-tree"
import { Oppilaitoshenkilo } from "./Oppilaitoshenkilo"
import { TyopaikallaJarjestettavaKoulutus } from "./TyopaikallaJarjestettavaKoulutus"
import { MuuOppimisymparisto } from "./MuuOppimisymparisto"
import { EnrichKoodiUri } from "models/EnrichKoodiUri"
import { KoodistoVastaus } from "models/KoodistoVastaus"

export enum OsaamisenHankkimistapaType {
  Workplace = "WORKPLACE",
  Other = "OTHER"
}

const Model = types.model("OsaamisenHankkimistapaModel", {
  id: types.optional(types.number, 0),
  hankkijanEdustaja: types.optional(Oppilaitoshenkilo, {}),
  tyopaikallaJarjestettavaKoulutus: types.optional(
    TyopaikallaJarjestettavaKoulutus,
    {}
  ),
  osaamisenHankkimistapaKoodiUri: types.optional(types.string, ""),
  osaamisenHankkimistapa: types.optional(KoodistoVastaus, {}),
  jarjestajanEdustaja: types.optional(Oppilaitoshenkilo, {}),
  ajanjaksonTarkenne: types.optional(types.string, ""),
  alku: types.optional(types.string, ""),
  muutOppimisymparistot: types.array(MuuOppimisymparisto),
  loppu: types.optional(types.string, "")
})

export const OsaamisenHankkimistapa = types
  .compose("OsaamisenHankkimistapa", EnrichKoodiUri, Model)
  .views(self => {
    return {
      get selite() {
        return self.tyyppi === OsaamisenHankkimistapaType.Workplace
          ? self.tyopaikallaJarjestettavaKoulutus.tyopaikanNimi
          : ""
      },
      get workplaceSelite() {
        return self.tyyppi === OsaamisenHankkimistapaType.Workplace
          ? `${self.tyopaikallaJarjestettavaKoulutus.tyopaikanNimi}, ${self.tyopaikallaJarjestettavaKoulutus.tyopaikanYTunnus}`
          : ""
      },
      get tyyppi(): OsaamisenHankkimistapaType {
        return self.osaamisenHankkimistapaKoodiUri.includes(
          "koulutussopimus"
        ) || self.osaamisenHankkimistapaKoodiUri.includes("oppisopimus")
          ? OsaamisenHankkimistapaType.Workplace
          : OsaamisenHankkimistapaType.Other
      }
    }
  })
