"use client"
import React, { useCallback, useState } from "react"
import { v4 as uuid } from "uuid"
import { cn } from "@/app/libs/utils"


type DateForm2Props = {
  id?: string,
  className?: string,
  title?: string,
  type?: "date" | "time" | "datetime-local",
  size?: "auto" | "xs" | "sm" | "md" | "lg" | "xl" | "full",
  label?: string,
  disabled?: boolean,
  defaultValue?: string,
  validate?: (value: string) => boolean,
  onChange?: (value: string, valid: boolean, title: string) => void,
}

export default React.memo(React.forwardRef<HTMLInputElement, DateForm2Props>(function DateForm2({
  id = uuid(),
  className = "",
  title = "",
  type = "datetime-local",
  size = "auto",
  label = "undefined",
  disabled = false,
  defaultValue = new Date().toISOString().slice(0,16),
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
      (size !== "auto") && "w-full",
      (size === "xs") && "max-w-xs mx-auto",
      (size === "sm") && "max-w-sm mx-auto",
      (size === "md") && "max-w-md mx-auto",
      (size === "lg") && "max-w-lg mx-auto",
      (size === "xl") && "max-w-xl mx-auto",
      className,
    ) }>
      <div className="relative w-full z-0 mt-3 group">
        <input
          ref={ ref }
          id={ id }
          type={ type }
          className={ cn(
            "block w-full px-0 py-2.5 text-sm bg-transparent border-0 border-b-2 appearance-none focus:outline-none focus:ring-0 peer",
            (valid) && "text-green-700 border-green-500 focus:border-green-500",
            (!valid) && "text-red-700 border-red-500 focus:border-red-500",
            (!validate) && "text-gray-900 border-gray-700 focus:border-gray-700",
            (disabled) && "text-gray-400 border-gray-400 cursor-not-allowed",
          ) }
          placeholder=""
          disabled={ disabled }
          defaultValue={ valid ? defaultValue : "" }
          onChange={ handleChange }
          suppressHydrationWarning
        />
        <label
          htmlFor={ id }
          className={ cn(
            "absolute top-3 -translate-y-6 origin-[0] scale-75 text-sm",
            (valid) && "text-green-500 peer-focus:text-green-700",
            (!valid) && "text-red-500 peer-focus:text-red-700",
            (!validate) && "text-gray-700 peer-focus:text-gray-900",
            (disabled) && "text-gray-400",
          ) }
          suppressHydrationWarning
        >
          { label }
        </label>
      </div>
    </div>
  )
}))
