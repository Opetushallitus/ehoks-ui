import { MobileSlider, Slide } from "components/MobileSlider"
import React from "react"
import { FormattedMessage } from "react-intl"
import styled from "styled"
import { ToggleLink } from "./ToggleLink"

const SliderContainer = styled("div")`
  margin: 0 10px;
`

const AssessmentItem = styled("div")`
  border: 1px solid #999;
  padding: 10px;
  margin-bottom: 10px;

  h2 {
    font-size: 16px;
    margin: 0;
  }
`

const MobileSliderToggle = styled("div")`
  position: absolute;
  bottom: 10px;
  margin: 0 0 0 25px;
`

interface MobileCompetencesProps {
  assessment?: Array<{
    [key: string]: string[]
  }>
  competenceRequirements?: string[]
}

interface MobileCompetencesState {
  activeSlide: number
  showAssessment: boolean
}

export class MobileCompetences extends React.Component<
  MobileCompetencesProps,
  MobileCompetencesState
> {
  state = {
    activeSlide: 0,
    showAssessment: false
  }

  changeSlide = (index: number) => {
    this.setState({ activeSlide: index })
  }

  toggleShowAssessment = () => {
    this.setState(state => ({
      ...state,
      showAssessment: !state.showAssessment
    }))
  }

  render() {
    const { assessment = [], competenceRequirements = [] } = this.props
    const { showAssessment } = this.state
    return (
      <SliderContainer>
        <MobileSlider
          showCount={false}
          footer={
            <MobileSliderToggle>
              <ToggleLink onClick={this.toggleShowAssessment}>
                {showAssessment ? (
                  <FormattedMessage
                    id="opiskelusuunnitelma.piilotaKriteeritLink"
                    defaultMessage="Piilota arviointikriteerit"
                  />
                ) : (
                  <FormattedMessage
                    id="opiskelusuunnitelma.naytaKriteeritLink"
                    defaultMessage="Näytä arviointikriteerit"
                  />
                )}
              </ToggleLink>
            </MobileSliderToggle>
          }
          onSlideChange={this.changeSlide}
        >
          {competenceRequirements.map((competenceRequirement, i) => {
            return (
              <Slide key={i}>
                <FormattedMessage
                  id="opiskelusuunnitelma.opiskelijaOsaaPrefix"
                  defaultMessage="Opiskelija osaa"
                />{" "}
                {competenceRequirement}
              </Slide>
            )
          })}
        </MobileSlider>
        {showAssessment &&
          Object.keys(assessment[this.state.activeSlide] || []).map(title => {
            return (
              <AssessmentItem key={title}>
                <h2>{title}</h2>
                {assessment[this.state.activeSlide][title].map(
                  (criterion, i) => {
                    return <p key={i}>{criterion}</p>
                  }
                )}
              </AssessmentItem>
            )
          })}
      </SliderContainer>
    )
  }
}
