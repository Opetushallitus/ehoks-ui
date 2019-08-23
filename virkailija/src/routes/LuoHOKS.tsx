import { Button } from "components/Button"
import { Heading } from "components/Heading"
import { LoadingSpinner } from "components/LoadingSpinner"
import { ModalDialog } from "components/ModalDialog"
import { TypeaheadField } from "components/react-jsonschema-form/TypeaheadField"
import { JSONSchema6 } from "json-schema"
import { inject, observer } from "mobx-react"
import React from "react"
import "react-bootstrap-typeahead/css/Typeahead.css"
import { FormattedMessage } from "react-intl"
import Form, { AjvError, FieldProps, IChangeEvent } from "react-jsonschema-form"
import { Step } from "routes/LuoHOKS/Step"
import { Stepper } from "routes/LuoHOKS/Stepper"
import { IRootStore } from "stores/RootStore"
import styled from "styled"
import { ArrayFieldTemplate } from "./LuoHOKS/ArrayFieldTemplate"
import { CustomCheckboxWidget } from "./LuoHOKS/CustomCheckboxWidget"
import { CustomDescriptionField } from "./LuoHOKS/CustomDescriptionField"
import { CustomSchemaField } from "./LuoHOKS/CustomSchemaField"
// import "./LuoHOKS/bootstrap.min.css"
import ErrorList from "./LuoHOKS/ErrorList"
import "./LuoHOKS/glyphicons.css"
import {
  buildKoodiUris,
  mapKoodiUri,
  schemaByStep,
  stripUnsupportedFormats,
  transformErrors
} from "./LuoHOKS/helpers"
import { idToPathArray } from "./LuoHOKS/idToPathArray"
import { koodistoUrls } from "./LuoHOKS/koodistoUrls"
import "./LuoHOKS/styles.css"
import { uiSchemaByStep } from "./LuoHOKS/uiSchema"

const codeCategoriesForPaths = {
  "urasuunnitelma-koodi-versio": "urasuunnitelma",
  "tutkinnon-osa-koodi-versio": "tutkinnonosat",
  "valittu-todentamisen-prosessi-koodi-versio": "osaamisentodentamisenprosessi",
  "koodi-versio": "ammatillisenoppiaineet",
  "osa-alue-koodi-versio": "ammatillisenoppiaineet",
  "osaamisen-hankkimistapa-koodi-versio": "osaamisenhankkimistapa",
  "oppimisymparisto-koodi-versio": "oppimisymparistot"
}

const codeVersionByPath = (
  path: keyof typeof codeCategoriesForPaths,
  koodiUris: any
) => {
  const codeCategory = codeCategoriesForPaths[path]
  if (koodiUris[codeCategory]) {
    // all koodiUris have the same version in this scenario
    return koodiUris[codeCategory][0].versio
  } else {
    return 1
  }
}

function isRoot(rootKeys: string[]) {
  return (title: string) => {
    return rootKeys.indexOf(title) > -1
  }
}

// creates (React state compatible) immutable state for formData
function updateValue(data: any, pathArray: string[], value: any): any {
  const [firstPath, ...rest] = pathArray
  if (!rest.length) {
    return { ...data, [firstPath]: value }
  } else if (!isNaN(Number(firstPath))) {
    const arrCopy = [...data]
    arrCopy[Number(firstPath)] = updateValue(data[firstPath], rest, value)
    return arrCopy
  } else {
    return { ...data, [firstPath]: updateValue(data[firstPath], rest, value) }
  }
}

// updates related code version value when code uri is selected or unselected
function updateCodeVersionAt(
  path: string,
  selected: boolean,
  formData: any,
  koodiUris: any
) {
  const pathArray = idToPathArray(path.replace("koodi-uri", "koodi-versio"))
  const lastPath: keyof typeof codeCategoriesForPaths = pathArray[
    pathArray.length - 1
  ] as keyof typeof codeCategoriesForPaths

  return updateValue(
    formData,
    pathArray,
    selected ? codeVersionByPath(lastPath, koodiUris) : undefined
  )
}

const fields = {
  SchemaField: CustomSchemaField,
  typeahead: TypeaheadField,
  DescriptionField: CustomDescriptionField
}

const widgets = {
  CheckboxWidget: CustomCheckboxWidget
}

const Container = styled("div")`
  margin: 0 40px 60px 40px;
`

const FormContainer = styled("div")`
  margin: 10px 0 0 0;
`

const Header = styled(Heading)`
  margin: 0;
  padding-right: 10px;
`

const TopToolbar = styled("div")`
  position: sticky;
  left: 0;
  top: 0;
  width: 100%;
  background: rgba(255, 255, 255, 0.95);
  border-bottom: 1px solid #ccc;
  display: flex;
  z-index: 1;
  padding: 5px 0;
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

const ClearButton = styled(Button)`
  background: transparent;
  color: #000;
`

interface LuoHOKSProps {
  path?: string
  store?: IRootStore
}

interface LuoHOKSState {
  schema: JSONSchema6
  formData: { [name: string]: any }
  errors: AjvError[]
  isLoading: boolean
  success: boolean | undefined
  userEnteredText: boolean
  uiSchema?: ReturnType<typeof uiSchemaByStep>
  rawSchema: JSONSchema6
  currentStep: number
  errorsByStep: { [index: string]: AjvError[] }
  koodiUris: { [key in keyof typeof koodistoUrls]: any[] }
  message?: string
  clearModalOpen: boolean
}

@inject("store")
@observer
export class LuoHOKS extends React.Component<LuoHOKSProps, LuoHOKSState> {
  state: LuoHOKSState = {
    schema: {},
    formData: {},
    uiSchema: undefined,
    errors: [],
    isLoading: true,
    success: undefined,
    userEnteredText: false,
    currentStep: 0,
    rawSchema: {},
    koodiUris: buildKoodiUris(),
    errorsByStep: {},
    message: undefined,
    clearModalOpen: false
  }

  async fetchKoodiUris() {
    const requests = await Promise.all(
      Object.keys(koodistoUrls).map(async (key: keyof typeof koodistoUrls) => {
        const json = await window.fetch(koodistoUrls[key]).then(r => r.json())
        return { key, value: json.map(mapKoodiUri) }
      })
    )
    return requests.reduce<{ [key in keyof typeof koodistoUrls]: any[] }>(
      (koodiUris, koodiUriObj) => {
        koodiUris[koodiUriObj.key] = koodiUriObj.value
        return koodiUris
      },
      buildKoodiUris()
    )
  }

  async componentDidMount() {
    const json: any = await this.props.store!.environment.fetchSwaggerJSON()
    const rawSchema = {
      definitions: stripUnsupportedFormats(json.definitions),
      ...json.definitions.HOKSLuonti
    }
    const koodiUris = await this.fetchKoodiUris()
    const schema = schemaByStep(rawSchema, this.state.currentStep)
    const {
      formData = {},
      errors = [],
      errorsByStep = {}
    } = window.localStorage.getItem("hoks")
      ? JSON.parse(window.localStorage.getItem("hoks") || "")
      : {}
    this.setState({
      formData,
      errors,
      errorsByStep,
      rawSchema,
      schema,
      koodiUris,
      uiSchema: uiSchemaByStep(koodiUris, this.state.currentStep),
      isLoading: false
    })
  }

  nextStep = () => {
    this.setState(state => {
      const nextStep = state.currentStep + 1
      return {
        ...state,
        schema: schemaByStep(state.rawSchema, nextStep),
        uiSchema: uiSchemaByStep(state.koodiUris, nextStep),
        currentStep: nextStep
      }
    })
  }

  previousStep = () => {
    this.setState(state => {
      const previousStep = state.currentStep - 1
      return {
        ...state,
        schema: schemaByStep(state.rawSchema, previousStep),
        uiSchema: uiSchemaByStep(state.koodiUris, previousStep),
        currentStep: previousStep
      }
    })
  }

  setStep = (index: number) => {
    this.setState(state => {
      return {
        ...state,
        schema: schemaByStep(state.rawSchema, index),
        uiSchema: uiSchemaByStep(state.koodiUris, index),
        currentStep: index
      }
    })
  }

  setErrors = (errors: AjvError[]) => {
    this.setState({ errors })
  }

  onChange = (changes: any) => {
    const { formData, errors } = changes
    this.setState(
      state => ({
        ...state,
        formData,
        errors,
        errorsByStep: { ...state.errorsByStep, [state.currentStep]: errors }
      }),
      () => {
        const { errorsByStep } = this.state
        window.localStorage.setItem(
          "hoks",
          JSON.stringify({ formData, errors, errorsByStep })
        )
      }
    )
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
    this.setState({ isLoading: true })

    const request = await window.fetch(
      `/ehoks-virkailija-backend/api/v1/virkailija/oppijat/${
        fieldProps.formData["oppija-oid"]
      }/hoksit`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          Accept: "application/json; charset=utf-8",
          // "Caller-Id": ""
          "Content-Type": "application/json"
          // ticket: """
        },
        body: JSON.stringify(fieldProps.formData)
      }
    )
    const json = await request.json()

    if (request.status === 200) {
      this.setState({
        formData: {},
        errors: [],
        errorsByStep: {},
        success: true,
        userEnteredText: false
      })
      window.localStorage.removeItem("hoks")
    } else {
      this.setState({ success: false })
    }
    console.log("RESPONSE STATUS", request.status)
    console.log("RESPONSE JSON", json)
    this.setState({ isLoading: false })
  }

  completedSteps = () => {
    return Object.keys(this.state.errorsByStep).reduce<{
      [index: string]: boolean
    }>((steps, index) => {
      steps[index] = this.state.errorsByStep[index].length === 0
      return steps
    }, {})
  }

  isValid = () => {
    const completedSteps = this.completedSteps()
    return Object.keys(completedSteps).every(stepIndex => {
      return completedSteps[stepIndex]
    })
  }

  formContext = () => {
    const rootKeys = Object.keys(this.state.rawSchema.properties || {})
    return {
      isRoot: isRoot(rootKeys),
      koodiUriSelected: (path: string, selected: boolean) => {
        this.setState(
          state => {
            return {
              ...state,
              formData: updateCodeVersionAt(
                path,
                selected,
                state.formData,
                state.koodiUris
              )
            }
          },
          () => {
            const { formData, errors, errorsByStep } = this.state
            window.localStorage.setItem(
              "hoks",
              JSON.stringify({ formData, errors, errorsByStep })
            )
          }
        )
      }
    }
  }

  openClearModal = () => {
    this.setState({ clearModalOpen: true })
  }

  closeClearModal = () => {
    this.setState({ clearModalOpen: false })
  }

  resetForm = () => {
    this.setState({
      formData: {},
      errors: [],
      success: undefined,
      userEnteredText: false,
      currentStep: 0,
      errorsByStep: {},
      message: undefined,
      clearModalOpen: false
    })
  }

  render() {
    const { clearModalOpen } = this.state
    return (
      <Container onKeyUp={this.userHasEnteredText}>
        <TopToolbar id="topToolbar">
          <Header>Luo HOKS</Header>
          <Stepper
            currentStep={this.state.currentStep}
            updateStep={this.setStep}
            completed={this.completedSteps}
            disabled={this.state.isLoading}
          >
            <Step>Perustiedot</Step>
            <Step>Aiemmin hankitut ammatilliset tutkinnon osat</Step>
            <Step>Aiemmin hankitut paikalliset tutkinnon osat</Step>
            <Step>Aiemmin hankitut yhteiset tutkinnon osat</Step>
            <Step>Hankittavat ammatilliset tutkinnon osat</Step>
            <Step>Hankittavat paikalliset tutkinnon osat</Step>
            <Step>Hankittavat yhteiset tutkinnon osat</Step>
            <Step>Opiskeluvalmiuksia tukevat opinnot</Step>
          </Stepper>
        </TopToolbar>
        <FormContainer>
          <Form
            fields={fields}
            widgets={widgets}
            schema={this.state.schema}
            uiSchema={this.state.uiSchema}
            formData={this.state.formData as any}
            formContext={this.formContext()}
            onChange={this.onChange}
            onSubmit={this.create}
            onError={this.setErrors}
            ErrorList={ErrorList}
            transformErrors={transformErrors}
            ArrayFieldTemplate={ArrayFieldTemplate}
            safeRenderCompletion={true}
            liveValidate={true}
            noHtml5Validate={true}
          >
            <BottomToolbar>
              <ButtonsContainer>
                <Button type="submit" disabled={!this.isValid()}>
                  Luo HOKS
                </Button>
                <ClearButton onClick={this.openClearModal}>
                  Tyhjennä
                </ClearButton>
                <ModalDialog
                  open={clearModalOpen}
                  closeModal={this.closeClearModal}
                  label="Haluatko varmasti tyhjentää lomakkeen?"
                >
                  <p>Haluatko varmasti tyhjentää lomakkeen?</p>
                  <Button onClick={this.resetForm}>Tyhjennä</Button>
                  <ClearButton onClick={this.closeClearModal}>
                    Peruuta
                  </ClearButton>
                </ModalDialog>
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
                      defaultMessage={
                        this.state.message
                          ? this.state.message
                          : "HOKSin luonti epäonnistui"
                      }
                    />
                  </FailureMessage>
                )}

                {/* <Button onClick={this.previousStep}>Edellinen</Button>
                <Button onClick={this.nextStep}>Seuraava</Button> */}
              </ButtonsContainer>
            </BottomToolbar>
          </Form>
        </FormContainer>
      </Container>
    )
  }
}
