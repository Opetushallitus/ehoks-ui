import UiVirkailijaRaamit from "@opetushallitus/virkailija-ui-components/VirkailijaRaamit"
import { inject, observer } from "mobx-react"
import React from "react"
import { IRootStore } from "../stores/RootStore";

interface RaamitProps {
  store?: IRootStore
}

@inject("store")
@observer
export class VirkailijaRaamit extends React.Component<RaamitProps> {
  render() {
    const scriptUrl = this.props.store!.environment.virkailijaRaamitUrl
    return <UiVirkailijaRaamit scriptUrl={scriptUrl} />
  }
}
