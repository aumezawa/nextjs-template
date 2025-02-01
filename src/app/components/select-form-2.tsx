"use client"
import React, { useCallback, useState } from "react"
import { cn } from "@/app/libs/utils"


type SelectFormProps = {
  id: string,
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

export default React.memo(React.forwardRef<HTMLSelectElement, SelectFormProps>(function SelectForm2({
  id = undefined,
  options = [],
  className = "",
  title = "",
  label = "no label",
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
      <div className="flex flex-row">
        <div className="relative w-full z-0 mt-3 group">
          <select
            ref={ ref }
            id={ id }
            className={ cn (
              "block w-full py-2.5 px-0 text-sm bg-transparent border-0 border-b-2 appearance-none focus:outline-none focus:ring-0 peer",
              (valid) && "text-green-700 border-green-500 focus:border-green-500",
              (!valid) && "text-red-700 border-red-500 focus:border-red-500",
              (disabled) && "text-gray-600 border-gray-400 cursor-not-allowed",
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
              <option key={ index } value={ String(index) }>
                { option }
              </option>
            ))
            }
          </select>
          <label
            htmlFor={ id }
            className={ cn(
              "absolute top-3 -z-10 scale-75 text-sm -translate-y-6 origin-[0]",
              (valid) && "text-green-500 peer-focus:text-green-700",
              (!valid) && "text-red-500 peer-focus:text-red-700",
              (disabled) && "text-gray-600",
            ) }
          >
            { label }
          </label>
        </div>
      </div>
    </div>
  )
}))
