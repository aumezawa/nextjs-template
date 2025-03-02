"use client"
import React, { useCallback, useImperativeHandle, useRef, useState } from "react"
import { v4 as uuid } from "uuid"
import { cn } from "@/app/libs/utils"
import type { FormElement } from "@/app/types/form"


type SelectFormProps = {
  id?: string,
  className?: string,
  title?: string,
  subtitle?: string,
  size?: "auto" | "xs" | "sm" | "md" | "lg" | "xl" | "full",
  label?: string,
  options?: string[],
  disabled?: boolean,
  placeholder?: string,
  defaultIndex?: number,
  fixed?: boolean,
  validate?: (value: string, index: number, title: string, subtitle: string) => boolean,
  onChange?: (value: string, index: number, valid: boolean, title: string, subtitle: string) => void,
}

export default React.memo(React.forwardRef<FormElement, SelectFormProps>(function SelectForm({
  id = undefined,
  className = "",
  title = "",
  subtitle = "",
  size = "auto",
  label = "undefined",
  options = [],
  disabled = false,
  placeholder = "Choose an option",
  defaultIndex = -1,
  fixed = false,
  validate = undefined,
  onChange = undefined,
}, ref) {
  const validateValue = useCallback((index: number) => {
    let valid = (index >= 0) && (index < options.length)
    if (validate) {
      valid = (valid && validate(options[index], index, title, subtitle))
    }
    return valid
  }, [title, subtitle, options, validate])

  const [valid, setValid] = useState(validateValue(defaultIndex))

  const refs = useRef({
    input: React.createRef<HTMLSelectElement>(),
  })

  const data = useRef({
    id: id || uuid(),
  })

  useImperativeHandle(ref, () => ({
    clear: () => {
      if (refs.current.input.current) {
        refs.current.input.current.value = "-1"
      }
      setValid(validateValue(-1))
    },
    set: (value?: string) => {
      if (value) {
        const index = Number(value)
        if (!isNaN(index) && index >= 0 && index < options.length) {
          if (refs.current.input.current) {
            refs.current.input.current.value = value
          }
          setValid(validateValue(index))
        }
      } else {
        const index = Number(refs.current.input.current?.value)
        setValid(validateValue(index))
      }
    },
    get: () => {
      return refs.current.input.current?.value
    },
  }))

  const handleChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const index = Number(e.currentTarget.value)
    const valid = validateValue(index)
    const value = (index >= 0 && index < options.length) ? options[index] : ""
    if (onChange) {
      onChange(value, index, valid, title, subtitle)
    }
    setValid(valid)
  }, [title, subtitle, options, onChange, validateValue])

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
      <div className="relative w-full mt-3 group">
        <select
          ref={ refs.current.input }
          id={ data.current.id }
          className={ cn (
            "block w-full px-0 py-2.5 text-sm bg-transparent border-0 border-b-2 appearance-none focus:outline-none focus:ring-0 peer",
            (valid) && "text-green-600 border-green-400 focus:border-green-600",
            (!valid) && "text-red-600 border-red-400 focus:border-red-600",
            (!validate) && "text-gray-900 border-gray-700 focus:border-gray-900",
            (disabled) && "text-gray-400 border-gray-400 cursor-not-allowed",
            (fixed) && "text-gray-900 border-gray-700 cursor-default",
          ) }
          disabled={ disabled || fixed }
          defaultValue={ String(defaultIndex) }
          onChange={ handleChange }
          suppressHydrationWarning
        >
          {
            <option className="text-red-600" value="-1">
              { placeholder }
            </option>
          }
          {
            options.map((option: string, index: number) => (
              <option key={ index } className="text-gray-900" value={ String(index) }>
                { option }
              </option>
            ))
          }
        </select>
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
