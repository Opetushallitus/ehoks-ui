import { Routes, Route } from "react-router"
import { LoadingSpinner } from "components/LoadingSpinner"
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
}

interface SuunnitteluState {
  allLoaded: boolean
}

export const Suunnittelu = inject("store")(
  observer((props: SuunnitteluProps) => {
    const [state, setState] = useState<SuunnitteluState>({
      allLoaded: false
    })
    const { notifications, hoks, session } = props.store!

    useEffect(() => {
      if (session.isLoggedIn) {
        const asyncEffect = async () => {
          await session.fetchSettings()
          if (session.user) {
            await hoks.haeSuunnitelmat(session.user.oid)
            await notifications.haeOpiskelijapalautelinkit(session.user.oid)
          } else {
            throw new Error(`Session user not defined`)
          }

          setState({ allLoaded: true })
        }
        asyncEffect()
      }
    }, [session, hoks, notifications, session.isLoggedIn])

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
            index
            element={<ValitseHOKS suunnitelmat={hoks.suunnitelmat} />}
          />
          <Route
            path=":id/*"
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
