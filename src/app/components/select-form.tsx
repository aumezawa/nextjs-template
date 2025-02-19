"use client"
import React, { useCallback, useState } from "react"
import { v4 as uuid } from "uuid"
import { cn } from "@/app/libs/utils"


type SelectFormProps = {
  id?: string,
  className?: string,
  title?: string,
  size?: "auto" | "xs" | "sm" | "md" | "lg" | "xl" | "full",
  label?: string,
  options?: string[],
  disabled?: boolean,
  placeholder?: string,
  defaultIndex?: number,
  fixed?: boolean,
  validate?: (value: string, index: number) => boolean,
  onChange?: (value: string, index: number, valid: boolean, title: string) => void,
}

export default React.memo(React.forwardRef<HTMLSelectElement, SelectFormProps>(function SelectForm({
  id = uuid(),
  className = "",
  title = "",
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
      valid = (valid && validate(options[index], index))
    }
    return valid
  }, [options, validate])

  const [valid, setValid] = useState(validateValue(defaultIndex))

  const handleChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const index = Number(e.currentTarget.value)
    const valid = validateValue(index)
    if (onChange) {
      onChange(options[index], index, valid, title)
    }
    setValid(valid)
  }, [title, options, onChange, validateValue])

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
      <select
        key={ `${ id }-key-${ String(defaultIndex) }` }
        ref={ ref }
        id={ id }
        className={ cn (
          "w-full p-2.5 text-sm rounded-lg rounded-2 border",
          (valid) && "text-green-900 bg-green-50 border-green-700",
          (!valid) && "text-red-900 bg-red-50 border-red-700",
          (!validate) && "text-gray-900 bg-gray-50 border-gray-700",
          (disabled) && "text-gray-400 bg-gray-200 border-gray-400 cursor-not-allowed",
          (fixed) && "text-gray-900 bg-gray-50 border-gray-700 cursor-default",
        ) }
        disabled={ disabled || fixed }
        defaultValue={ String(defaultIndex) }
        onChange={ handleChange }
        suppressHydrationWarning
      >
        <option className="text-red-700" value="-1">
          { placeholder }
        </option>
        {
          options.map((option: string, index: number) => (
            <option key={ index } className="text-gray-900" value={ String(index) }>
              { option }
            </option>
          ))
        }
      </select>
    </div>
  )
}))
