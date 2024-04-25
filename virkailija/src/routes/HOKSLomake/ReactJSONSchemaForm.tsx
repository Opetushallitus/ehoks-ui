import Form from "@rjsf/core"
import { trimEmptyValues } from "./helpers/trimFormData"
import { SchemaUtilsType } from "@rjsf/utils"

export default class ReactJSONSchemaForm extends Form {
  validate = (
    formData: any | undefined,
    schema = this.props.schema,
    altSchemaUtils?: SchemaUtilsType,
    retrievedSchema?: any
  ) => {
    formData = trimEmptyValues(formData) || {}
    return super.validate(formData, schema, altSchemaUtils, retrievedSchema)
  }
}
