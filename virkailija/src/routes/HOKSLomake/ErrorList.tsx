import React from "react"
import { FormattedMessage } from "react-intl"
import { ErrorListProps, RJSFValidationError } from "@rjsf/utils"
import styled from "styled"

const ErrorMessage = styled("li")`
  color: ${props => props.theme.colors.green700};
  &:hover {
    color: ${props => props.theme.colors.green900};
    cursor: pointer;
  }
`

const generateFieldId = (path: string) =>
  `root_${path
    .split(/\]|\./)
    .filter(Boolean)
    .join("_")
    .replace(/\[|'|\./g, "")}`

const scrollToError =
  (error: RJSFValidationError) => (event: React.MouseEvent) => {
    event.preventDefault()
    const element: any = document.querySelector(
      `#${generateFieldId(error.property!)}`
    )
    const topToolbar: any = document.getElementById("topToolbar")
    if (element) {
      window.scroll(0, element.offsetTop - topToolbar ? topToolbar.height : 0)

      const focusElement =
        element.tagName === "INPUT"
          ? element
          : document.querySelectorAll(
              `#${generateFieldId(error.property!)} input:first-child`
            )[0]

      focusElement.focus()
    }
  }

export default function ErrorList(props: ErrorListProps) {
  const { errors } = props

  return (
    <div id="form-errors">
      <h3>
        <FormattedMessage
          id="luoHoks.vaaditutKentat"
          defaultMessage="Vaaditut kentät"
        />
      </h3>

      <ul>
        {errors.map((error: RJSFValidationError, i: number) => {
          const property = error
            .property!.replace(/\[|\]|'/gi, "")
            .replace(/\d/gi, (match: string) => ` ${Number(match) + 1} `)
          return (
            <ErrorMessage key={i} onClick={scrollToError(error)} role="button">
              {property} on {error.message}
            </ErrorMessage>
          )
        })}
      </ul>
    </div>
  )
}
