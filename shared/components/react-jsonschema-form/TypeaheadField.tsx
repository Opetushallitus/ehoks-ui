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

// @ts-ignore Not worthy problem to spend time on
import selectn from "./selectn.min"

import { DefaultLabel } from "./Label"
import { FieldProps } from "@rjsf/utils"

const DEFAULT_OPTIONS = {
  required: false,
  labelKey: "name",
  minLength: 3,
  placeholder: "Search..."
}

const optionToString = (fields: any, separator: any) => (option: any) =>
  fields
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

function mapLabelKey(labelKey: any) {
  if (Array.isArray(labelKey)) {
    return optionToString(labelKey, " ")
  } else if (
    typeof labelKey === "object" &&
    labelKey.fields &&
    labelKey.separator
  ) {
    const { fields, separator } = labelKey
    return optionToString(fields, separator)
  }
  return labelKey
}

function defaultValue(properties: any) {
  const defVal = Object.keys(properties).reduce((agg: any, field: string) => {
    if (properties[field].default !== undefined) {
      agg[field] = properties[field].default
    }
    return agg
  }, {})
  return defVal
}

function mapToObject(event: any, mapping: any, defVal: any) {
  const schemaEvent = Object.keys(mapping).reduce(
    (agg, field) => {
      const eventField = mapping[field]
      if (typeof eventField === "object") {
        agg[field] = mapToObject(event, eventField, {})
      } else {
        agg[field] = selectn(eventField, event)
      }
      return agg
    },
    { ...defVal }
  )
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
      return events.map((item) =>
        typeof item === "object" ? item.label : item
      )
    }
    return events
  } else if (typeof mapping === "string") {
    return events.map((event) =>
      typeof event === "string" ? event : selectn(mapping, event)
    )
  } else if (typeof mapping === "function") {
    return events.map((event) => mapping(event))
  } else if (typeof mapping === "object") {
    const defVal = defaultValue(
      properties
        ? properties
        : items && items.properties
          ? items.properties
          : {}
    )
    const mappedEvents = events.map((event) =>
      mapToObject(event, mapping, defVal)
    )

    return mappedEvents
  }
}

export function mapToSchema(events: any[], schema: any, mapping: any) {
  const schemaEvents = mapEvents(events, schema, mapping) || []
  return isArraySchema(schema) ? schemaEvents : schemaEvents[0]
}

const mapFromObject = (data: any, mapping: any, defVal: any) =>
  Object.keys(mapping).reduce((agg, field) => {
    const eventField = mapping[field]
    if (typeof eventField === "object") {
      Object.assign(agg, mapFromObject(data[field], mapping, {}))
    } else {
      if (data[field]) {
        agg[eventField] = data[field]
      }
    }
    return agg
  }, defVal)
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

const isEmpty = (obj: any) =>
  Object.keys(obj).length === 0 && obj.constructor === Object

export function toSelected(
  formData: any,
  schema: any,
  mapping: any,
  options?: any
) {
  const normFormData = formData ? toArray(formData) : []
  if (isObjectSchema(schema)) {
    return normFormData
      .map((selected) => mapFromSchema(selected, mapping))
      .filter((x) => x !== undefined)
  } else if (
    options &&
    (isStringSchema(schema) || isNumberSchema(schema)) &&
    typeof mapping === "string"
  ) {
    return normFormData
      .map((dataItem) =>
        options.find((option: any) => {
          if (option[mapping] === dataItem) {
            return option
          }
        })
      )
      .filter((x) => x !== undefined)
  } else if (isArraySchema(schema)) {
    return normFormData
      .map((dataItem) => {
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
      .filter((x) => x !== undefined)
  } else {
    return normFormData
  }
}

const isFunction = (functionToCheck: any) => functionToCheck instanceof Function

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

type TypeaheadFieldProps = FieldProps

class BaseTypeaheadField extends Component<
  TypeaheadFieldProps,
  { selected: any[]; isLoading?: boolean; options?: any }
> {
  refs: {
    typeahead: any
  }
  handleSelectionChange = (conf: any) => async (events: any) => {
    const { mapping, cleanAfterSelection = false } = conf
    const { schema, idSchema, formContext } = this.props

    this.setState({
      selected: events
    })

    if (events.length > 0) {
      const schemaEvents = mapToSchema(events, schema, mapping)
      await formContext.koodiUriSelected(idSchema.$id, true)
      this.props.onChange(schemaEvents)
      if (cleanAfterSelection) {
        setTimeout(() => {
          // TODO Using this.refs is deprecated
          // eslint-disable-next-line react/no-string-refs
          if (this.refs.typeahead) {
            // eslint-disable-next-line react/no-string-refs
            this.refs.typeahead.current.clear()
          }
        }, 0)
      }
    } else {
      await formContext.koodiUriSelected(idSchema.$id, false)
      // selection was removed, remove from formData
      this.props.onChange(undefined)
    }
  }

  componentDidMount() {
    const { uiSchema } = this.props
    if (uiSchema!["ui:autofocus"]) {
      // eslint-disable-next-line react/no-string-refs
      this.refs.typeahead.current.focus()
    }
  }

  handleBlur = () => {
    const { selected } = this.state

    if (selected.length === 0) {
      this.setState({
        selected: []
      })
      // eslint-disable-next-line react/no-string-refs
      if (this.refs.typeahead && this.refs.typeahead.current) {
        // eslint-disable-next-line react/no-string-refs
        this.refs.typeahead.current.clear()
      }
      // let onChangeValue = getDefaultValueForSchema(schema);
      // remove the field if the value is empty
      this.props.onChange(undefined)
    }
  }
}

const isValidFormData = (data: any) => data && !isEmpty(data)

export class TypeaheadField extends BaseTypeaheadField {
  constructor(props: TypeaheadFieldProps) {
    super(props)
    const { schema, uiSchema, formData } = this.props

    this.state = {
      selected: isValidFormData(formData)
        ? toSelected(
            formData,
            schema,
            uiSchema?.typeahead.mapping,
            uiSchema?.typeahead.options
          )
        : []
    }
  }

  componentDidUpdate(prevProps: TypeaheadFieldProps) {
    const { schema, uiSchema, formData } = this.props
    if (formData !== prevProps.formData) {
      this.setState({
        selected: isValidFormData(formData)
          ? toSelected(
              formData,
              schema,
              uiSchema?.typeahead.mapping,
              uiSchema?.typeahead.options
            )
          : []
      })
    }
  }

  render() {
    const { uiSchema, idSchema: { $id = undefined } = {}, schema } = this.props
    let labelKey = mapLabelKey(uiSchema?.typeahead.labelKey)
    // if something is already selected and is a string - removing the label key so that the labelKey function can be ignored.
    labelKey = transformLabelKey(labelKey, schema, this.state.selected)

    const typeConf = {
      ...DEFAULT_OPTIONS,
      ...uiSchema?.typeahead,
      onChange: this.handleSelectionChange(uiSchema?.typeahead),
      labelKey,
      selected: this.state.selected,
      id: $id,
      onBlur: this.handleBlur
    }

    return (
      <div id={$id}>
        <DefaultLabel {...this.props} id={$id} />
        <Typeahead {...typeConf} />
      </div>
    )
  }
}

export class AsyncTypeaheadField extends BaseTypeaheadField {
  constructor(props: TypeaheadFieldProps) {
    super(props)

    const { schema, uiSchema, formData } = this.props

    this.state = {
      options: [],
      isLoading: false,
      selected: isValidFormData(formData)
        ? toSelected(formData, schema, uiSchema?.asyncTypeahead.mapping)
        : []
    }
  }

  handleSearch = (query: string) => {
    if (!query) {
      return
    }

    const { uiSchema } = this.props
    const {
      url,
      optionsPath,
      search = (searchUrl: string, searchQuery: string) =>
        fetch(`${searchUrl}?query=${searchQuery}`).then((res) => res.json())
    } = uiSchema?.asyncTypeahead ?? {}

    this.setState({ isLoading: true })

    search(url, query)
      .then((json: any) => (optionsPath ? selectn(optionsPath, json) : json))
      .then((options: any) => this.setState({ options, isLoading: false }))
  }

  handleOnFocus = () => {
    const { uiSchema } = this.props
    const {
      url,
      optionsPath,
      queryOnFocus = "",
      minLength,
      search = (searchUrl: string, searchQuery: string) =>
        fetch(`${searchUrl}?query=${searchQuery}`).then((res) => res.json())
    } = uiSchema?.asyncTypeahead ?? {}

    if (minLength === 0) {
      this.setState({ isLoading: true })
      search(url, queryOnFocus)
        .then((json: any) => (optionsPath ? selectn(optionsPath, json) : json))
        .then((options: any) => this.setState({ options, isLoading: false }))
    }
  }

  render() {
    const { uiSchema, idSchema: { $id = undefined } = {}, schema } = this.props

    let labelKey = mapLabelKey(uiSchema?.asyncTypeahead.labelKey)
    // if something is already selected and is a string - removing the label key so that the labelKey function can be ignored.
    labelKey = transformLabelKey(labelKey, schema, this.state.selected)

    const typeConf = {
      ...DEFAULT_OPTIONS,
      ...uiSchema?.asyncTypeahead,
      selected: this.state.selected,
      isLoading: this.state.isLoading,
      labelKey,
      onChange: this.handleSelectionChange(uiSchema?.asyncTypeahead),
      onSearch: this.handleSearch,
      options: this.state.options,
      onFocus: this.handleOnFocus,
      onBlur: this.handleBlur
    }

    if (uiSchema?.asyncTypeahead.overrideOptions) {
      typeConf.onInputChange = this.props.onChange
    }

    return (
      <div id={$id}>
        <DefaultLabel {...this.props} id={$id} />
        <AsyncTypeahead {...typeConf} />
      </div>
    )
  }
}
