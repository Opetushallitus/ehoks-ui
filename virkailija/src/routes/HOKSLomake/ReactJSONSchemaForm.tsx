import Form from "react-jsonschema-form"
import { trimEmptyValues } from "./helpers/trimFormData"

export class ReactJSONSchemaForm<T> extends Form<T> {
  // @ts-ignore
  validate(formData: any, schema: any) {
    formData = trimEmptyValues(formData)
    // @ts-ignore
    return super.validate(formData, schema)
  }
}
