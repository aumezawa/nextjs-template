"use client"
import React, { useCallback, useState } from "react"
import { cn } from "@/app/libs/utils"


type DateFormProps = {
  id?: string,
  className?: string,
  type?: "date" | "time" | "datetime-local",
  title?: string,
  label?: string,
  size?: "auto" | "xs" | "sm" | "md" | "lg" | "xl" | "full",
  disabled?: boolean,
  defaultValue?: string,
  validate?: (value: string) => boolean,
  onChange?: (value: string, valid: boolean, title: string) => void,
}

export default React.memo(React.forwardRef<HTMLInputElement, DateFormProps>(function DateForm({
  id = undefined,
  className = "",
  type = "datetime-local",
  title = "",
  label = "",
  size = "auto",
  disabled = false,
  defaultValue = "",
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
    if (validate) {
      valid = (valid && validate(value))
    }
    return valid
  }, [type, validate])

  const [valid, setValid] = useState(validateValue(defaultValue))

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
      (size === "xs") && "max-w-xs w-full mx-auto",
      (size === "sm") && "max-w-sm w-full mx-auto",
      (size === "md") && "max-w-md w-full mx-auto",
      (size === "lg") && "max-w-lg w-full mx-auto",
      (size === "xl") && "max-w-xl w-full mx-auto",
      (size === "full") && "w-full px-2",
      className,
    ) }>
      {
        label &&
        <p className="mb-1 text-sm font-medium text-gray-900">
          { label }
        </p>
      }
      <input
        ref={ ref }
        id={ id }
        type={ type }
        title={ title }
        className={ cn(
          "w-full p-2.5 text-sm placeholder-gray-600 rounded-lg rounded-2 border",
          (valid) && "text-green-900 bg-green-50 border-green-700",
          (!valid) && "text-red-900 bg-red-50 border-red-700",
          (!validate) && "text-gray-900 bg-gray-50 border-gray-700",
          (disabled) && "text-gray-600 bg-gray-200 border-gray-400 placeholder-gray-400 cursor-not-allowed",
        ) }
        disabled={ disabled }
        defaultValue={ valid ? defaultValue : "" }
        onChange={ handleChange }
      />
    </div>
  )
}))
