import { Instance } from "mobx-state-tree"
import { HOKS } from "models/HOKS"

export interface MockStudent {
  oid: string
  nimi: string
  tutkinto: string
  osaamisala: string
  hyvaksytty?: string
  paivitetty?: string
  lukumaara?: number
  suunnitelmat?: Array<Instance<typeof HOKS>>
}
