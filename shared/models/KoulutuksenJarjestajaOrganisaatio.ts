import { types } from "mobx-state-tree"

export const KoulutuksenJarjestajaOrganisaatio = types.model(
  "KoulutuksenJarjestajaOrganisaatio",
  {
    oppilaitosOid: types.optional(types.string, "")
  }
)
