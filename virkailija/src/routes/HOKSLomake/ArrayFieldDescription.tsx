import React from "react"
import { FormattedMessage } from "react-intl"
import { idToTranslationKey } from "./helpers/idToTranslationKey"

const RootDescriptionField = ({
  id,
  description
}: {
  id: string
  description: string
}) => (
    <h3 id={id} className="field-description">
      <FormattedMessage
        id={idToTranslationKey(id)}
        defaultMessage={description}
      />
    </h3>
  );

interface ArrayFieldDescriptionProps {
  DescriptionField: any
  idSchema: { $id: string }
  description?: string
  isRoot: boolean
}

export function ArrayFieldDescription({
  DescriptionField,
  idSchema,
  description,
  isRoot
}: ArrayFieldDescriptionProps) {
  if (!description) {
    // See #312: Ensure compatibility with old versions of React.
    return <div />
  }
  const id = `${idSchema.$id}__description`
  return isRoot ? (
    <RootDescriptionField id={id} description={description} />
  ) : (
    <DescriptionField id={id} description={description} />
  )
}
