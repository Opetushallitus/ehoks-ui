import { TypeaheadField } from "components/react-jsonschema-form/TypeaheadField"
import { CustomBooleanRadioButtonWidget } from "./CustomBooleanRadioButtonWidget"
import { CustomCheckboxWidget } from "./CustomCheckboxWidget"
import { CustomDescriptionField } from "./CustomDescriptionField"
import { CustomSchemaField } from "./CustomSchemaField"
import { CustomDatetimeWidget } from "./CustomDatetimeWidget"

export const fields = {
  SchemaField: CustomSchemaField,
  typeahead: TypeaheadField,
  DescriptionField: CustomDescriptionField
}

export const widgets = {
  CheckboxWidget: CustomCheckboxWidget,
  customBooleanRadioButtonWidget: CustomBooleanRadioButtonWidget,
  DatetimeWidget: CustomDatetimeWidget
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
    "/ehoks-virkailija-backend/api/v1/virkailija/external/koodisto/oppisopimuksenperusta/koodi"
}

export const codeCategoriesForPaths = {
  "urasuunnitelma-koodi-versio": "urasuunnitelma",
  "tutkinnon-osa-koodi-versio": "tutkinnonosat",
  "valittu-todentamisen-prosessi-koodi-versio": "osaamisentodentamisenprosessi",
  "koodi-versio": "ammatillisenoppiaineet",
  "osa-alue-koodi-versio": "ammatillisenoppiaineet",
  "osaamisen-hankkimistapa-koodi-versio": "osaamisenhankkimistapa",
  "oppimisymparisto-koodi-versio": "oppimisymparistot",
  "oppisopimuksen-perusta-versio": "oppisopimuksenperusta"
}

export type UiSchemaOptions = { [key in keyof typeof koodistoUrls]: any[] }
