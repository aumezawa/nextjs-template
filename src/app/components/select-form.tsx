"use client"
import React, { useCallback, useState } from "react"
import { cn } from "@/app/libs/utils"


type SelectFormProps = {
  id?: string,
  options?: string[],
  className?: string,
  title?: string,
  label?: string,
  size?: "auto" | "xs" | "sm" | "md" | "lg" | "xl" | "full",
  disabled?: boolean,
  placeholder?: string,
  defaultValue?: string,
  onChange?: (value: number, valid: boolean, title: string) => void,
  validate?: (value: number) => boolean,
}

export default React.memo(React.forwardRef<HTMLSelectElement, SelectFormProps>(function SelectForm({
  id = undefined,
  options = [],
  className = "",
  title = "",
  label = "",
  size = "auto",
  disabled = false,
  placeholder = "Choose an option",
  defaultValue = "-1",
  onChange = undefined,
  validate = undefined,
}, ref) {
  const validateValue = useCallback((value: string) => {
    let valid = (Number(value) >= 0) && (Number(value) < options.length)
    if (validate) {
      valid = (valid && validate(Number(value)))
    }
    return valid
  }, [options, validate])

  const [valid, setValid] = useState(validateValue(defaultValue))

  const handleChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const valid = validateValue(e.currentTarget.value)
    if (onChange) {
      onChange(Number(e.currentTarget.value), valid, title)
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
        <p className={ cn(
          "mb-1 text-sm font-medium text-gray-900",
          (disabled) && "text-gray-400",
        ) }>
          { label }
        </p>
      }
      <select
        ref={ ref }
        id={ id }
        className={ cn (
          "w-full p-2.5 text-sm rounded-lg rounded-2 border",
          (valid) && "text-green-900 bg-green-50 border-green-700",
          (!valid) && "text-red-900 bg-red-50 border-red-700",
          (disabled) && "text-gray-400 bg-gray-200 border-gray-400 placeholder-gray-400 cursor-not-allowed",
        ) }
        disabled={ disabled }
        defaultValue={ defaultValue }
        onChange={ handleChange }
      >
        <option value="-1">
          { placeholder }
        </option>
        {
          options.map((option: string, index: number) => (
            <option key={ index } value={ index.toString() }>
              { option }
            </option>
          ))
        }
      </select>
    </div>
  )
}))
