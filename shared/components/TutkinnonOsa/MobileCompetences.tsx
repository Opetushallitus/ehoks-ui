import { MobileSlider, Slide } from "components/MobileSlider"
import React, { useState } from "react"
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
  margin: 5px 0 5px 30px;
`

interface MobileCompetencesProps {
  competenceRequirements: SnapshotOrInstance<typeof Osaamisvaatimus>[]
}

interface MobileCompetencesState {
  activeSlide: number
  showAssessment: boolean
}

export const MobileCompetences: React.FC<MobileCompetencesProps> = ({
  competenceRequirements
}) => {
  const [state, setState] = useState<MobileCompetencesState>({
    activeSlide: 0,
    showAssessment: false
  })

  const changeSlide = (index: number) => {
    setState(s => ({ ...s, activeSlide: index }))
  }

  const toggleShowAssessment = () => {
    setState(s => ({
      ...s,
      showAssessment: !s.showAssessment
    }))
  }

  const kriteerit = competenceRequirements[state.activeSlide].kriteerit || []

  return (
    <SliderContainer>
      <MobileSlider
        onSlideChange={changeSlide}
        footer={
          <MobileSliderToggle>
            <ToggleLink onClick={toggleShowAssessment}>
              {state.showAssessment ? (
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
      >
        {competenceRequirements.map((competenceRequirement, i) => (
          <Slide key={i}>{competenceRequirement.kuvaus}</Slide>
        ))}
      </MobileSlider>
      {state.showAssessment &&
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
