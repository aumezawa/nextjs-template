"use client"
import React, { useCallback, useImperativeHandle, useRef, useState } from "react"
import { v4 as uuid } from "uuid"
import { cn } from "@/app/libs/utils"
import type { FormElement } from "@/app/types/form"


type TextFormProps = {
  id?: string,
  className?: string,
  title?: string,
  subtitle?: string,
  type?: "text" | "dec" | "JPY" | "USD",
  size?: "auto" | "xs" | "sm" | "md" | "lg" | "xl" | "full",
  label?: string,
  button?: "search" | "download" | "upload" | "message",
  disabled?: boolean,
  defaultValue?: string,
  fixed?: boolean,
  validate?: (value: string, title: string, subtitle: string) => boolean,
  onChange?: (value: string, valid: boolean, title: string, subtitle: string) => void,
  onSubmit?: (title: string, subtitle: string) => void,
}

export default React.memo(React.forwardRef<FormElement, TextFormProps>(function TextForm({
  id = undefined,
  className = "",
  title = "",
  subtitle = "",
  type = "text",
  size = "auto",
  label = "undefined",
  button = undefined,
  disabled = false,
  defaultValue = "",
  fixed = false,
  validate = undefined,
  onChange = undefined,
  onSubmit = undefined,
}, ref) {
  const validateValue = useCallback((value: string) => {
    let valid = true
    if (validate) {
      valid = (valid && validate(value, title, subtitle))
    }
    return valid
  }, [title, subtitle, validate])

  const setValue = useCallback((value: string) => {
    const patterns = {
      "text": /^.*$/,
      "dec": /^[0-9]*$/,
      "JPY": /^[¥]{0,1}(([0-9]{1,3}([,][0-9]{3})*)|([0-9]*))$/,
      "USD": /^[$]{0,1}(([0-9]{1,3}([,][0-9]{3})*([.][0-9]{1,2}){0,1})|([0-9]*)([.][0-9]{1,2}){0,1})$/,
    }

    if (!value.match(patterns[type])) {
      return ""
    }
    return value.replace("$", "").replace("¥", "").replaceAll("," ,"")
  }, [type])

  const setDisplay = useCallback((value: string) => {
    if (type === "JPY") {
      if (data.current.value !== "") {
        return Number(value).toLocaleString("en-us", { style: "currency", currency: "JPY" })
      }
    } else if (type === "USD") {
      if (data.current.value !== "") {
        return Number(value).toLocaleString("en-us", { style: "currency", currency: "USD" })
      }
    }
    return value
  }, [type])

  const [valid, setValid] = useState(validateValue(defaultValue))

  const refs = useRef({
    input: React.createRef<HTMLInputElement>(),
  })

  const data = useRef({
    id: id || uuid(),
    value: setValue(defaultValue),
  })

  useImperativeHandle(ref, () => ({
    clear: () => {
      data.current.value = ""
      if (refs.current.input.current) {
        refs.current.input.current.value = data.current.value
      }
      setValid(validateValue(data.current.value))
    },
    set: (value?: string) => {
      if (value) {
        data.current.value = setValue(value)
        if (refs.current.input.current) {
          refs.current.input.current.value = setDisplay(data.current.value)
        }
      }
      setValid(validateValue(data.current.value))
    },
    get: () => {
      return data.current.value
    },
  }))

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const patterns = {
      "text": /^.*$/,
      "dec": /^[0-9]*$/,
      "JPY": /^[0-9]*$/,
      "USD": /^[0-9]*([.][0-9]{0,2}){0,1}$/,
    }

    const value = e.currentTarget.value
    if (!value.match(patterns[type])) {
      e.currentTarget.value = data.current.value
      return
    }

    data.current.value = value

    const valid = validateValue(value)
    if (onChange) {
      onChange(value, valid, title, subtitle)
    }
    setValid(valid)
  }, [title, subtitle, type, onChange, validateValue])

  const handleFocus = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    e.currentTarget.value = e.currentTarget.value.replace("$", "").replace("¥", "").replaceAll("," ,"")
    if (type === "USD") {
      if (e.currentTarget.value.endsWith(".00")) {
        e.currentTarget.value = e.currentTarget.value.slice(0, -3)
      } else if (e.currentTarget.value.includes(".") && e.currentTarget.value.endsWith("0")) {
        e.currentTarget.value = e.currentTarget.value.slice(0, -1)
      }
    }
  }, [type])

  const handleBlur = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (type === "JPY") {
      if (data.current.value !== "") {
        e.currentTarget.value = Number(data.current.value).toLocaleString("en-us", { style: "currency", currency: "JPY" })
      }
    } else if (type === "USD") {
      if (data.current.value !== "") {
        if (data.current.value === ".") {
          e.currentTarget.value = data.current.value = "0"
        }
        e.currentTarget.value = Number(data.current.value).toLocaleString("en-us", { style: "currency", currency: "USD" })
      }
    }
  }, [type])

  const handleSubmit = useCallback(() => {
    if (onSubmit) {
      onSubmit(title, subtitle)
    }
  }, [title, subtitle, onSubmit])

  return (
    <div className={ cn(
      "mb-2",
      (size === "xs") && "w-full max-w-xs mx-auto",
      (size === "sm") && "w-full max-w-sm mx-auto",
      (size === "md") && "w-full max-w-md mx-auto",
      (size === "lg") && "w-full max-w-lg mx-auto",
      (size === "xl") && "w-full max-w-xl mx-auto",
      (size === "full") && "w-full",
      className,
    ) }>
      <div className="flex flex-row relative w-full z-0 mt-3 group">
        <input
          ref={ refs.current.input }
          id={ data.current.id }
          type="text"
          className={ cn(
            "block w-full px-0 py-2.5 text-sm font-normal bg-transparent border-0 border-b-2 appearance-none focus:outline-none focus:ring-0 peer",
            (valid) && "text-green-600 border-green-400 focus:border-green-600",
            (!valid) && "text-red-600 border-red-400 focus:border-red-600",
            (!validate) && "text-gray-900 border-gray-700 focus:border-gray-900",
            (disabled) && "text-gray-400 border-gray-400 cursor-not-allowed",
            (fixed) && "text-gray-900 border-gray-700 cursor-default",
          ) }
          placeholder=""
          disabled={ disabled || fixed }
          defaultValue={ setDisplay(data.current.value) }
          onChange={ handleChange }
          onFocus={ handleFocus }
          onBlur={ handleBlur }
          suppressHydrationWarning
        />
        <label
          htmlFor={ data.current.id }
          className={ cn(
            "absolute transform duration-300 top-3 -translate-y-6 origin-[0] scale-75 text-sm font-normal peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:font-medium peer-focus:scale-75 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0",
            (valid) && "text-green-400 peer-focus:text-green-600",
            (!valid) && "text-red-400 peer-focus:text-red-600",
            (!validate) && "text-gray-700 peer-focus:text-gray-900",
            (disabled) && "text-gray-400",
            (fixed) && "text-gray-700",
          ) }
          suppressHydrationWarning
        >
          { label }
        </label>
        {
          (button && !fixed) &&
          <button
            className={ cn(
              "m-0 px-2 pt-1.5 bg-transparent border-0 border-b-2",
              (valid) && "text-gray-700 border-green-400 peer-focus:border-green-600 hover:text-green-400 focus:text-green-600",
              (!valid) && "text-gray-400 border-red-400 peer-focus:border-red-600 cursor-not-allowed",
              (!validate) && "text-gray-700 border-gray-700 peer-focus:border-gray-900 hover:text-blue-600 focus:text-blue-800",
              (disabled) && "text-gray-400 border-gray-400 hover:text-0 cursor-not-allowed",
            ) }
            disabled={ disabled || fixed || !valid }
            onClick={ handleSubmit }
          >
            <svg className="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
              {
                (button === "search") ?
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                :
                (button === "download") ?
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 13V4M7 14H5a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1h-2m-1-5-4 5-4-5m9 8h.01"/>
                :
                (button === "upload") ?
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v9m-5 0H5a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1h-2M8 9l4-5 4 5m1 8h.01"/>
                :
                (button === "message") ?
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 10.5h.01m-4.01 0h.01M8 10.5h.01M5 5h14a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1h-6.6a1 1 0 0 0-.69.275l-2.866 2.723A.5.5 0 0 1 8 18.635V17a1 1 0 0 0-1-1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z"/>
                :
                  <></>
              }
            </svg>
          </button>
        }
      </div>
    </div>
  )
}))
