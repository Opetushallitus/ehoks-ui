import { Accordion } from "components/Accordion"
import { AccordionTitle } from "components/AccordionTitle"
import React from "react"
import SchemaField from "@rjsf/core/lib/components/fields/SchemaField"
import styled from "styled"

const ArrayTitle = styled(AccordionTitle)`
  border-bottom: 1px solid #e5e5e5;
`

const ArrayContainer = styled("div")`
  border: 1px solid #ccc;
  padding: 10px;
  border-radius: 5px;
  margin: 10px 0px 0px 0px;
`

const disableAccordion = [
  "#/definitions/AiemminHankittuAmmatillinenTutkinnonOsa",
  "#/definitions/AiemminHankittuPaikallinenTutkinnonOsa",
  "#/definitions/AiemminHankittuYhteinenTutkinnonOsa",
  "#/definitions/HankittavaAmmatillinenTutkinnonOsa",
  "#/definitions/HankittavaPaikallinenTutkinnonOsa",
  "#/definitions/HankittavaYTO",
  "#/definitions/OpiskeluvalmiuksiaTukevatOpinnot"
]

/**
 * Wrap schema arrays with Accordion component
 */
export const CustomSchemaField = (props: any) => {
  const { schema } = props

  // hide "pakollinen kenttä" error messages,
  // showing "*" next to label is enough
  const forwardProps = {
    ...props,
    errorSchema: props.errorSchema
      ? {
          ...props.errorSchema,
          // eslint-disable-next-line no-underscore-dangle
          __errors: (props.errorSchema.__errors || []).filter(
            (e: string) => e !== "pakollinen kenttä"
          )
        }
      : undefined
  }

  return (
    <div>
      {schema.type === "array" &&
      disableAccordion.indexOf(schema.items.$ref) === -1 ? (
        <Accordion
          id={props.idSchema.$id}
          title={<ArrayTitle>{props.name}</ArrayTitle>}
          initiallyOpen={true}
          childContainer={false}
        >
          <ArrayContainer>
            <SchemaField {...forwardProps} />
          </ArrayContainer>
        </Accordion>
      ) : (
        <SchemaField {...forwardProps} />
      )}
    </div>
  )
}
