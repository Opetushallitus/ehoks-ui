import { RouteComponentProps } from "@reach/router"
import { Button } from "components/Button"
import { LoadingSpinner } from "components/LoadingSpinner"
import { ModalDialog } from "components/ModalDialogs/ModalDialog"
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
import { ClearButton } from "./HOKSLomake/ClearButton"
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
  reportHOKSErrors,
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
import { propertiesByStep, uiSchemaByStep } from "./LuoHOKS/uiSchema"
import { appendCommonHeaders } from "fetchUtils"

interface LuoHOKSProps extends RouteComponentProps {
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
  static contextTypes = {
    intl: intlShape
  }

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

  async componentDidMount() {
    const json: any = await this.props.store!.environment.fetchSwaggerJSON()
    const rawSchema = {
      definitions: stripUnsupportedFormats(json.definitions),
      ...json.definitions.HOKSLuonti
    }
    const koodiUris = await fetchKoodiUris()
    const schema = schemaByStep(
      rawSchema,
      propertiesByStep,
      this.state.currentStep
    )
    const {
      formData = {},
      errors = [],
      errorsByStep = {}
    } = window.sessionStorage.getItem("hoks")
      ? JSON.parse(window.sessionStorage.getItem("hoks") || "")
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
    this.setState(
      state => ({
        ...state,
        formData,
        errors,
        errorsByStep: { ...state.errorsByStep, [state.currentStep]: errors }
      }),
      () => {
        const { errorsByStep } = this.state
        window.sessionStorage.setItem(
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
    const { notifications } = this.props.store!
    notifications.markAllErrorsHandled()

    const request = await window.fetch(
      `/ehoks-virkailija-backend/api/v1/virkailija/oppijat/${fieldProps.formData["oppija-oid"]}/hoksit`,
      {
        method: "POST",
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
    const json = await request.json()

    if (request.status === 200) {
      this.setState({
        formData: {},
        errors: [],
        errorsByStep: {},
        success: true,
        message: undefined,
        userEnteredText: false
      })
      window.sessionStorage.removeItem("hoks")
    } else {
      this.setState({ success: false, message: undefined })
      const { intl } = this.context
      reportHOKSErrors(json, intl, (errorId: string, message: string) => {
        notifications.addError(errorId, message)
        this.setState({ message })
      })
    }
    this.setState({ isLoading: false })
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
      koodiUriSelected: koodiUriSelected(this, () => {
        const { formData, errors, errorsByStep } = this.state
        window.sessionStorage.setItem(
          "hoks",
          JSON.stringify({ formData, errors, errorsByStep })
        )
      })
    }
  }

  openClearModal = () => {
    this.setState({ clearModalOpen: true })
  }

  closeClearModal = () => {
    this.setState({ clearModalOpen: false })
  }

  resetForm = () => {
    this.setState(
      {
        formData: {},
        errors: [],
        success: undefined,
        userEnteredText: false,
        currentStep: 0,
        errorsByStep: {},
        message: undefined,
        clearModalOpen: false
      },
      () => {
        window.sessionStorage.setItem(
          "hoks",
          JSON.stringify({ formData: {}, errors: [], errorsByStep: {} })
        )
      }
    )
  }

  render() {
    const { clearModalOpen } = this.state
    return (
      <HOKSFormContainer onKeyUp={this.userHasEnteredText}>
        <EditHOKSStyles />
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
            <Step>Hankittavat koulutuksen osat</Step>
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
          </ReactJSONSchemaForm>
        </FormContainer>
      </HOKSFormContainer>
    )
  }
}
