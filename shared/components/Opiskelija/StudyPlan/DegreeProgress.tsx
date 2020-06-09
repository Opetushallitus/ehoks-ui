import React from "react"
import { observer } from "mobx-react"
import { ProgressPie } from "components/ProgressPie"
import { StatBoxes, StatBox, StatNumber, StatTitle } from "components/StatBox"
import { IHankittavaTutkinnonOsa } from "../../../models/helpers/TutkinnonOsa"
import { FormattedMessage } from "react-intl"
import styled, { withTheme, ComponentWithTheme } from "styled"
import { TypeOfTheme, ColorType } from "theme"

const colorFromTheme = (theme: TypeOfTheme) => (
  color?: ColorType
): string | undefined => {
  if (color) {
    const themeColor = theme.colors[color]
    if (typeof themeColor === "string") {
      return themeColor
    }
  }
  return undefined
}

const DegreeBoxes = styled(StatBoxes)`
  max-width: 900px;
`

const StudiesCategory = styled("div")`
  flex: 1;
  margin-right: ${props => props.theme.spacing.m};
  &:last-child {
    margin-right: 0;
  }
`

const StudiesListContainer = styled("ul")`
  list-style: none;
  margin: 0;
  padding: 0;
`

const StudiesItem = styled("li")`
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.s};
  border: 1px solid #979797; /*//TODO from theme*/
  border-top: none;
  &:nth-child(odd) {
    background: #fafafa; /*//TODO from theme*/
  }
`

const StudiesList = observer(
  ({
    opinnot,
    competencePointsTitle
  }: {
    opinnot: IHankittavaTutkinnonOsa[]
    competencePointsTitle: string
  }) => (
    <StudiesListContainer>
      {opinnot.map(({ opintoOtsikko }, i) => (
        <StudiesItem key={i}>
          {opintoOtsikko(competencePointsTitle)}
        </StudiesItem>
      ))}
    </StudiesListContainer>
  )
)

export const DegreeProgressWithTheme = ({
  totalStudiesLength,
  suunnitellutOpinnot,
  aikataulutetutOpinnot,
  valmiitOpinnot,
  showSuunnitellut,
  showAikataulutetut,
  showValmiit,
  competencePointsTitle,
  theme
}: {
  totalStudiesLength: number
  suunnitellutOpinnot: IHankittavaTutkinnonOsa[]
  aikataulutetutOpinnot: IHankittavaTutkinnonOsa[]
  valmiitOpinnot: IHankittavaTutkinnonOsa[]
  showSuunnitellut: () => void
  showAikataulutetut: () => void
  showValmiit: () => void
  competencePointsTitle: string
} & ComponentWithTheme) => {
  const themeColor = colorFromTheme(theme)
  const plannedColor = themeColor("planned")
  const scheduled = themeColor("scheduled")
  const ready = themeColor("ready")

  return (
    <DegreeBoxes>
      <StudiesCategory>
        <ProgressPie
          value={
            totalStudiesLength !== 0
              ? Math.round(
                  (suunnitellutOpinnot.length / totalStudiesLength) * 100
                )
              : 0
          }
          stroke="planned"
          onClick={showSuunnitellut}
        />
        <StatBox borderTop={plannedColor}>
          <StatNumber color={plannedColor}>
            {suunnitellutOpinnot.length}
          </StatNumber>
          <StatTitle>
            <FormattedMessage
              id="opiskelusuunnitelma.suunniteltunaTitle"
              defaultMessage="Suunniteltua tutkinnonosaa"
            />
          </StatTitle>
        </StatBox>
        <StudiesList
          opinnot={suunnitellutOpinnot}
          competencePointsTitle={competencePointsTitle}
        />
      </StudiesCategory>
      <StudiesCategory>
        <ProgressPie
          value={
            totalStudiesLength !== 0
              ? Math.round(
                  (aikataulutetutOpinnot.length / totalStudiesLength) * 100
                )
              : 0
          }
          stroke="scheduled"
          onClick={showAikataulutetut}
        />
        <StatBox borderTop={scheduled}>
          <StatNumber color={scheduled}>
            {aikataulutetutOpinnot.length}
          </StatNumber>
          <StatTitle>
            <FormattedMessage
              id="opiskelusuunnitelma.aikataulutettunaTitle"
              defaultMessage="Aikataulutettua tutkinnonosaa"
            />
          </StatTitle>
        </StatBox>
        <StudiesList
          opinnot={aikataulutetutOpinnot}
          competencePointsTitle={competencePointsTitle}
        />
      </StudiesCategory>
      <StudiesCategory>
        <ProgressPie
          value={
            totalStudiesLength !== 0
              ? Math.round((valmiitOpinnot.length / totalStudiesLength) * 100)
              : 0
          }
          stroke="ready"
          onClick={showValmiit}
        />
        <StatBox borderTop={ready}>
          <StatNumber color={ready}>{valmiitOpinnot.length}</StatNumber>
          <StatTitle>
            <FormattedMessage
              id="opiskelusuunnitelma.valmiinaTitle"
              defaultMessage="Valmista tutkinnonosaa"
            />
          </StatTitle>
        </StatBox>
        <StudiesList
          opinnot={valmiitOpinnot}
          competencePointsTitle={competencePointsTitle}
        />
      </StudiesCategory>
    </DegreeBoxes>
  )
}

export const DegreeProgress = withTheme(DegreeProgressWithTheme)
