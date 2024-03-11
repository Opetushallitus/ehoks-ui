import { Routes, Route } from "react-router"
import { LoadingSpinner } from "components/LoadingSpinner"
import { comparer, reaction } from "mobx"
import { inject, observer } from "mobx-react"
import React, { useState, useEffect } from "react"
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

interface SuunnitteluProps {
  store?: IRootStore
  /* From router path */
  "*"?: string
}

interface SuunnitteluState {
  allLoaded: boolean
}

export const Suunnittelu = inject("store")(
  observer((props: SuunnitteluProps) => {
    const [state, setState] = useState<SuunnitteluState>({
      allLoaded: false
    })
    useEffect(() => {
      const { store } = props
      const { session } = store!
      return () => {
        reaction(
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

              setState({ allLoaded: true })
            }
          },
          { fireImmediately: true, equals: comparer.structural }
        )
      }
    }, [])

    const { notifications, hoks, session } = props.store!

    if (!state.allLoaded) {
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
        <Routes>
          <Route
            path="/ehoks/suunnittelu/"
            element={<ValitseHOKS suunnitelmat={hoks.suunnitelmat} />}
          />
          <Route
            path="/ehoks/suunnittelu/:id/*"
            element={
              <OmienOpintojenSuunnittelu
                student={session.user}
                suunnitelmat={hoks.suunnitelmat}
              />
            }
          />
        </Routes>
      </>
    )
  })
)
