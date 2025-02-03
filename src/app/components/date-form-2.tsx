"use client"
import React, { useCallback, useState } from "react"
import { cn } from "@/app/libs/utils"


type DateForm2Props = {
  id: string,
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

export default React.memo(React.forwardRef<HTMLInputElement, DateForm2Props>(function DateForm2({
  id = undefined,
  className = "",
  type = "datetime-local",
  title = "",
  label = "no label",
  size = "auto",
  disabled = false,
  defaultValue = new Date().toISOString().slice(0,10),
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
      <div className="flex flex-row">
        <div className="relative w-full z-0 mt-3 group">
          <input
            ref={ ref }
            id={ id }
            type={ type }
            title={ title }
            className={ cn(
              "block w-full py-2.5 px-0 text-sm bg-transparent border-0 border-b-2 appearance-none focus:outline-none focus:ring-0 peer",
              (valid) && "text-green-700 border-green-500 focus:border-green-500",
              (!valid) && "text-red-700 border-red-500 focus:border-red-500",
              (!validate) && "text-gray-900 border-gray-700 focus:border-gray-700",
              (disabled) && "text-gray-600 border-gray-400 cursor-not-allowed",
            ) }
            placeholder=""
            disabled={ disabled }
            defaultValue={ valid ? defaultValue : "" }
            onChange={ handleChange }
          />
          <label
            htmlFor={ id }
            className={ cn(
              "absolute top-3 -z-10 scale-75 text-sm -translate-y-6 origin-[0]",
              (valid) && "text-green-500 peer-focus:text-green-700",
              (!valid) && "text-red-500 peer-focus:text-red-700",
              (!validate) && "text-gray-700 peer-focus:text-blue-700",
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
