import { types } from "mobx-state-tree"
import { KoodiMetadata } from "./KoodiMetadata"

export const KoodistoKoodi = types
  .model("KoodistoKoodi", {
    versio: types.optional(types.number, 0),
    koodiArvo: types.optional(types.string, ""),
    koodiUri: types.optional(types.string, ""),
    metadata: types.array(KoodiMetadata)
  })
  .views(self => {
    return {
      get nimi() {
        return self.metadata[0] ? self.metadata[0].nimi : ""
      }
    }
  })
