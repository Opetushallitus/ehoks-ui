import { RouteComponentProps } from "@reach/router"
import { Button } from "components/Button"
import { LoadingSpinner } from "components/LoadingSpinner"
import { JSONSchema6 } from "json-schema"
import { inject, observer } from "mobx-react"
import React from "react"
import "react-bootstrap-typeahead/css/Typeahead.css"
import { FormattedMessage, intlShape } from "react-intl"
import { AjvError, FieldProps, IChangeEvent } from "react-jsonschema-form"
import { IRootStore } from "stores/RootStore"
import { ArrayFieldTemplate } from "./HOKSLomake/ArrayFieldTemplate"
import { BottomToolbar } from "./HOKSLomake/BottomToolbar"
import { ButtonsContainer } from "./HOKSLomake/ButtonsContainer"
import ErrorList from "./HOKSLomake/ErrorList"
import { FailureMessage } from "./HOKSLomake/FailureMessage"
import { fetchKoodiUris } from "./HOKSLomake/fetchKoodiUris"
import { fields, koodistoUrls, widgets } from "./HOKSLomake/formConfig"
import { FormContainer } from "./HOKSLomake/FormContainer"
import "./HOKSLomake/glyphicons/glyphicons.css"
import { Header } from "./HOKSLomake/Header"
import {
  buildKoodiUris,
  schemaByStep,
  stripUnsupportedFormats,
  transformErrors
} from "./HOKSLomake/helpers/helpers"
import { isRoot } from "./HOKSLomake/helpers/isRoot"
import { koodiUriSelected } from "./HOKSLomake/helpers/koodiUriSelected"
import { trimEmptyValues } from "./HOKSLomake/helpers/trimFormData"
import { HOKSFormContainer } from "./HOKSLomake/HOKSContainer"
import { ReactJSONSchemaForm } from "./HOKSLomake/ReactJSONSchemaForm"
import { SpinnerContainer } from "./HOKSLomake/SpinnerContainer"
import { Step } from "./HOKSLomake/Step"
import { Stepper } from "./HOKSLomake/Stepper"
import { EditHOKSStyles } from "./HOKSLomake/styles"
import { SuccessMessage } from "./HOKSLomake/SuccessMessage"
import { TopToolbar } from "./HOKSLomake/TopToolbar"
import { propertiesByStep, uiSchemaByStep } from "./MuokkaaHOKS/uiSchema"
import { appendCommonHeaders } from "fetchUtils"

const disallowedKeys = ["eid", "manuaalisyotto", "module-id"]

function trimDisallowedKeysForPUTSchema(formData: any) {
  if (typeof formData !== "object") {
    return formData
  }

  return Object.keys(formData).reduce(
    (result: Record<string, unknown>, key) => {
      if (propertyIsObject(formData[key])) {
        trimObject(key, result, formData)
      } else {
        trimPrimitive(key, result, formData)
      }

      return result
    },
    {} as any
  )
}

const propertyIsObject = (property: any) =>
  property !== null && typeof property === "object"

function trimObject(key: string, result: any, formData: any) {
  result[key] = Array.isArray(formData[key])
    ? trimArray(key, formData)
    : trimDisallowedKeysForPUTSchema(formData[key])
}

const trimArray = (key: string, formData: any) =>
  formData[key].map((element: any) => trimDisallowedKeysForPUTSchema(element))

function trimPrimitive(key: string, result: any, formData: any) {
  if (disallowedKeys.includes(key)) {
    return
  } else {
    result[key] = formData[key]
  }
}

interface MuokkaaHOKSProps extends RouteComponentProps {
  store?: IRootStore
  /* From router path */
  hoksId?: string
  /* From router path */
  oppijaOid?: string
}

interface MuokkaaHOKSState {
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
export class MuokkaaHOKS extends React.Component<
  MuokkaaHOKSProps,
  MuokkaaHOKSState
> {
  static contextTypes = {
    intl: intlShape
  }

  state: MuokkaaHOKSState = {
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

  async componentDidMount() {
    const json: any = await this.props.store!.environment.fetchSwaggerJSON()
    const hoks = await this.fetchHOKS()
    const rawSchema = {
      definitions: stripUnsupportedFormats(json.definitions),
      ...json.definitions.HOKSKorvaus
    }
    const koodiUris = await fetchKoodiUris()
    const schema = schemaByStep(
      rawSchema,
      propertiesByStep,
      this.state.currentStep
    )
    this.setState({
      formData: hoks,
      errors: [],
      errorsByStep: {},
      rawSchema,
      schema,
      koodiUris,
      uiSchema: uiSchemaByStep(koodiUris, this.state.currentStep),
      isLoading: false
    })
  }

  async fetchHOKS() {
    const { oppijaOid, hoksId } = this.props
    const request = await window.fetch(
      `/ehoks-virkailija-backend/api/v1/virkailija/oppijat/${oppijaOid}/hoksit/${hoksId}`,
      {
        credentials: "include",
        headers: appendCommonHeaders(
          new Headers({
            Accept: "application/json; charset=utf-8",
            "Content-Type": "application/json"
          })
        )
      }
    )
    const json = await request.json()
    return trimDisallowedKeysForPUTSchema(json.data)
  }

  nextStep = () => {
    this.setState(state => {
      const nextStep = state.currentStep + 1
      return {
        ...state,
        schema: schemaByStep(state.rawSchema, propertiesByStep, nextStep),
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
        schema: schemaByStep(state.rawSchema, propertiesByStep, previousStep),
        uiSchema: uiSchemaByStep(state.koodiUris, previousStep),
        currentStep: previousStep
      }
    })
  }

  setStep = (index: number) => {
    this.setState(state => ({
      ...state,
      schema: schemaByStep(state.rawSchema, propertiesByStep, index),
      uiSchema: uiSchemaByStep(state.koodiUris, index),
      currentStep: index
    }))
  }

  setErrors = (errors: AjvError[]) => {
    this.setState({ errors })
  }

  onChange = (changes: any) => {
    const { formData, errors } = changes
    this.setState(state => ({
      ...state,
      formData,
      errors,
      errorsByStep: { ...state.errorsByStep, [state.currentStep]: errors }
    }))
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

  save = async (fieldProps: IChangeEvent<FieldProps>) => {
    this.setState({ isLoading: true })
    const { notifications } = this.props.store!
    const { oppijaOid, hoksId } = this.props
    const request = await window.fetch(
      `/ehoks-virkailija-backend/api/v1/virkailija/oppijat/${oppijaOid}/hoksit/${hoksId}`,
      {
        method: "PUT",
        credentials: "include",
        headers: appendCommonHeaders(
          new Headers({
            Accept: "application/json; charset=utf-8",
            "Content-Type": "application/json"
          })
        ),
        body: JSON.stringify(trimEmptyValues(fieldProps.formData))
      }
    )
    if (request.status === 204) {
      this.setState({
        success: true,
        isLoading: false
      })
    } else {
      this.setState({ success: false, isLoading: false })

      const { intl } = this.context
      const json = await request.json()
      const hankittavatTyypit = [
        "hankittavat-ammat-tutkinnon-osat",
        "hankittavat-paikalliset-tutkinnon-osat",
        "hankittavat-yhteiset-tutkinnon-osat"
      ]
      const ohtErrors: Record<string, Record<number, number[]>> = {}
      let ohtErrorsPresent = false
      hankittavatTyypit.forEach((osaTyyppi: any) => {
        ;((json.errors || {})[osaTyyppi] || []).forEach(
          (osa: any, osaIndex: any) => {
            if (osa) {
              ;(osa["osaamisen-hankkimistavat"] || []).forEach(
                (oht: any, ohtIndex: any) => {
                  if (
                    oht &&
                    oht.includes("Tieto oppisopimuksen perustasta puuttuu")
                  ) {
                    ohtErrorsPresent = true
                    if (!ohtErrors[osaTyyppi]) {
                      ohtErrors[osaTyyppi] = {}
                    }

                    if (!ohtErrors[osaTyyppi][osaIndex]) {
                      ohtErrors[osaTyyppi][osaIndex] = []
                    }

                    ohtErrors[osaTyyppi][osaIndex].push(ohtIndex)
                  }
                }
              )
            }
          }
        )
      })

      if (ohtErrorsPresent) {
        notifications.addError(
          "HOKS.OppisopimuksenPerustaPuuttuu",
          hankittavatTyypit
            .map(ht =>
              Object.keys(ohtErrors[ht]).map(n =>
                intl.formatMessage(
                  {
                    id:
                      "errors.HOKS.Hankittavat" +
                      (ht.includes("ammat")
                        ? "Ammat"
                        : ht.includes("paikalliset")
                        ? "Paikalliset"
                        : "Yhteiset") +
                      "OsaamisenHankkimistavoissa"
                  },
                  {
                    index: n,
                    ohts: ohtErrors[ht][Number(n)].join(", ")
                  }
                )
              )
            )
            .join("; ")
        )
      }
    }
  }

  completedSteps = () =>
    Object.keys(this.state.errorsByStep).reduce<{
      [index: string]: boolean
    }>((steps, index) => {
      steps[index] = this.state.errorsByStep[index].length === 0
      return steps
    }, {})

  isValid = () => {
    const completedSteps = this.completedSteps()
    return Object.keys(completedSteps).every(
      stepIndex => completedSteps[stepIndex]
    )
  }

  formContext = () => {
    const rootKeys = Object.keys(this.state.rawSchema.properties || {})
    return {
      isRoot: isRoot(rootKeys),
      koodiUriSelected: koodiUriSelected(this)
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
    return (
      <HOKSFormContainer onKeyUp={this.userHasEnteredText}>
        <EditHOKSStyles />
        <TopToolbar id="topToolbar">
          <Header>Muokkaa HOKSia</Header>
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
          <ReactJSONSchemaForm
            fields={fields}
            widgets={widgets}
            schema={this.state.schema}
            uiSchema={this.state.uiSchema}
            formData={this.state.formData as any}
            formContext={this.formContext()}
            onChange={this.onChange}
            onSubmit={this.save}
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
                  Tallenna HOKS
                </Button>
                {this.state.isLoading && (
                  <SpinnerContainer>
                    <LoadingSpinner />
                  </SpinnerContainer>
                )}
                {this.state.success && (
                  <SuccessMessage onClick={this.hideMessage}>
                    <FormattedMessage
                      id="muokkaaHoks.tallennusOnnistui"
                      defaultMessage="HOKS tallennettiin onnistuneesti"
                    />
                  </SuccessMessage>
                )}
                {this.state.success === false && (
                  <FailureMessage onClick={this.hideMessage}>
                    <FormattedMessage
                      id="muokkaaHoks.tallennusEpaonnistui"
                      defaultMessage={
                        this.state.message
                          ? this.state.message
                          : "HOKSin tallennus epäonnistui"
                      }
                    />
                  </FailureMessage>
                )}

                {/* <Button onClick={this.previousStep}>Edellinen</Button>
                <Button onClick={this.nextStep}>Seuraava</Button> */}
              </ButtonsContainer>
            </BottomToolbar>
          </ReactJSONSchemaForm>
        </FormContainer>
      </HOKSFormContainer>
    )
  }
}
