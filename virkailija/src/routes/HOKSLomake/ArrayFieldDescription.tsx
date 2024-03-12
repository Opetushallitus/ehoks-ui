import React, { ReactElement } from "react"
import { FormattedMessage } from "react-intl"
import { idToTranslationKey } from "./helpers/idToTranslationKey"
import { ArrayFieldDescriptionProps } from "@rjsf/utils"

const RootDescriptionField = ({
  id,
  description
}: {
  id: string
  description?: string | ReactElement
}) => (
  <h3 id={id} className="field-description">
    <FormattedMessage
      id={idToTranslationKey(id)}
      defaultMessage={description?.toString()}
    />
  </h3>
)

export function ArrayFieldDescription({
  idSchema,
  description
}: ArrayFieldDescriptionProps) {
  if (!description) {
    // See #312: Ensure compatibility with old versions of React.
    return <div />
  }
  const id = `${idSchema.$id}__description`
  return <RootDescriptionField id={id} description={description} />
}
