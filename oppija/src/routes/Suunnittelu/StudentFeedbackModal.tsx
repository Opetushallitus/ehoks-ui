import { Button } from "components/Button"
import { inject } from "mobx-react"
import * as React from "react"
import { FormattedMessage } from "react-intl"
import Modal from "react-modal"
import styled from "../../../../shared/styled"
import { IRootStore } from "../../stores/RootStore"

const StudentFeedbackTitle = styled("h1")`
  font-weight: 400;
  font-size: 30px;
`

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

const StartFeedbackButton = styled("a")`
  background: ${props => props.theme.colors.buttons.cancelBackground};
  color: ${props => props.theme.colors.buttons.color};
  padding: 10px 30px;
  margin-bottom: 20px;
  margin-left: 40px;
  font-size: 16px;
  text-decoration: none;
`

const StyledStudentFeedbackModal = styled(Modal)`
  font-family: "Source Sans Pro", sans-serif;
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

interface StudentFeedbackModalState {
  feedbackLink: string
  introDialogOpen: boolean
}

interface StudentFeedbackProps {
  store?: IRootStore
}

@inject("store")
export class StudentFeedbackModal extends React.Component<
  StudentFeedbackProps,
  StudentFeedbackModalState
> {
  state: StudentFeedbackModalState = {
    feedbackLink: "",
    introDialogOpen: true
  }

  closeFeedBackModal = () => {
    this.setState({ introDialogOpen: false })
  }

  render() {
    return (
      <StyledStudentFeedbackModal isOpen={this.state.introDialogOpen}>
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
            <CloseFeedbackModalButton onClick={this.closeFeedBackModal}>
              <FormattedMessage
                id="studentFeedbackDialog.closeFeedbackButton"
                defaultMessage="Vastaan myöhemmin"
              />
            </CloseFeedbackModalButton>
            <StartFeedbackButton href={this.state.feedbackLink} target="_blank">
              <FormattedMessage
                id="studentFeedbackDialog.startFeedbackButton"
                defaultMessage="Aloita vastaaminen"
              />
            </StartFeedbackButton>
          </ButtonContainer>
        </FeedbackModalContainer>
      </StyledStudentFeedbackModal>
    )
  }
}
