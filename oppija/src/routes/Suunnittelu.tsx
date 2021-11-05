import { RouteComponentProps, Router } from "@reach/router"
import { LoadingSpinner } from "components/LoadingSpinner"
import { comparer, IReactionDisposer, reaction } from "mobx"
import { inject, observer } from "mobx-react"
import React from "react"
import { OmienOpintojenSuunnittelu } from "routes/OmienOpintojenSuunnittelu"
import { IntroModalDialog } from "routes/Suunnittelu/IntroModalDialog"
import { ValitseHOKS } from "routes/Suunnittelu/ValitseHOKS"
import { IRootStore } from "stores/RootStore"
import styled from "styled"
import { StudentFeedbackModal } from "./Suunnittelu/StudentFeedbackModal"

const LoadingContainer = styled("div")`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 300px;
`

interface SuunnitteluProps extends RouteComponentProps {
  store?: IRootStore
  /* From router path */
  "*"?: string
}

interface SuunnitteluState {
  allLoaded: boolean
}

@inject("store")
@observer
export class Suunnittelu extends React.Component<
  SuunnitteluProps & RouteComponentProps,
  SuunnitteluState
> {
  state: SuunnitteluState = {
    allLoaded: false
  }
  disposeLoginReaction: IReactionDisposer

  componentDidMount() {
    const { store } = this.props
    const { session } = store!

    this.disposeLoginReaction = reaction(
      () => ({ isLoggedIn: session.isLoggedIn }),
      async ({ isLoggedIn }) => {
        // navigate to Opintopolku logout url after logging out
        if (isLoggedIn) {
          // ensure that SessionStore's checkSession call has finished
          await store!.session.fetchSettings()
          if (session.user) {
            await store!.hoks.haeSuunnitelmat(session.user.oid)
            await store!.notifications.haeOpiskelijapalautelinkit(
              session.user.oid
            )
          } else {
            throw new Error(`Session user not defined`)
          }

          this.setState({ allLoaded: true })
        }
      },
      { fireImmediately: true, equals: comparer.structural }
    )
  }

  componentWillUnmount() {
    this.disposeLoginReaction()
  }

  render() {
    const { notifications, hoks, session } = this.props.store!

    if (!this.state.allLoaded) {
      return (
        <LoadingContainer>
          <LoadingSpinner />
        </LoadingContainer>
      )
    }

    return (
      <>
        <IntroModalDialog />
        <StudentFeedbackModal
          studentFeedbackLinks={notifications.studentFeedbackLinks}
        />
        <Router basepath={`/ehoks/suunnittelu`}>
          <ValitseHOKS path="/" suunnitelmat={hoks.suunnitelmat} />
          <OmienOpintojenSuunnittelu
            path=":id/*"
            student={session.user}
            suunnitelmat={hoks.suunnitelmat}
          />
        </Router>
      </>
    )
  }
}
