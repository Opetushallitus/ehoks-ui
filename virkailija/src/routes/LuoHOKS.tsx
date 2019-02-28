import { Button } from "components/Button"
import { Heading } from "components/Heading"
import { LoadingSpinner } from "components/LoadingSpinner"
import { JSONSchema6 } from "json-schema"
import React from "react"
import { FormattedMessage } from "react-intl"
import Form, { AjvError, FieldProps, IChangeEvent } from "react-jsonschema-form"
import styled from "styled"
import { ArrayFieldTemplate } from "./LuoHOKS/ArrayFieldTemplate"
import { CustomSchemaField } from "./LuoHOKS/CustomSchemaField"
// import "./LuoHOKS/bootstrap.min.css"
import ErrorList from "./LuoHOKS/ErrorList"
import "./LuoHOKS/glyphicons.css"
import "./LuoHOKS/styles.css"
import { uiSchema } from "./LuoHOKS/uiSchema"

const fields = {
  SchemaField: CustomSchemaField
}

const Container = styled("div")`
  margin: 20px 40px 60px 40px;
`

const Header = styled(Heading)`
  margin: 20px 0;
`

const ButtonsContainer = styled("div")`
  display: flex;
  align-items: center;
  height: 60px;
  margin-left: 40px;
`

const BottomToolbar = styled("div")`
  position: fixed;
  left: 0px;
  bottom: 0px;
  height: 60px;
  width: 100%;
  background: rgba(255, 255, 255, 0.9);
  border-top: 1px solid #ccc;
`

const ModificationsNeeded = styled("button")`
  margin-left: 20px;
  background: none;
  border: none;
  padding: 0;
  font: inherit;
  cursor: pointer;
  color: ${props => props.theme.colors.waterBlue};
  &:hover {
    color: ${props => props.theme.colors.flatBlue};
  }
`

const SpinnerContainer = styled("div")`
  width: 100px;
`

const SuccessMessage = styled("div")`
  margin-left: 20px;
  color: ${props => props.theme.colors.midGreen};
`

const FailureMessage = styled("div")`
  margin-left: 20px;
  color: ${props => props.theme.colors.brick};
`

interface LuoHOKSProps {
  path?: string
}

interface LuoHOKSState {
  schema: JSONSchema6
  formData: any
  errors: AjvError[]
  isLoading: boolean
  success: boolean | undefined
  userEnteredText: boolean
}

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

function transformErrors(errors: AjvError[]) {
  return errors.map(error => {
    if (error.name === "required") {
      error.message = "pakollinen kenttä"
    }
    return error
  })
}

export class LuoHOKS extends React.Component<LuoHOKSProps, LuoHOKSState> {
  state = {
    schema: {},
    formData: {},
    errors: [],
    isLoading: true,
    success: undefined,
    userEnteredText: false
  }

  async componentDidMount() {
    const request = await window.fetch("/ehoks-backend/doc/swagger.json")
    const json = await request.json()
    const schema = {
      definitions: stripUnsupportedFormats(json.definitions),
      ...json.definitions.HOKSLuonti
    }
    console.log("HOKSLuonti", schema)
    this.setState({ schema, isLoading: false })
  }

  setErrors = (errors: AjvError[]) => {
    this.setState({ errors })
  }

  onChange = ({ formData, errors }: any) => {
    this.setState({ formData, errors })
  }

  scrollToErrors = (event: React.MouseEvent) => {
    event.preventDefault()
    const element = document.querySelector("#form-errors")
    if (element) {
      element.scrollIntoView()
    }
  }

  hideMessage = () => {
    this.setState({ success: undefined })
  }

  userHasEnteredText = () => {
    this.setState({ userEnteredText: true })
  }

  create = async (fieldProps: IChangeEvent<FieldProps>) => {
    // TODO: authenticate user

    this.setState({ isLoading: true })
    const request = await window.fetch("/ehoks-backend/api/v1/hoks", {
      method: "POST",
      credentials: "include",
      headers: {
        Accept: "application/json; charset=utf-8",
        "Caller-Id": "ehoks", // TODO: replace for real authentication
        "Content-Type": "application/json",
        ticket: "testi" // TODO: replace for real authentication
      },
      body: JSON.stringify(fieldProps.formData)
    })
    const json = await request.json()

    if (request.status === 200) {
      this.setState({
        formData: {},
        errors: [],
        success: true,
        userEnteredText: false
      })
    } else {
      this.setState({ success: false })
    }
    console.log("RESPONSE STATUS", request.status)
    console.log("RESPONSE JSON", json)
    this.setState({ isLoading: false })
  }

  render() {
    return (
      <Container onKeyUp={this.userHasEnteredText}>
        <Header>HOKS luonti</Header>
        <Form
          fields={fields}
          schema={this.state.schema}
          uiSchema={uiSchema}
          formData={this.state.formData as any}
          onChange={this.onChange}
          onSubmit={this.create}
          onError={this.setErrors}
          ErrorList={ErrorList}
          transformErrors={transformErrors}
          ArrayFieldTemplate={ArrayFieldTemplate}
        >
          <BottomToolbar>
            <ButtonsContainer>
              <Button type="submit">Luo HOKS</Button>
              {!!this.state.errors.length &&
                this.state.success === undefined &&
                this.state.userEnteredText && (
                  <ModificationsNeeded onClick={this.scrollToErrors}>
                    <FormattedMessage
                      id="luoHoks.muutoksiaTarvitaan"
                      defaultMessage="Muutoksia tarvitaan"
                    />
                  </ModificationsNeeded>
                )}
              {this.state.isLoading && (
                <SpinnerContainer>
                  <LoadingSpinner />
                </SpinnerContainer>
              )}
              {this.state.success && (
                <SuccessMessage onClick={this.hideMessage}>
                  <FormattedMessage
                    id="luoHoks.luontiOnnistui"
                    defaultMessage="HOKS luotiin onnistuneesti"
                  />
                </SuccessMessage>
              )}
              {this.state.success === false && (
                <FailureMessage onClick={this.hideMessage}>
                  <FormattedMessage
                    id="luoHoks.luontiEpaonnistui"
                    defaultMessage="HOKSin luonti epäonnistui"
                  />
                </FailureMessage>
              )}
            </ButtonsContainer>
          </BottomToolbar>
        </Form>
      </Container>
    )
  }
}
