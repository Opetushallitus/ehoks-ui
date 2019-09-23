import React from "react"
import { FormattedMessage } from "react-intl"
import { idToTranslationKey } from "./helpers/idToTranslationKey"

export function CustomDescriptionField(props: {
  id?: string
  description?: string
}) {
  const { id, description } = props
  if (!description) {
    return null
  }
  if (typeof description === "string") {
    return (
      <p id={id} className="field-description">
        <FormattedMessage
          id={idToTranslationKey(id)}
          defaultMessage={description}
        />
      </p>
    )
  } else {
    return (
      <div id={id} className="field-description">
        <FormattedMessage
          id={idToTranslationKey(id)}
          defaultMessage={description}
        />
      </div>
    )
  }
}
