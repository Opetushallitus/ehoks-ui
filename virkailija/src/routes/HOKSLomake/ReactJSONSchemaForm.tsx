import Form from "react-jsonschema-form"
import { trimEmptyValues } from "./helpers/trimFormData"

export class ReactJSONSchemaForm<T> extends Form<T> {
  // TODO Class 'Form<T>' defines instance member property 'validate', but extended class 'ReactJSONSchemaForm<T>' defines it as instance member function
  // @ts-ignore
  validate(formData: any, schema: any) {
    formData = trimEmptyValues(formData)
    // TODO Only public and protected methods of the base class are accessible via the 'super' keyword
    // @ts-ignore
    return super.validate(formData, schema)
  }
}
