import { TypeaheadField } from "components/react-jsonschema-form/TypeaheadField"
import { CustomBooleanRadioButtonWidget } from "./CustomBooleanRadioButtonWidget"
import { CustomCheckboxWidget } from "./CustomCheckboxWidget"
import { CustomDescriptionField } from "./CustomDescriptionField"
import { CustomSchemaField } from "./CustomSchemaField"

export const fields = {
  SchemaField: CustomSchemaField,
  typeahead: TypeaheadField,
  DescriptionField: CustomDescriptionField
}

export const widgets = {
  CheckboxWidget: CustomCheckboxWidget,
  customBooleanRadioButtonWidget: CustomBooleanRadioButtonWidget
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
    "/ehoks-virkailija-backend/api/v1/virkailija/external/koodisto/oppimisymparistot/koodi"
}

export const codeCategoriesForPaths = {
  "urasuunnitelma-koodi-versio": "urasuunnitelma",
  "tutkinnon-osa-koodi-versio": "tutkinnonosat",
  "valittu-todentamisen-prosessi-koodi-versio": "osaamisentodentamisenprosessi",
  "koodi-versio": "ammatillisenoppiaineet",
  "osa-alue-koodi-versio": "ammatillisenoppiaineet",
  "osaamisen-hankkimistapa-koodi-versio": "osaamisenhankkimistapa",
  "oppimisymparisto-koodi-versio": "oppimisymparistot"
}

export type UiSchemaOptions = { [key in keyof typeof koodistoUrls]: any[] }
