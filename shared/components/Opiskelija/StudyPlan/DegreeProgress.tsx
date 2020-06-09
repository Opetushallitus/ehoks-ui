import React from "react"
import { ProgressPie } from "components/ProgressPie"
import { StatBoxes } from "components/StatBox"
import { IHankittavaTutkinnonOsa } from "../../../models/helpers/TutkinnonOsa"
import { FormattedMessage } from "react-intl"

export const DegreeProgress = ({
  totalStudiesLength,
  suunnitellutOpinnot,
  aikataulutetutOpinnot,
  valmiitOpinnot,
  showSuunnitellut,
  showAikataulutetut,
  showValmiit
}: {
  totalStudiesLength: number
  suunnitellutOpinnot: IHankittavaTutkinnonOsa[]
  aikataulutetutOpinnot: IHankittavaTutkinnonOsa[]
  valmiitOpinnot: IHankittavaTutkinnonOsa[]
  showSuunnitellut: () => void
  showAikataulutetut: () => void
  showValmiit: () => void
}) => (
  <StatBoxes>
    <ProgressPie
      value={
        totalStudiesLength !== 0
          ? Math.round((suunnitellutOpinnot.length / totalStudiesLength) * 100)
          : 0
      }
      stroke="planned"
      title={
        <FormattedMessage
          id="opiskelusuunnitelma.suunniteltunaTitle"
          defaultMessage="Suunniteltuna"
        />
      }
      onClick={showSuunnitellut}
    />
    <ProgressPie
      value={
        totalStudiesLength !== 0
          ? Math.round(
              (aikataulutetutOpinnot.length / totalStudiesLength) * 100
            )
          : 0
      }
      stroke="scheduled"
      title={
        <FormattedMessage
          id="opiskelusuunnitelma.aikataulutettunaTitle"
          defaultMessage="Aikataulutettuna"
        />
      }
      onClick={showAikataulutetut}
    />
    <ProgressPie
      value={
        totalStudiesLength !== 0
          ? Math.round((valmiitOpinnot.length / totalStudiesLength) * 100)
          : 0
      }
      stroke="ready"
      title={
        <FormattedMessage
          id="opiskelusuunnitelma.valmiinaTitle"
          defaultMessage="Valmiina"
        />
      }
      onClick={showValmiit}
    />
  </StatBoxes>
)
