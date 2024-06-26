import { TypeaheadField } from "components/react-jsonschema-form/TypeaheadField"
import { CustomBooleanRadioButtonWidget } from "./CustomBooleanRadioButtonWidget"
import { CustomCheckboxWidget } from "./CustomCheckboxWidget"
import { CustomDescriptionField } from "./CustomDescriptionField"
import { CustomNumberWidget } from "./CustomNumberWidget"
import { CustomSchemaField } from "./CustomSchemaField"
import { CustomDatetimeWidget } from "./CustomDatetimeWidget"
import { TemplatesType, RegistryFieldsType } from "@rjsf/utils"
import { ArrayFieldTemplate } from "./ArrayFieldTemplate"
import ErrorList from "./ErrorList"

export const fields: RegistryFieldsType = {
  SchemaField: CustomSchemaField,
  typeahead: TypeaheadField,
  DescriptionField: CustomDescriptionField
}

export const widgets = {
  CheckboxWidget: CustomCheckboxWidget,
  customBooleanRadioButtonWidget: CustomBooleanRadioButtonWidget,
  DatetimeWidget: CustomDatetimeWidget,
  NumberWidget: CustomNumberWidget
}

export const koodistoUrls = {
  urasuunnitelma:
    "/ehoks-virkailija-backend/api/v1/virkailija/external/koodisto/urasuunnitelma/koodi",
  tutkinnonosat:
    "/ehoks-virkailija-backend/api/v1/virkailija/external/koodisto/tutkinnonosat/koodi",
  osaamisentodentamisenprosessi:
    "/ehoks-virkailija-backend/api/v1/virkailija/external/koodisto/osaamisentodentamisenprosessi/koodi",
  osaamisenhankkimistapa:
    "/ehoks-virkailija-backend/api/v1/virkailija/external/koodisto/osaamisenhankkimistapa/koodi",
  ammatillisenoppiaineet:
    "/ehoks-virkailija-backend/api/v1/virkailija/external/koodisto/ammatillisenoppiaineet/koodi",
  oppimisymparistot:
    "/ehoks-virkailija-backend/api/v1/virkailija/external/koodisto/oppimisymparistot/koodi",
  oppisopimuksenperusta:
    "/ehoks-virkailija-backend/api/v1/virkailija/external/koodisto/oppisopimuksenperusta/koodi",
  koulutuksenosat:
    "/ehoks-virkailija-backend/api/v1/virkailija/external/koodisto/koulutuksenosattuva/koodi"
}

export const codeCategoriesForPaths = {
  "urasuunnitelma-koodi-versio": "urasuunnitelma",
  "tutkinnon-osa-koodi-versio": "tutkinnonosat",
  "valittu-todentamisen-prosessi-koodi-versio": "osaamisentodentamisenprosessi",
  "koodi-versio": "ammatillisenoppiaineet",
  "osa-alue-koodi-versio": "ammatillisenoppiaineet",
  "osaamisen-hankkimistapa-koodi-versio": "osaamisenhankkimistapa",
  "oppimisymparisto-koodi-versio": "oppimisymparistot",
  "oppisopimuksen-perusta-koodi-versio": "oppisopimuksenperusta",
  "koulutuksen-osa-koodi-versio": "koulutuksenosattuva"
}

export type UiSchemaOptions = { [key in keyof typeof koodistoUrls]: any[] }

export const templates: Partial<TemplatesType> = {
  ArrayFieldTemplate,
  ErrorListTemplate: ErrorList
}
