import Form from "@rjsf/core"
import { trimEmptyValues } from "./helpers/trimFormData"

export class ReactJSONSchemaForm<T> extends Form<T> {
  // TODO Class 'Form<T>' defines instance member property 'validate', but extended class 'ReactJSONSchemaForm<T>' defines it as instance member function
  // @ts-ignore Don't know what to do with this, not worthy problem to spend time on
  validate(formData: any, schema: any) {
    formData = trimEmptyValues(formData)
    // TODO Only public and protected methods of the base class are accessible via the 'super' keyword
    // @ts-ignore Don't know what to do with this, not worthy problem to spend time on
    return super.validate(formData, schema)
  }
}
