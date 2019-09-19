import Form from "react-jsonschema-form"
import { trimEmptyValues } from "./trimFormData"

export class ReactJSONSchemaForm<T> extends Form<T> {
  validate(formData: any, schema: any) {
    formData = trimEmptyValues(formData)
    // @ts-ignore
    return super.validate(formData, schema)
  }
}
