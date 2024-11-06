import { Button } from "components/Button"
import { LoadingSpinner } from "components/LoadingSpinner"
import { inject, observer } from "mobx-react"
import React, { useState, useEffect } from "react"
import "react-bootstrap-typeahead/css/Typeahead.css"
import { useIntl, FormattedMessage } from "react-intl"
import { IChangeEvent } from "@rjsf/core"
import { FieldProps, RJSFSchema, RJSFValidationError } from "@rjsf/utils"
import { IRootStore } from "stores/RootStore"
import { BottomToolbar } from "./HOKSLomake/BottomToolbar"
import { ButtonsContainer } from "./HOKSLomake/ButtonsContainer"
import { FailureMessage } from "./HOKSLomake/FailureMessage"
import { fetchKoodiUris } from "./HOKSLomake/fetchKoodiUris"
import {
  fields,
  koodistoUrls,
  widgets,
  templates
} from "./HOKSLomake/formConfig"
import { FormContainer } from "./HOKSLomake/FormContainer"
import "./HOKSLomake/glyphicons/glyphicons.css"
import { Header } from "./HOKSLomake/Header"
import {
  buildKoodiUris,
  schemaByStep,
  convertSchemaDefinitions,
  reportHOKSErrors,
  transformErrors
} from "./HOKSLomake/helpers/helpers"
import { isRoot } from "./HOKSLomake/helpers/isRoot"
import { koodiUriSelected } from "./HOKSLomake/helpers/koodiUriSelected"
import { trimEmptyValues } from "./HOKSLomake/helpers/trimFormData"
import { HOKSFormContainer } from "./HOKSLomake/HOKSContainer"
import { SpinnerContainer } from "./HOKSLomake/SpinnerContainer"
import { Step } from "./HOKSLomake/Step"
import { Stepper } from "./HOKSLomake/Stepper"
import { EditHOKSStyles } from "./HOKSLomake/styles"
import { SuccessMessage } from "./HOKSLomake/SuccessMessage"
import { TopToolbar } from "./HOKSLomake/TopToolbar"
import { propertiesByStep, uiSchemaByStep } from "./MuokkaaHOKS/uiSchema"
import { appendCommonHeaders } from "fetchUtils"
import { useParams, useNavigate } from "react-router"
import validator from "@rjsf/validator-ajv8"
import ReactJSONSchemaForm from "./HOKSLomake/ReactJSONSchemaForm"

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
}

interface MuokkaaHOKSState {
  schema: RJSFSchema
  formData: { [name: string]: any }
  errors: RJSFValidationError[]
  isLoading: boolean
  success: boolean | undefined
  userEnteredText: boolean
  uiSchema?: ReturnType<typeof uiSchemaByStep>
  rawSchema: RJSFSchema
  currentStep: number
  errorsByStep: { [index: string]: RJSFValidationError[] }
  koodiUris: { [key in keyof typeof koodistoUrls]: any[] }
  message?: string
  clearModalOpen: boolean
}

export const MuokkaaHOKS = inject("store")(
  observer((props: MuokkaaHOKSProps) => {
    const navigate = useNavigate()
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
    const { oppijaOid, hoksId } = useParams()
    const { environment, notifications } = props.store!

    useEffect(() => {
      environment.fetchSwaggerJSON().then((json) =>
        fetchHOKS().then((hoks) => {
          const rawSchema = {
            definitions: convertSchemaDefinitions(json.definitions),
            ...json.definitions.HOKSKorvaus
          }
          fetchKoodiUris().then((koodiUris) => {
            const schema = schemaByStep(
              rawSchema,
              propertiesByStep,
              state.currentStep
            )
            setState((s) => ({
              ...s,
              formData: hoks,
              errors: [],
              errorsByStep: {},
              rawSchema,
              schema,
              koodiUris,
              uiSchema: uiSchemaByStep(koodiUris, state.currentStep),
              isLoading: false
            }))
          })
        })
      )
    }, [environment])

    const fetchHOKS = async () => {
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
      if (!request.ok) {
        throw new Error(json)
      }
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

    const setErrors = (errors: RJSFValidationError[]) => {
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
      setState((s) => ({
        ...s,
        isLoading: true,
        success: undefined,
        message: undefined
      }))
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
        fetchHOKS()
          .then((hoks) => {
            setState((s) => ({
              ...s,
              formData: hoks,
              success: true,
              isLoading: false,
              message: undefined
            }))
          })
          .catch((_) =>
            navigate(`/ehoks-virkailija-ui/hoks/${oppijaOid}/${hoksId}`)
          )
      } else {
        setState((s) => ({
          ...s,
          success: false,
          isLoading: false,
          message: undefined
        }))
        const json = await request.json()
        reportHOKSErrors(json, intl, (errorId: string, message: string) => {
          notifications.addError(errorId, message)
          setState((s) => ({ ...s, message }))
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
      return Object.keys(cSteps).every((stepIndex) => cSteps[stepIndex])
    }

    const formContext = () => {
      const rootKeys = Object.keys(state.rawSchema.properties || {})
      return {
        isRoot: isRoot(rootKeys),
        koodiUriSelected: koodiUriSelected(setState)
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
            templates={templates}
            transformErrors={transformErrors}
            liveValidate={true}
            noHtml5Validate={true}
            validator={validator}
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
