"use client"
import React, { useCallback, useState } from "react"
import { cn } from "@/app/libs/utils"


type DateFormProps = {
  className?: string,
  title?: string,
  label?: string,
  size?: "auto" | "xs" | "sm" | "md" | "lg" | "xl",
  disabled?: boolean,
  defaultValue?: string,
  errorMessage?: string,
  validate?: (value: string) => boolean,
  onChange?: (value: string, valid: boolean, title: string) => void,
}

export default React.memo(React.forwardRef<HTMLInputElement, DateFormProps>(function TextForm({
  className = "",
  title = "",
  label = "",
  size = "auto",
  disabled = false,
  defaultValue = new Date().toISOString().slice(0,10),
  errorMessage = "",
  validate = undefined,
  onChange = undefined,
}, ref) {
  const validateValue = useCallback((value: string) => {
    let valid = !!value.match(/[0-9]{4}-[0-9]{2}-[0-9]{2}/)
    if (validate) {
      valid = (valid && validate(value))
    }
    return valid
  }, [validate])

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
        type="date"
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
      {
        (!disabled && validate && !valid && errorMessage) &&
        <p className="mt-1 px-2 text-sm text-red-600">
          { errorMessage }
        </p>
      }
    </div>
  )
}))
