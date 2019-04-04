import React from "react"
import { FormattedMessage } from "react-intl"
import { AjvError } from "react-jsonschema-form"
import styled from "styled"

const ErrorMessage = styled("li")`
  color: ${props => props.theme.colors.waterBlue};
  &:hover {
    color: ${props => props.theme.colors.flatBlue};
    cursor: pointer;
  }
`

function generateFieldId(path: string) {
  return `root_${path
    .split(/\]|\./)
    .filter(Boolean)
    .join("_")
    .replace(/\[|'|\./g, "")}`
}

function scrollToError(error: AjvError) {
  return (event: React.MouseEvent) => {
    event.preventDefault()
    const element: any = document.querySelector(
      `#${generateFieldId(error.property)}`
    )
    if (element) {
      element.scrollIntoView()
      element.focus()
    }
  }
}

interface ErrorListProps {
  errors: AjvError[]
}

export default function ErrorList(props: ErrorListProps) {
  const { errors } = props

  // TODO: enable after UI refactor
  return null

  return (
    <div id="form-errors">
      <h3>
        <FormattedMessage
          id="luoHoks.tarvittavatMuutokset"
          defaultMessage="Tarvittavat muutokset"
        />
      </h3>

      <ul>
        {errors.map((error: AjvError, i: number) => {
          return (
            <ErrorMessage key={i} onClick={scrollToError(error)} role="button">
              {error.property} on {error.message}
            </ErrorMessage>
          )
        })}
      </ul>
    </div>
  )
}
