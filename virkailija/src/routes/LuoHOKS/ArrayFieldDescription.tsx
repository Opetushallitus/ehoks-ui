import React from "react"

function RootDescriptionField({
  id,
  description
}: {
  id: string
  description: string
}) {
  return (
    <h3 id={id} className="field-description">
      {description}
    </h3>
  )
}

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
