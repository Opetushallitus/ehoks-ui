import { Instance, types } from "mobx-state-tree"

export const Keskeytymisajanjakso = types.model("Keskeytymisajanjakso", {
  alku: types.optional(types.string, ""),
  loppu: types.optional(types.string, "")
})

export type IKeskeytymisajanjakso = Instance<typeof Keskeytymisajanjakso>
