"use client"
import React, { useCallback, useRef, useState } from "react"
import { v4 as uuid } from "uuid"
import { cn } from "@/app/libs/utils"


type DateFormProps = {
  id?: string,
  className?: string,
  title?: string,
  type?: "date" | "time" | "datetime-local",
  size?: "auto" | "xs" | "sm" | "md" | "lg" | "xl" | "full",
  label?: string,
  disabled?: boolean,
  defaultValue?: string,
  fixed?: boolean,
  validate?: (value: string) => boolean,
  onChange?: (value: string, valid: boolean, title: string) => void,
}

export default React.memo(React.forwardRef<HTMLInputElement, DateFormProps>(function DateForm({
  id = "",
  className = "",
  title = "",
  type = "datetime-local",
  size = "auto",
  label = "undefined",
  disabled = false,
  defaultValue = new Date().toISOString().slice(0,16),
  fixed = false,
  validate = undefined,
  onChange = undefined,
}, ref) {
  const validateValue = useCallback((value: string) => {
    const patterns = {
      "date": /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/,
      "time": /^[0-9]{2}:[0-9]{2}$/,
      "datetime-local": /^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}$/,
    }
    let valid = !!value.match(patterns[type])
    if (valid) {
      if (validate) {
        valid = (valid && validate(value))
      }
    }
    return valid
  }, [type, validate])

  const [valid, setValid] = useState(validateValue(defaultValue))

  const data = useRef({
    id: id || uuid(),
  })

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const valid = validateValue(e.currentTarget.value)
    if (onChange) {
      onChange(e.currentTarget.value, valid, title)
    }
    setValid(valid)
  }, [title, onChange, validateValue])

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
      <input
        key={ `${ data.current.id }-key-${ String(defaultValue) }` }
        ref={ ref }
        id={ data.current.id }
        type={ type }
        className={ cn(
          "w-full p-2.5 text-sm rounded-lg rounded-2 border",
          (valid) && "text-green-900 bg-green-50 border-green-700",
          (!valid) && "text-red-900 bg-red-50 border-red-700",
          (!validate) && "text-gray-900 bg-gray-50 border-gray-700",
          (disabled) && "text-gray-400 bg-gray-200 border-gray-400 cursor-not-allowed",
          (fixed) && "text-gray-900 bg-gray-50 border-gray-700 cursor-default",
        ) }
        disabled={ disabled || fixed }
        defaultValue={ valid ? defaultValue : "" }
        onChange={ handleChange }
        suppressHydrationWarning
      />
    </div>
  )
}))
