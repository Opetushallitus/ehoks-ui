import React from "react"
import { observer } from "mobx-react"
import { ProgressPie } from "components/ProgressPie"
import { StatBoxes, StatBox, StatNumber, StatTitle } from "components/StatBox"
import { IHankittavaTutkinnonOsa } from "../../../models/helpers/TutkinnonOsa"
import { FormattedMessage } from "react-intl"
import styled, { withTheme, ComponentWithTheme } from "styled"
import { TypeOfTheme, ColorType } from "theme"
import { LinkButton } from "components/Button"

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

const CategoryButton = styled(LinkButton)`
  flex: 1;
  margin-right: ${props => props.theme.spacing.m};
  margin-bottom: auto;
  background: transparent;
  color: ${props => props.theme.colors.text};
  text-decoration: none;
  &:last-child {
    margin-right: 0;
  }
`

const StudiesCategory = ({
  totalStudiesLength,
  stroke,
  color,
  onClick,
  opinnot,
  children,
  competencePointsTitle
}: {
  totalStudiesLength: number
  stroke: ColorType
  color?: string
  opinnot: IHankittavaTutkinnonOsa[]
  competencePointsTitle: string
  onClick?: () => void
  children?: React.ReactNode
}) => (
  <CategoryButton onClick={onClick}>
    <ProgressPie
      value={
        totalStudiesLength !== 0
          ? Math.round((opinnot.length / totalStudiesLength) * 100)
          : 0
      }
      stroke={stroke}
    />
    <StatBox borderTop={color}>
      <StatNumber color={color}>{opinnot.length}</StatNumber>
      <StatTitle>{children}</StatTitle>
    </StatBox>
    <StudiesList
      opinnot={opinnot}
      competencePointsTitle={competencePointsTitle}
    />
  </CategoryButton>
)

const StudiesListContainer = styled("ul")`
  list-style: none;
  margin: 0;
  padding: 0;
`

const StudiesItem = styled("li")`
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.s};
  border: 1px solid #979797; /*//TODO from theme*/
  border-top: none;
  text-align: left;
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
  const planned = {
    totalStudiesLength,
    onClick: showSuunnitellut,
    color: themeColor("planned"),
    opinnot: suunnitellutOpinnot,
    competencePointsTitle
  }
  const scheduled = {
    totalStudiesLength,
    onClick: showAikataulutetut,
    color: themeColor("scheduled"),
    opinnot: aikataulutetutOpinnot,
    competencePointsTitle
  }
  const ready = {
    totalStudiesLength,
    onClick: showValmiit,
    color: themeColor("ready"),
    opinnot: valmiitOpinnot,
    competencePointsTitle
  }
  return (
    <DegreeBoxes>
      <StudiesCategory {...planned} stroke="planned">
        <FormattedMessage
          id="opiskelusuunnitelma.suunniteltunaTitle"
          defaultMessage="Suunniteltua tutkinnon osaa"
        />
      </StudiesCategory>
      <StudiesCategory {...scheduled} stroke="scheduled">
        <FormattedMessage
          id="opiskelusuunnitelma.aikataulutettunaTitle"
          defaultMessage="Aikataulutettua tutkinnon osaa"
        />
      </StudiesCategory>
      <StudiesCategory {...ready} stroke="ready">
        <FormattedMessage
          id="opiskelusuunnitelma.valmiinaTitle"
          defaultMessage="Valmista tutkinnon osaa"
        />
      </StudiesCategory>
    </DegreeBoxes>
  )
}

export const DegreeProgress = withTheme(DegreeProgressWithTheme)
