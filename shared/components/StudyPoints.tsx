import { FormattedMessage } from "react-intl"
import { LabeledColumn } from "./LabeledColumn"
import React from "react"

const Points = (props: {
  osaamispisteet?: number
  pointsTranslationId: string
}) => {
  if (props.osaamispisteet) {
    return (
      <>
        {props.osaamispisteet}{" "}
        <FormattedMessage
          id={props.pointsTranslationId}
          defaultMessage="osaamispistettä"
        />
      </>
    )
  }

  return (
    <>
      <FormattedMessage
        id="osaamispisteet.laajuusNull"
        defaultMessage="Tutkinnon laajuus ei tiedossa"
      />
    </>
  )
}

export const StudyPoints = (props: {
  osaamispisteet?: number
  titleTranslationId: string
  pointsTranslationId: string
}) => (
    <LabeledColumn id={props.titleTranslationId}>
      <Points
        osaamispisteet={props.osaamispisteet}
        pointsTranslationId={props.pointsTranslationId}
      />
    </LabeledColumn>
  )
