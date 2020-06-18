import { MobileSlider, Slide } from "components/MobileSlider"
import React from "react"
import { FormattedMessage } from "react-intl"
import styled from "styled"
import { ToggleLink } from "./ToggleLink"
import { SnapshotOrInstance } from "mobx-state-tree"
import { Osaamisvaatimus } from "models/Osaamisvaatimus"

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
  competenceRequirements: SnapshotOrInstance<typeof Osaamisvaatimus>[]
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
    const { competenceRequirements } = this.props
    const { showAssessment } = this.state
    const kriteerit =
      competenceRequirements[this.state.activeSlide].kriteerit || []
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
          {competenceRequirements.map((competenceRequirement, i) => (
            <Slide key={i}>{competenceRequirement.kuvaus}</Slide>
          ))}
        </MobileSlider>
        {showAssessment &&
          kriteerit.map((arviointikriteeri, ai) => (
            <AssessmentItem key={ai}>
              <h2>{arviointikriteeri.kuvaus}</h2>
              {(arviointikriteeri.kriteerit || []).map((kriteeri, ki) => (
                <p key={ki}>{kriteeri}</p>
              ))}
            </AssessmentItem>
          ))}
      </SliderContainer>
    )
  }
}
