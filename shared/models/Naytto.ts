import { types } from "mobx-state-tree"
import { Ajankohta } from "models/Ajankohta"

export const Naytto = types.model("Naytto", {
  moduleId: types.optional(types.string, ""),
  ajankohta: types.optional(Ajankohta, {}),
  organisaatio: types.optional(types.string, ""),
  ymparisto: types.optional(types.string, ""),
  arvioijat: types.array(types.string),
  tyotehtavat: types.array(types.string)
})
