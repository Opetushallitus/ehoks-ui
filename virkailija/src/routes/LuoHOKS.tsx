import { Button } from "components/Button"
import { Heading } from "components/Heading"
import { JSONSchema6 } from "json-schema"
import React from "react"
import Form from "react-jsonschema-form"
import styled from "styled"
// import "./LuoHOKS/bootstrap.min.css"
import "./LuoHOKS/glyphicons.css"
import "./LuoHOKS/styles.css"

const Container = styled("div")`
  margin: 20px 40px 40px 40px;
`

const Header = styled(Heading)`
  margin: 20px 0;
`

const ButtonsContainer = styled("div")`
  margin: 20px 0;
`

interface LuoHOKSProps {
  path?: string
}

interface LuoHOKSState {
  schema: JSONSchema6
}

const log = (type: any) => console.log.bind(console, type)

// Schema formats supported by react-jsonschema-form
const SUPPORTED_SCHEMA_FORMATS = [
  "data-url",
  "date",
  "date-time",
  "email",
  "hostname",
  "ipv4",
  "ipv6",
  "uri"
]

const stripUnsupportedFormat = (schema: any) => {
  if (schema.format && SUPPORTED_SCHEMA_FORMATS.indexOf(schema.format) === -1) {
    delete schema.format
  }
  if (schema.properties) {
    Object.keys(schema.properties).forEach(property => {
      stripUnsupportedFormat(schema.properties[property])
    })
  }
  return schema
}

const stripUnsupportedFormats = (definitions: any) => {
  return Object.keys(definitions).reduce((defs: any, def) => {
    defs[def] = stripUnsupportedFormat(definitions[def])
    return defs
  }, {})
}

export class LuoHOKS extends React.Component<LuoHOKSProps, LuoHOKSState> {
  state = {
    schema: {}
  }

  async componentDidMount() {
    const request = await window.fetch("/ehoks-backend/doc/swagger.json")
    const json = await request.json()
    const schema = {
      definitions: stripUnsupportedFormats(json.definitions),
      ...json.definitions.HOKSLuonti
    }
    console.log("HOKSLuonti", schema)
    this.setState({ schema })
  }

  render() {
    return (
      <Container>
        <Header>HOKS luonti</Header>
        <Form
          schema={this.state.schema}
          onChange={log("changed")}
          onSubmit={log("submitted")}
          onError={log("errors")}
        >
          <ButtonsContainer>
            <Button type="submit">Luo HOKS</Button>
          </ButtonsContainer>
        </Form>
      </Container>
    )
  }
}
