import { Accordion } from "components/Accordion"
import { ProgressPie } from "components/ProgressPie"
import { inject, observer } from "mobx-react"
import { Instance } from "mobx-state-tree"
import React from "react"
import styled from "react-emotion"
import { SessionStore } from "stores/SessionStore"
import { injectSession } from "utils"

const Heading = styled("h1")`
  margin: 0;
  font-size: 30px;
  font-weight: 400;
`

const ProgressContainer = styled("div")`
  background: #ecf3fc;
  padding: 20px;
  border-bottom: 1px solid #027fa9;
`

const ProgressPies = styled("div")`
  display: flex;
  justify-content: center;
  margin: 20px 0;
`

const SectionContainer = styled("div")`
  background: #f8f8f8;
  padding: 20px;
`

export interface SignedInProps {
  session?: Instance<typeof SessionStore>
}

export interface SignedInState {
  activeStep: number
  activeAccordions: {
    [stepIndex: number]: {
      [accordionName: string]: boolean
    }
  }
}

@inject(injectSession)
@observer
export class SignedIn extends React.Component<SignedInProps, SignedInState> {
  state = {
    activeAccordions: {
      0: {
        personalData: false,
        personalGoal: false
      }
    },
    activeStep: 0
  }

  login = (event: React.MouseEvent) => {
    event.preventDefault()
    window.location.href = this.props.session.loginUrl
  }

  setActiveTab = (index: number) => () => {
    this.setState({ activeStep: index })
  }

  setActiveAccordion = (index: number, accordion: string) => () => {
    this.setState(state => ({
      ...state,
      activeAccordions: {
        ...state.activeAccordions,
        [index]: {
          ...state.activeAccordions[index],
          [accordion]: !state.activeAccordions[index][accordion]
        }
      }
    }))
  }

  render() {
    return (
      <React.Fragment>
        <ProgressContainer>
          <Heading>Omien opintojen suunnittelu</Heading>

          <ProgressPies>
            <ProgressPie
              step={"1"}
              percentage={100}
              selected={this.state.activeStep === 0}
              onClick={this.setActiveTab(0)}
              title="Tavoitteeni ja perustietoni"
            />
            <ProgressPie
              step={"2"}
              percentage={75}
              selected={this.state.activeStep === 1}
              onClick={this.setActiveTab(1)}
              title="Aiempi osaamiseni"
            />
            <ProgressPie
              step={"3"}
              percentage={50}
              selected={this.state.activeStep === 2}
              onClick={this.setActiveTab(2)}
              title="Osaamisen tunnus&shy;taminen"
            />
            <ProgressPie
              step={"4"}
              percentage={25}
              selected={this.state.activeStep === 3}
              onClick={this.setActiveTab(3)}
              title="Opiskelu&shy;suunni&shy;telmani"
            />
          </ProgressPies>
        </ProgressContainer>
        <SectionContainer>
          <Heading>Tavoitteeni ja perustietoni</Heading>

          <Accordion
            open={this.state.activeAccordions[0].personalGoal}
            title="Oma tavoitteeni"
            onToggle={this.setActiveAccordion(0, "personalGoal")}
          >
            tavoite
          </Accordion>

          <Accordion
            open={this.state.activeAccordions[0].personalData}
            title="Omat henkilötiedot"
            onToggle={this.setActiveAccordion(0, "personalData")}
          >
            henkilötiedot
          </Accordion>
        </SectionContainer>
      </React.Fragment>
    )
  }
}
