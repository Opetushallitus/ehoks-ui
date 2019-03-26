import React, { Component } from "react"
import { AsyncTypeahead, Typeahead } from "react-bootstrap-typeahead"
import {
  isArraySchema,
  isObjectSchema,
  isStringSchema,
  isNumberSchema,
  toArray,
  getDefaultValueForSchema
} from "./utils"
const selectn = require("./selectn.min")

import { DefaultLabel } from "./Label"
import { FieldProps } from "react-jsonschema-form"

const DEFAULT_OPTIONS = {
  required: false,
  labelKey: "name",
  minLength: 3,
  placeholder: "Search...",
  ref: "typeahead"
}

function optionToString(fields: any, separator: any) {
  return (option: any) => {
    return fields
      .map((field: any) => selectn(field, option))
      .filter((fieldVal: any) => fieldVal)
      .reduce((agg: any, fieldVal: any, i: number) => {
        if (i === 0) {
          return fieldVal
        } else {
          if (Array.isArray(separator)) {
            return `${agg}${separator[i - 1]}${fieldVal}`
          }
          return `${agg}${separator}${fieldVal}`
        }
      }, "")
  }
}

function mapLabelKey(labelKey: any) {
  if (Array.isArray(labelKey)) {
    return optionToString(labelKey, " ")
  } else if (
    typeof labelKey === "object" &&
    labelKey.fields &&
    labelKey.separator
  ) {
    let { fields, separator } = labelKey
    return optionToString(fields, separator)
  }
  return labelKey
}

function defaultValue(properties: any) {
  let defVal = Object.keys(properties).reduce((agg: any, field: string) => {
    if (properties[field].default !== undefined) {
      agg[field] = properties[field].default
    }
    return agg
  }, {})
  return defVal
}

function mapToObject(event: any, mapping: any, defVal: any) {
  let schemaEvent = Object.keys(mapping).reduce((agg, field) => {
    let eventField = mapping[field]
    if (typeof eventField === "object") {
      agg[field] = mapToObject(event, eventField, {})
    } else {
      agg[field] = selectn(eventField, event)
    }
    return agg
  }, Object.assign({}, defVal))
  return schemaEvent
}

function mapEvents(
  events: any[],
  { type, properties, items }: { type: any; properties: any; items: any },
  mapping: any
) {
  if (events.length === 0) {
    return [getDefaultValueForSchema({ type })]
  }
  if (!mapping || mapping === null) {
    if (type === "string") {
      return events.map(item => (typeof item === "object" ? item.label : item))
    }
    return events
  } else if (typeof mapping === "string") {
    return events.map(event =>
      typeof event === "string" ? event : selectn(mapping, event)
    )
  } else if (typeof mapping === "function") {
    return events.map(event => mapping(event))
  } else if (typeof mapping === "object") {
    let defVal = defaultValue(
      properties
        ? properties
        : items && items.properties
        ? items.properties
        : {}
    )
    let mappedEvents = events.map(event => {
      return mapToObject(event, mapping, defVal)
    })

    return mappedEvents
  }
}

export function mapToSchema(events: any[], schema: any, mapping: any) {
  let schemaEvents = mapEvents(events, schema, mapping) || []
  return isArraySchema(schema) ? schemaEvents : schemaEvents[0]
}

function mapFromObject(data: any, mapping: any, defVal: any) {
  return Object.keys(mapping).reduce((agg, field) => {
    let eventField = mapping[field]
    if (typeof eventField === "object") {
      Object.assign(agg, mapFromObject(data[field], mapping, {}))
    } else {
      if (data[field]) {
        agg[eventField] = data[field]
      }
    }
    return agg
  }, defVal)
}
/**
 *
 * @param {*} data
 * @param {*} mapping
 * Mapped object is converted to the object mapping takes
 */
export function mapFromSchema(data: any, mapping: any) {
  if (isEmpty(data)) {
    return
  }
  if (!mapping || mapping === null) {
    return data
  } else if (typeof mapping === mapping) {
    return { [mapping]: data }
  } else if (typeof mapping === "object") {
    return mapFromObject(data, mapping, {})
  } else {
    return data
  }
}

function isEmpty(obj: any) {
  return Object.keys(obj).length === 0 && obj.constructor === Object
}

export function toSelected(
  formData: any,
  schema: any,
  mapping: any,
  options?: any
) {
  let normFormData = formData ? toArray(formData) : []
  if (isObjectSchema(schema)) {
    return normFormData
      .map(selected => mapFromSchema(selected, mapping))
      .filter(x => x !== undefined)
  } else if (
    options &&
    (isStringSchema(schema) || isNumberSchema(schema)) &&
    typeof mapping === "string"
  ) {
    return normFormData
      .map(dataItem => {
        return options.find((option: any) => {
          if (option[mapping] === dataItem) {
            return option
          }
        })
      })
      .filter(x => x !== undefined)
  } else if (isArraySchema(schema)) {
    return normFormData
      .map(dataItem => {
        if (typeof mapping === "object") {
          return mapFromSchema(dataItem, mapping)
        }
        if (options) {
          return options.find((option: any) => {
            if (option[mapping] === dataItem) {
              return option
            }
          })
        } else {
          return dataItem
        }
      })
      .filter(x => x !== undefined)
  } else {
    return normFormData
  }
}

function isFunction(functionToCheck: any) {
  return functionToCheck instanceof Function
}

/*
 this is done to prevent an edge case with a typeahead wrapped inside a table that has an item selected & uses a function as a labelKey
 TODO: Need to find a better solution for this
 */
function transformLabelKey(labelKey: any, schema: any, selected: any) {
  if (
    isFunction(labelKey) &&
    selected &&
    selected.length > 0 &&
    schema.type === "string" &&
    selected.every((x: any) => typeof x === "string" || x instanceof String)
  ) {
    return ""
  } else {
    return labelKey
  }
}

interface TypeaheadFieldProps extends FieldProps {}

class BaseTypeaheadField extends Component<
  TypeaheadFieldProps,
  { selected: any[]; isLoading?: boolean; options?: any }
> {
  refs: {
    typeahead: any
  }
  handleSelectionChange = (conf: any) => (events: any) => {
    let { mapping, cleanAfterSelection = false } = conf
    let { schema } = this.props

    this.setState({
      selected: events
    })

    if (events.length > 0) {
      let schemaEvents = mapToSchema(events, schema, mapping)
      this.props.onChange(schemaEvents)
      if (cleanAfterSelection) {
        setTimeout(() => {
          if (this.refs.typeahead) {
            this.refs.typeahead.getInstance().clear()
          }
        }, 0)
      }
    }
  }

  componentDidMount() {
    let {
      uiSchema: { focusOnMount = false }
    } = this.props
    if (focusOnMount) {
      this.refs.typeahead.getInstance().focus()
    }
  }

  handleBlur = () => {
    let { selected } = this.state

    if (selected.length === 0) {
      this.setState({
        selected: []
      })
      if (this.refs.typeahead) {
        this.refs.typeahead.getInstance() &&
          this.refs.typeahead.getInstance().clear()
      }
      // let onChangeValue = getDefaultValueForSchema(schema);
      // remove the field if the value is empty
      this.props.onChange(undefined)
    }
  }
}

function isValidFormData(data: any) {
  return data && !isEmpty(data)
}

export class TypeaheadField extends BaseTypeaheadField {
  constructor(props: TypeaheadFieldProps) {
    super(props)
    let {
      schema,
      uiSchema: { typeahead },
      formData
    } = this.props

    this.state = {
      selected: isValidFormData(formData)
        ? toSelected(formData, schema, typeahead.mapping, typeahead.options)
        : []
    }
  }

  render() {
    let {
      uiSchema: { typeahead },
      idSchema: { $id = undefined } = {},
      schema
    } = this.props

    let labelKey = mapLabelKey(typeahead.labelKey)
    // if something is already selected and is a string - removing the label key so that the labelKey function can be ignored.
    labelKey = transformLabelKey(labelKey, schema, this.state.selected)

    let typeConf = Object.assign({}, DEFAULT_OPTIONS, typeahead, {
      onChange: this.handleSelectionChange(typeahead),
      labelKey,
      selected: this.state.selected,
      id: $id,
      onBlur: this.handleBlur
    })

    return (
      <div id={$id}>
        <DefaultLabel {...this.props} />
        <Typeahead {...typeConf} />
      </div>
    )
  }
}

export class AsyncTypeaheadField extends BaseTypeaheadField {
  constructor(props: TypeaheadFieldProps) {
    super(props)

    let {
      schema,
      uiSchema: { asyncTypeahead },
      formData
    } = this.props

    this.state = {
      options: [],
      isLoading: false,
      selected: isValidFormData(formData)
        ? toSelected(formData, schema, asyncTypeahead.mapping)
        : []
    }
  }

  handleSearch = (query: string) => {
    if (!query) {
      return
    }

    let {
      uiSchema: {
        asyncTypeahead: {
          url,
          optionsPath,
          search = (url: string, query: string) =>
            fetch(`${url}?query=${query}`).then(res => res.json())
        }
      }
    } = this.props

    this.setState({ isLoading: true })

    search(url, query)
      .then((json: any) => (optionsPath ? selectn(optionsPath, json) : json))
      .then((options: any) =>
        this.setState({ options: options, isLoading: false })
      )
  }

  handleOnFocus = () => {
    let {
      uiSchema: {
        asyncTypeahead: {
          url,
          optionsPath,
          queryOnFocus = "",
          minLength,
          search = (url: string, query: string) =>
            fetch(`${url}?query=${query}`).then(res => res.json())
        }
      }
    } = this.props

    if (minLength === 0) {
      this.setState({ isLoading: true })
      search(url, queryOnFocus)
        .then((json: any) => (optionsPath ? selectn(optionsPath, json) : json))
        .then((options: any) => this.setState({ options, isLoading: false }))
    }
  }

  render() {
    let {
      uiSchema: { asyncTypeahead },
      idSchema: { $id = undefined } = {},
      schema
    } = this.props

    let labelKey = mapLabelKey(asyncTypeahead.labelKey)
    // if something is already selected and is a string - removing the label key so that the labelKey function can be ignored.
    labelKey = transformLabelKey(labelKey, schema, this.state.selected)

    let typeConf = Object.assign({}, DEFAULT_OPTIONS, asyncTypeahead, {
      selected: this.state.selected,
      isLoading: this.state.isLoading,
      labelKey,
      onChange: this.handleSelectionChange(asyncTypeahead),
      onSearch: this.handleSearch,
      options: this.state.options,
      onFocus: this.handleOnFocus,
      onBlur: this.handleBlur
    })

    if (asyncTypeahead.overrideOptions) {
      typeConf.onInputChange = this.props.onChange
    }

    return (
      <div id={$id}>
        <DefaultLabel {...this.props} />
        <AsyncTypeahead {...typeConf} />
      </div>
    )
  }
}
