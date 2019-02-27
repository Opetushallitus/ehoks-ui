import { Accordion, AccordionTitle } from "components/Accordion"
import React from "react"
import SchemaField from "react-jsonschema-form/lib/components/fields/SchemaField"
import styled from "styled"

const ArrayTitle = styled(AccordionTitle)`
  border-bottom: 1px solid #e5e5e5;
`

/**
 * Wrap schema arrays with Accordion component
 */
export const CustomSchemaField = (props: any) => {
  const { schema } = props
  return (
    <div>
      {schema.type === "array" ? (
        <Accordion
          id={props.idSchema.$id}
          title={<ArrayTitle>{props.name}</ArrayTitle>}
          initiallyOpen={true}
        >
          <SchemaField {...props} />
        </Accordion>
      ) : (
        <SchemaField {...props} />
      )}
    </div>
  )
}
