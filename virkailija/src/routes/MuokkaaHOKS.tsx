import { Button } from "components/Button"
import { LoadingSpinner } from "components/LoadingSpinner"
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

interface MuokkaaHOKSProps {
  store?: IRootStore
  /* From router path */
  hoksId?: string
  /* From router path */
  oppijaOid?: string
}

interface MuokkaaHOKSState {
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
}

export const MuokkaaHOKS = inject("store")(
  observer((props: MuokkaaHOKSProps) => {
    const [state, setState] = useState<MuokkaaHOKSState>({
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
    })
    const intl = useIntl()

    useEffect(() => {
      props.store!.environment.fetchSwaggerJSON().then(json =>
        fetchHOKS().then(hoks => {
          const rawSchema = {
            definitions: stripUnsupportedFormats(json.definitions),
            ...json.definitions.HOKSKorvaus
          }
          fetchKoodiUris().then(koodiUris => {
            const schema = schemaByStep(
              rawSchema,
              propertiesByStep,
              state.currentStep
            )
            setState({
              ...state,
              formData: hoks,
              errors: [],
              errorsByStep: {},
              rawSchema,
              schema,
              koodiUris,
              uiSchema: uiSchemaByStep(koodiUris, state.currentStep),
              isLoading: false
            })
          })
        })
      )
    }, [])

    const fetchHOKS = async () => {
      const { oppijaOid, hoksId } = props
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
        formData,
        errors,
        errorsByStep: { ...state.errorsByStep, [state.currentStep]: errors }
      })
    }

    const hideMessage = () => {
      setState({ ...state, success: undefined })
    }

    const userHasEnteredText = () => {
      setState({ ...state, userEnteredText: true })
    }

    const save = async (fieldProps: IChangeEvent<FieldProps>) => {
      setState({ ...state, isLoading: true })
      const { notifications } = props.store!
      const { oppijaOid, hoksId } = props
      notifications.markAllErrorsHandled()

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
        setState({
          ...state,
          success: true,
          isLoading: false,
          message: undefined
        })
      } else {
        setState({
          ...state,
          success: false,
          isLoading: false,
          message: undefined
        })
        const json = await request.json()
        reportHOKSErrors(json, intl, (errorId: string, message: string) => {
          notifications.addError(errorId, message)
          setState({ ...state, message })
        })
      }
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
        koodiUriSelected: koodiUriSelected(this)
      }
    }

    return (
      <HOKSFormContainer onKeyUp={userHasEnteredText}>
        <EditHOKSStyles />
        <TopToolbar id="topToolbar">
          <Header>Muokkaa HOKSia</Header>
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
            onSubmit={save}
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
                  Tallenna HOKS
                </Button>
                {state.isLoading && (
                  <SpinnerContainer>
                    <LoadingSpinner />
                  </SpinnerContainer>
                )}
                {state.success && (
                  <SuccessMessage onClick={hideMessage}>
                    <FormattedMessage
                      id="muokkaaHoks.tallennusOnnistui"
                      defaultMessage="HOKS tallennettiin onnistuneesti"
                    />
                  </SuccessMessage>
                )}
                {state.success === false && (
                  <FailureMessage onClick={hideMessage}>
                    <FormattedMessage
                      id="muokkaaHoks.tallennusEpaonnistui"
                      defaultMessage={
                        state.message
                          ? state.message
                          : "HOKSin tallennus epäonnistui"
                      }
                    />
                  </FailureMessage>
                )}
              </ButtonsContainer>
            </BottomToolbar>
          </ReactJSONSchemaForm>
        </FormContainer>
      </HOKSFormContainer>
    )
  })
)
