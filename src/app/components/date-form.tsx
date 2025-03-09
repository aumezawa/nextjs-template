"use client"
import React, { useCallback, useImperativeHandle, useRef, useState } from "react"
import { v4 as uuid } from "uuid"
import { cn } from "@/app/libs/utils"
import type { FormElement } from "@/app/types/form"


type DateFormProps = {
  id?: string,
  className?: string,
  title?: string,
  subtitle?: string,
  type?: "date" | "month" | "time" | "datetime-local",
  size?: "auto" | "xs" | "sm" | "md" | "lg" | "xl" | "full",
  label?: string,
  disabled?: boolean,
  defaultValue?: string,
  fixed?: boolean,
  validate?: (value: string, title: string, subtitle: string) => boolean,
  onChange?: (value: string, valid: boolean, title: string, subtitle: string) => void,
}

export default React.memo(React.forwardRef<FormElement, DateFormProps>(function DateForm({
  id = undefined,
  className = "",
  title = "",
  subtitle = "",
  type = "datetime-local",
  size = "auto",
  label = "undefined",
  disabled = false,
  defaultValue = "",
  fixed = false,
  validate = undefined,
  onChange = undefined,
}, ref) {
  const validateValue = useCallback((value: string) => {
    const patterns = {
      "date": /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/,
      "month": /^[0-9]{4}-[0-9]{2}$/,
      "time": /^[0-9]{2}:[0-9]{2}$/,
      "datetime-local": /^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}$/,
    }
    let valid = !!value.match(patterns[type])
    if (valid) {
      if (validate) {
        valid = (valid && validate(value, title, subtitle))
      }
    }
    return valid
  }, [title, subtitle, type, validate])

  const setValue = useCallback((value: string) => {
    const patterns = {
      "date": /^([0-9]{4}-[0-9]{2}-[0-9]{2}){0,1}$/,
      "month": /^([0-9]{4}-[0-9]{2}){0,1}$/,
      "time": /^([0-9]{2}:[0-9]{2}){0,1}$/,
      "datetime-local": /^([0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}){0,1}$/,
    }
    if (!value.match(patterns[type])) {
      return ""
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
          refs.current.input.current.value = data.current.value
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
      "date": /^([0-9]{4}-[0-9]{2}-[0-9]{2}){0,1}$/,
      "month": /^([0-9]{4}-[0-9]{2}){0,1}$/,
      "time": /^([0-9]{2}:[0-9]{2}){0,1}$/,
      "datetime-local": /^([0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}){0,1}$/,
    }

    const value = e.currentTarget.value
    if (!value.match(patterns[type])) {
      return
    }

    data.current.value = value

    const valid = validateValue(value)
    if (onChange) {
      onChange(value, valid, title, subtitle)
    }
    setValid(valid)
  }, [title, subtitle, type, onChange, validateValue])

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
      <div className="relative w-full z-0 mt-3 group">
        <input
          ref={ refs.current.input }
          id={ data.current.id }
          type={ type }
          className={ cn(
            "block w-full px-0 py-2.5 text-sm bg-transparent border-0 border-b-2 appearance-none focus:outline-none focus:ring-0 peer",
            (valid) && "text-green-600 border-green-400 focus:border-green-600",
            (!valid) && "text-red-600 border-red-400 focus:border-red-600",
            (!validate) && "text-gray-900 border-gray-700 focus:border-gray-900",
            (disabled) && "text-gray-400 border-gray-400 cursor-not-allowed",
            (fixed) && "text-gray-900 border-gray-700 cursor-default",
          ) }
          placeholder=""
          disabled={ disabled || fixed }
          defaultValue={ data.current.value }
          onChange={ handleChange }
          suppressHydrationWarning
        />
        <label
          htmlFor={ data.current.id }
          className={ cn(
            "absolute top-3 -translate-y-6 origin-[0] scale-75 text-sm",
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
      </div>
    </div>
  )
}))
