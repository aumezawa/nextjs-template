"use client"
import React, { useCallback, useRef, useState } from "react"
import { v4 as uuid } from "uuid"
import { cn } from "@/app/libs/utils"


type TextFormProps = {
  id?: string,
  className?: string,
  title?: string,
  type?: "text" | "dec" | "JPY" | "USD",
  size?: "auto" | "xs" | "sm" | "md" | "lg" | "xl" | "full",
  label?: string,
  button?: "none" | "search" | "download" | "upload" | "message",
  disabled?: boolean,
  placeholder?: string,
  defaultValue?: string,
  fixed?: boolean,
  validate?: (value: string) => boolean,
  onChange?: (value: string, valid: boolean, title: string) => void,
  onSubmit?: () => void,
}

export default React.memo(React.forwardRef<HTMLInputElement, TextFormProps>(function TextForm({
  id = "",
  className = "",
  title = "",
  type = "text",
  size = "auto",
  label = "undefined",
  button = "none",
  disabled = false,
  placeholder = "Input",
  defaultValue = "",
  fixed = false,
  validate = undefined,
  onChange = undefined,
  onSubmit = undefined,
}, ref) {
  const validateValue = useCallback((value: string) => {
    let valid = true
    if (validate) {
      valid = (valid && validate(value))
    }
    return valid
  }, [validate])

  const setDefaultValue = useCallback(() => {
    const patterns = {
      "text": /^.*$/,
      "dec": /^[0-9]*$/,
      "JPY": /^[¥]{0,1}(([0-9]{1,3}([,][0-9]{3})*)|([0-9]*))$/,
      "USD": /^[$]{0,1}(([0-9]{1,3}([,][0-9]{3})*([.][0-9]{0,2}){0,1})|([0-9]*)([.][0-9]{0,2}){0,1})$/,
    }

    let value = defaultValue
    if (!defaultValue.match(patterns[type])) {
      value = ""
    }
    return value
  }, [type, defaultValue])

  const [valid, setValid] = useState(validateValue(defaultValue))

  const data = useRef({
    id: id || uuid(),
    value: setDefaultValue(),
  })

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.currentTarget.value
    if (type === "dec") {
      const pattern = /^[0-9]*$/
      if (!value.match(pattern)) {
        e.currentTarget.value = data.current.value
        return
      }
    } else if (type === "JPY") {
      const pattern = /^[¥]{0,1}(([0-9]*)|([0-9]{1,3}([,][0-9]{3})*([,][0-9]{0,2}){0,1}))$/
      if (value === "\\") {
        e.currentTarget.value = value = "¥"
      } else if (!value.match(pattern)) {
        e.currentTarget.value = data.current.value
        return
      }
    } else if (type === "USD") {
      const pattern = /^[$]{0,1}(([0-9]*([.][0-9]{0,2}){0,1})|([0-9]{1,3}([,][0-9]{3})*([,][0-9]{0,2}){0,1})|([0-9]{1,3}([,][0-9]{3})*([.][0-9]{0,2}){0,1}))$/
      if (!value.match(pattern)) {
        e.currentTarget.value = data.current.value
        return
      }
    }

    data.current.value = value

    const valid = validateValue(value)
    if (onChange) {
      onChange(value, valid, title)
    }
    setValid(valid)
  }, [title, type, onChange, validateValue])

  const handleBlur = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (type === "JPY") {
      if (data.current.value !== "") {
        e.currentTarget.value = data.current.value = Number(data.current.value.replace("¥", "").replace(",", "")).toLocaleString("en-us", { style: "currency", currency: "JPY" })
        const valid = validateValue(data.current.value)
        if (onChange) {
          onChange(data.current.value, valid, title)
        }
        setValid(valid)
      }
    } else if (type === "USD") {
      if (data.current.value !== "") {
        if (data.current.value === ".") {
          e.currentTarget.value = data.current.value = "0"
        } else {
          e.currentTarget.value = data.current.value = Number(data.current.value.replace("$", "").replace(",", "")).toLocaleString("en-us", { style: "currency", currency: "USD" })
        }
        const valid = validateValue(data.current.value)
        if (onChange) {
          onChange(data.current.value, valid, title)
        }
        setValid(valid)
      }
    }
  }, [title, type, onChange, validateValue])

  const handleSubmit = useCallback(() => {
    if (onSubmit) {
      onSubmit()
    }
  }, [onSubmit])

  return (
    <div className={ cn(
      "mb-2",
      (size !== "auto") && "w-full",
      (size === "xs") && "max-w-xs mx-auto",
      (size === "sm") && "max-w-sm mx-auto",
      (size === "md") && "max-w-md mx-auto",
      (size === "lg") && "max-w-lg mx-auto",
      (size === "xl") && "max-w-xl mx-auto",
      className,
    ) }>
      {
        (label) &&
        <p className={ cn(
          "mb-1 text-sm font-medium",
          (valid) && "text-green-500",
          (!valid) && "text-red-500",
          (!validate) && "text-gray-700",
          (disabled) && "text-gray-400",
          (fixed) && "text-gray-700",
        ) }>
          { label }
        </p>
      }
      <div className="flex flex-row">
        <input
          key={ `${ data.current.id }-key-${ String(defaultValue) }` }
          ref={ ref }
          id={ data.current.id }
          type="text"
          className={ cn(
            "flex-grow min-w-0 p-2.5 text-sm rounded-lg rounded-2 border",
            (valid) && "text-green-900 bg-green-50 border-green-700",
            (!valid) && "text-red-900 bg-red-50 border-red-700",
            (!validate) && "text-gray-900 bg-gray-50 border-gray-700",
            (disabled) && "text-gray-400 bg-gray-200 border-gray-400 cursor-not-allowed",
            (fixed) && "text-gray-900 bg-gray-50 border-gray-700 cursor-default",
            (button !== "none" && !fixed) && "rounded-e-none",
          ) }
          disabled={ disabled || fixed }
          placeholder={ placeholder }
          defaultValue={ data.current.value }
          onChange={ handleChange }
          onBlur={ handleBlur }
          suppressHydrationWarning
        />
        {
          (button !== "none" && !fixed) &&
          <button
            className={ cn(
              "px-3 text-white rounded-e-lg border",
              (valid) && "bg-blue-700 border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300",
              (!valid) && "bg-blue-400 border-blue-400 cursor-not-allowed",
              (disabled) && "bg-blue-400 border-blue-400 cursor-not-allowed",
            ) }
            disabled={ disabled || !valid }
            onClick={ handleSubmit }
          >
            {
              (button === "search") ?
                <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 20 20">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                </svg>
              :
              (button === "download") ?
                <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 13V4M7 14H5a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1h-2m-1-5-4 5-4-5m9 8h.01"/>
                </svg>
              :
              (button === "upload") ?
                <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v9m-5 0H5a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1h-2M8 9l4-5 4 5m1 8h.01"/>
                </svg>
              :
              (button === "message") ?
                <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 22 22">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 10.5h.01m-4.01 0h.01M8 10.5h.01M5 5h14a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1h-6.6a1 1 0 0 0-.69.275l-2.866 2.723A.5.5 0 0 1 8 18.635V17a1 1 0 0 0-1-1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z"/>
                </svg>
              :
                <></>
            }
          </button>
        }
      </div>
    </div>
  )
}))
