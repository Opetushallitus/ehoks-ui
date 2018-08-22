import { Link, RouteComponentProps } from "@reach/router"
import { inject, observer } from "mobx-react"
import { Instance } from "mobx-state-tree"
import { LearningPeriod } from "models/LearningPeriod"
import * as React from "react"
import { RootStore } from "../models/RootStore"

export interface LearningPeriodsProps {
  store?: Instance<typeof RootStore>
}

@inject("store")
@observer
export class LearningPeriods extends React.Component<
  LearningPeriodsProps & RouteComponentProps
> {
  componentDidMount() {
    // this.props.store.fetchLearningPeriods()
  }

  render() {
    const { store } = this.props
    const { learningPeriods } = store
    return (
      <div>
        <h1>Työpaikalla</h1>

        <ul>
          {learningPeriods.map(
            (learningPeriod: Instance<typeof LearningPeriod>) => {
              return <li key={learningPeriod.id}>{learningPeriod.title}</li>
            }
          )}
        </ul>
        <Link to="/">Etusivulle</Link>
      </div>
    )
  }
}
