import { Accordion, AccordionTitle } from "components/Accordion"
import React from "react"
import SchemaField from "react-jsonschema-form/lib/components/fields/SchemaField"
import styled from "styled"

const ArrayTitle = styled(AccordionTitle)`
  border-bottom: 1px solid #e5e5e5;
`

const ArrayContainer = styled("div")`
  border: 1px solid red;
  margin: 10px;
`

const disableAccordion = [
  "#/definitions/OlemassaOlevaAmmatillinenTutkinnonOsa",
  "#/definitions/OlemassaOlevaPaikallinenTutkinnonOsa",
  "#/definitions/OlemassaOlevaYhteinenTutkinnonOsa",
  "#/definitions/PuuttuvaAmmatillinenOsaaminen",
  "#/definitions/PuuttuvaPaikallinenTutkinnonOsa",
  "#/definitions/PuuttuvaYTO",
  "#/definitions/OpiskeluvalmiuksiaTukevatOpinnot"
]

/**
 * Wrap schema arrays with Accordion component
 */
export const CustomSchemaField = (props: any) => {
  const { schema } = props
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
            <SchemaField {...props} />
          </ArrayContainer>
        </Accordion>
      ) : (
        <SchemaField {...props} />
      )}
    </div>
  )
}
