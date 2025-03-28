import { Button } from "components/Button"
import { inject, observer } from "mobx-react"
import * as React from "react"
import { FormattedMessage } from "react-intl"
import Modal from "react-modal"
import styled from "../../../../shared/styled"
import { IRootStore } from "../../stores/RootStore"
import { INotificationStore } from "../../stores/NotificationStore"

const StudentFeedbackTitle = styled("h1")``

const StudentFeedbackTextContainer = styled("p")`
  font-size: 17px;
  margin: 0 auto 20px auto;

  @media screen and (min-width: ${props => props.theme.breakpoints.Tablet}px) {
    width: 50%;
  }
`

const ButtonContainer = styled("div")`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 0 20px 0;
`

const CloseFeedbackModalButton = styled(Button)`
  background: ${props => props.theme.colors.buttons.background};
  color: ${props => props.theme.colors.buttons.color};
  padding: 10px 30px;
  margin-bottom: 20px;
  font-size: 16px;
`

const StartFeedbackLink = styled("a")`
  background: ${props => props.theme.colors.buttons.cancelBackground};
  color: ${props => props.theme.colors.buttons.color};
  padding: 10px 30px;
  margin-bottom: 20px;
  margin-left: 40px;
  font-size: 16px;
  text-decoration: none;
`

const StyledStudentFeedbackModal = styled(Modal)`
  ${props => props.theme.typography.body}
  box-sizing: inherit;
  color: rgb(255, 255, 255);
  text-align: center;
  border-radius: 4px;
  outline: none;
  height: 100%;

  @media screen and (min-width: ${props => props.theme.breakpoints.Tablet}px) {
    position: absolute;
    left: 50%;
    right: auto;
    bottom: auto;
    overflow: auto;
    margin-right: -50%;
    transform: translate(-50%, 0);
    padding: 20px;
    height: unset;
  }
`
const FeedbackModalContainer = styled("div")`
  background: ${props => props.theme.colors.header.background};
  max-width: 850px;
  padding: 15px 20px;
  height: 100%;
`

interface StudentFeedbackProps
  extends Pick<INotificationStore, "studentFeedbackLinks"> {
  store?: IRootStore
}

export const StudentFeedbackModal = inject("store")(
  observer((props: StudentFeedbackProps) => {
    const closeFeedbackModal = () => {
      props.store!.notifications.hideFeedbackModal()
    }

    const removeFeedbackLink = (linkToRemove: string) => {
      props.store!.notifications.removeOpiskelijapalautelinkki(linkToRemove)
    }

    const { store, studentFeedbackLinks } = props
    const showFeedbackModal = store!.notifications.showFeedbackModal

    // always guard your array index based access with a .length check.
    if (!Boolean(studentFeedbackLinks?.length)) {
      return null
    }

    return (
      <StyledStudentFeedbackModal isOpen={showFeedbackModal}>
        <FeedbackModalContainer>
          <StudentFeedbackTitle>
            <FormattedMessage
              id="studentFeedbackDialog.Title"
              defaultMessage="Anna palautetta opinnoistasi"
            />
          </StudentFeedbackTitle>
          <StudentFeedbackTextContainer>
            <FormattedMessage
              id="studentFeedbackDialog.paragraph"
              defaultMessage="Vastaa opintojasi koskevaan AMIS-kyselyyn alla olevan linkin kautta.
            Vastaamiseen kuluu noin 10-15 minuuttia."
            />
          </StudentFeedbackTextContainer>
          <ButtonContainer>
            <CloseFeedbackModalButton onClick={closeFeedbackModal}>
              <FormattedMessage
                id="studentFeedbackDialog.closeFeedbackButton"
                defaultMessage="Vastaan myöhemmin"
              />
            </CloseFeedbackModalButton>
            <StartFeedbackLink
              href={`${studentFeedbackLinks[0]}?t=w`}
              onClick={removeFeedbackLink.bind(this, studentFeedbackLinks[0])}
              target="_blank"
            >
              <FormattedMessage
                id="studentFeedbackDialog.startFeedbackButton"
                defaultMessage="Aloita vastaaminen"
              />
            </StartFeedbackLink>
          </ButtonContainer>
        </FeedbackModalContainer>
      </StyledStudentFeedbackModal>
    )
  })
)
