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
  loppu: types.optional(types.string, "")
})

export const OsaamisenHankkimistapa = types
  .compose("OsaamisenHankkimistapa", EnrichKoodiUri, Model)
  .views(self => ({
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
