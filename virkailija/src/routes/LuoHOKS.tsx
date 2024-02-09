import { useNavigate } from "react-router"
import { Button } from "components/Button"
import { LoadingSpinner } from "components/LoadingSpinner"
import { ModalDialog } from "components/ModalDialogs/ModalDialog"
import { JSONSchema7 } from "json-schema"
import { inject, observer } from "mobx-react"
import React, { useState, useEffect } from "react"
import "react-bootstrap-typeahead/css/Typeahead.css"
import { useIntl, FormattedMessage } from "react-intl"
import { AjvError, FieldProps, IChangeEvent } from "@rjsf/core"
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

interface LuoHOKSProps {
  store?: IRootStore
}

interface LuoHOKSState {
  schema: JSONSchema7
  formData: { [name: string]: any }
  errors: AjvError[]
  isLoading: boolean
  success: boolean | undefined
  userEnteredText: boolean
  uiSchema?: ReturnType<typeof uiSchemaByStep>
  rawSchema: JSONSchema7
  currentStep: number
  errorsByStep: { [index: string]: AjvError[] }
  koodiUris: { [key in keyof typeof koodistoUrls]: any[] }
  message?: string
  clearModalOpen: boolean
  confirmCloseListenerExists: boolean
}

export const LuoHOKS = inject("store")(
  observer((props: LuoHOKSProps) => {
    const navigate = useNavigate()
    const intl = useIntl()
    const [state, setState] = useState<LuoHOKSState>({
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
      clearModalOpen: false,
      confirmCloseListenerExists: false
    })

    const confirmClose = (ev: BeforeUnloadEvent) => {
      if (state?.success) {
        removeBeforeUnloadListener()
      } else {
        ev.preventDefault()
        ev.returnValue = intl.formatMessage({
          id: "luoHoks.haluatkoPoistua"
        })
        return ev.returnValue
      }
    }

    const addBeforeUnloadListener = () => {
      if (!state.confirmCloseListenerExists) {
        // confirmation when closing the window/page
        window.addEventListener("beforeunload", confirmClose)
        setState({
          ...state,
          confirmCloseListenerExists: true
        })
      }
    }

    const removeBeforeUnloadListener = () => {
      if (state.confirmCloseListenerExists) {
        window.removeEventListener("beforeunload", confirmClose)
        setState({
          ...state,
          confirmCloseListenerExists: false
        })
      }
    }

    const formDataExists = () => {
      const { formData } = state
      return typeof formData === "object" && Object.keys(formData).length > 0
    }

    useEffect(() => {
      props.store!.environment.fetchSwaggerJSON().then(async json => {
        const rawSchema = {
          definitions: stripUnsupportedFormats(json.definitions),
          ...json.definitions.HOKSLuonti
        }
        const koodiUris = await fetchKoodiUris()
        const schema = schemaByStep(
          rawSchema,
          propertiesByStep,
          state.currentStep
        )
        const {
          formData = {},
          errors = [],
          errorsByStep = {}
        } = window.sessionStorage.getItem("hoks")
          ? JSON.parse(window.sessionStorage.getItem("hoks") || "")
          : {}
        setState({
          ...state,
          formData,
          errors,
          errorsByStep,
          rawSchema,
          schema,
          koodiUris,
          uiSchema: uiSchemaByStep(koodiUris, state.currentStep),
          isLoading: false
        })
        if (formDataExists()) {
          addBeforeUnloadListener()
        }
      })

      return () => {
        const { success } = state
        // confirmation when navigating to another ehoks page
        if (
          formDataExists() &&
          !success &&
          !confirm(
            intl.formatMessage({
              id: "luoHoks.haluatkoPoistua"
            })
          )
        ) {
          // navigate "back" to hoks form
          navigate("/ehoks-virkailija-ui/luohoks")
        } else {
          removeBeforeUnloadListener()
        }
      }
    }, [])

    /*
    const nextStep = () => {
      const nStep = state.currentStep + 1
      setState({
        ...state,
        schema: schemaByStep(state.rawSchema, propertiesByStep, nStep),
        uiSchema: uiSchemaByStep(state.koodiUris, nStep),
        currentStep: nStep
      })
    }

    const previousStep = () => {
      const pStep = state.currentStep - 1
      setState({
        ...state,
        schema: schemaByStep(state.rawSchema, propertiesByStep, pStep),
        uiSchema: uiSchemaByStep(state.koodiUris, pStep),
        currentStep: pStep
      })
    }
    */

    const setStep = (index: number) => {
      setState({
        ...state,
        schema: schemaByStep(state.rawSchema, propertiesByStep, index),
        uiSchema: uiSchemaByStep(state.koodiUris, index),
        currentStep: index
      })
    }

    const setErrors = (errors: AjvError[]) => {
      setState({ ...state, errors })
    }

    const onChange = (changes: any) => {
      const { formData, errors } = changes
      setState({
        ...state,
        success: undefined,
        formData,
        errors,
        errorsByStep: { ...state.errorsByStep, [state.currentStep]: errors }
      })
      const { errorsByStep } = state
      window.sessionStorage.setItem(
        "hoks",
        JSON.stringify({ formData, errors, errorsByStep })
      )
      if (formDataExists()) {
        addBeforeUnloadListener()
      }
    }

    /*
    const scrollToErrors = (event: React.MouseEvent) => {
      event.preventDefault()
      const element = document.querySelector("#form-errors")
      if (element) {
        element.scrollIntoView()
      }
    }
    */

    const hideMessage = () => {
      setState({ ...state, success: undefined })
    }

    const userHasEnteredText = () => {
      setState({ ...state, userEnteredText: true })
    }

    const create = async (fieldProps: IChangeEvent<FieldProps>) => {
      setState({ ...state, isLoading: true })
      const { notifications } = props.store!
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
        setState({
          ...state,
          formData: {},
          errors: [],
          errorsByStep: {},
          success: true,
          message: undefined,
          userEnteredText: false
        })
        window.sessionStorage.removeItem("hoks")
        removeBeforeUnloadListener()
      } else {
        setState({ ...state, success: false, message: undefined })
        reportHOKSErrors(json, intl, (errorId: string, message: string) => {
          notifications.addError(errorId, message)
          setState({ ...state, message })
        })
      }
      setState({ ...state, isLoading: false })
    }

    const completedSteps = () =>
      Object.keys(state.errorsByStep).reduce<{
        [index: string]: boolean
      }>((steps, index) => {
        steps[index] = state.errorsByStep[index].length === 0
        return steps
      }, {})

    const isValid = () => {
      const cSteps = completedSteps()
      return Object.keys(cSteps).every(stepIndex => cSteps[stepIndex])
    }

    const formContext = () => {
      const rootKeys = Object.keys(state.rawSchema.properties || {})
      return {
        isRoot: isRoot(rootKeys),
        koodiUriSelected: koodiUriSelected(this, () => {
          const { formData, errors, errorsByStep } = state
          window.sessionStorage.setItem(
            "hoks",
            JSON.stringify({ formData, errors, errorsByStep })
          )
        })
      }
    }

    const openClearModal = () => {
      setState({ ...state, clearModalOpen: true })
    }

    const closeClearModal = () => {
      setState({ ...state, clearModalOpen: false })
    }

    const resetForm = () => {
      setState({
        ...state,
        formData: {},
        errors: [],
        success: undefined,
        userEnteredText: false,
        currentStep: 0,
        errorsByStep: {},
        message: undefined,
        clearModalOpen: false
      })
      window.sessionStorage.setItem(
        "hoks",
        JSON.stringify({ formData: {}, errors: [], errorsByStep: {} })
      )
    }

    const { clearModalOpen } = state
    return (
      <HOKSFormContainer onKeyUp={userHasEnteredText}>
        <EditHOKSStyles />
        <TopToolbar id="topToolbar">
          <Header>Luo HOKS</Header>
          <Stepper
            currentStep={state.currentStep}
            updateStep={setStep}
            completed={completedSteps}
            disabled={state.isLoading}
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
            schema={state.schema}
            uiSchema={state.uiSchema}
            formData={state.formData as any}
            formContext={formContext()}
            onChange={onChange}
            onSubmit={create}
            onError={setErrors}
            ErrorList={ErrorList}
            transformErrors={transformErrors}
            ArrayFieldTemplate={ArrayFieldTemplate}
            liveValidate={true}
            noHtml5Validate={true}
          >
            <BottomToolbar>
              <ButtonsContainer>
                <Button type="submit" disabled={!isValid()}>
                  Luo HOKS
                </Button>
                <ClearButton onClick={openClearModal}>Tyhjennä</ClearButton>
                <ModalDialog
                  open={clearModalOpen}
                  closeModal={closeClearModal}
                  label="Haluatko varmasti tyhjentää lomakkeen?"
                >
                  <p>Haluatko varmasti tyhjentää lomakkeen?</p>
                  <Button onClick={resetForm}>Tyhjennä</Button>
                  <ClearButton onClick={closeClearModal}>Peruuta</ClearButton>
                </ModalDialog>
                {state.isLoading && (
                  <SpinnerContainer>
                    <LoadingSpinner />
                  </SpinnerContainer>
                )}
                {state.success && (
                  <SuccessMessage onClick={hideMessage}>
                    <FormattedMessage
                      id="luoHoks.luontiOnnistui"
                      defaultMessage="HOKS luotiin onnistuneesti"
                    />
                  </SuccessMessage>
                )}
                {state.success === false && (
                  <FailureMessage onClick={hideMessage}>
                    <FormattedMessage
                      id="luoHoks.luontiEpaonnistui"
                      defaultMessage={
                        state.message
                          ? state.message
                          : "HOKSin luonti epäonnistui"
                      }
                    />
                  </FailureMessage>
                )}

                {/* <Button onClick={previousStep}>Edellinen</Button>
              <Button onClick={nextStep}>Seuraava</Button> */}
              </ButtonsContainer>
            </BottomToolbar>
          </ReactJSONSchemaForm>
        </FormContainer>
      </HOKSFormContainer>
    )
  })
)
