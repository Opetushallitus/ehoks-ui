import { inject, observer } from "mobx-react"
import React, { useEffect } from "react"
import { IRootStore } from "../stores/RootStore"
import { UiVirkailijaRaamit } from "components/UiVirkailijaRaamit"

interface RaamitProps {
  store?: IRootStore
}

export const VirkailijaRaamit = inject("store")(
  observer((props: RaamitProps) => {
    useEffect(
      () => () => {
        document.getElementById("raamit_app_root")?.remove()
      },
      []
    )

    const scriptUrl = props.store!.environment.virkailijaRaamitUrl
    return <UiVirkailijaRaamit scriptUrl={scriptUrl} />
  })
)
