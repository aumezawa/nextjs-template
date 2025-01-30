"use client"
import React, { useCallback, useState } from "react"
import { cn } from "@/app/libs/utils"


type SelectFormProps = {
  options?: string[],
  className?: string,
  title?: string,
  label?: string,
  size?: "auto" | "xs" | "sm" | "md" | "lg" | "xl",
  disabled?: boolean,
  placeholder?: string,
  defaultValue?: number,
  errorMessage?: string,
  onChange?: (value: number, valid?: boolean, title?: string) => void,
}

export default React.memo(React.forwardRef<HTMLSelectElement, SelectFormProps>(function TextForm({
  options = [],
  className = "",
  title = "",
  label = "",
  size = "auto",
  disabled = false,
  placeholder = "Choose a option",
  defaultValue = -1,
  errorMessage = "",
  onChange = undefined,
}, ref) {
  const [valid, setValid] = useState((defaultValue >= 0) && (defaultValue < options.length))

  const handleChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setValid(e.currentTarget.value !== "-1")
    if (onChange) {
      onChange(Number(e.currentTarget.value), valid, title)
    }
  }, [valid, title, onChange])

  return (
    <div className={ cn(
      "mb-2",
      (size === "xs") && "mx-auto max-w-xs",
      (size === "sm") && "mx-auto max-w-sm",
      (size === "md") && "mx-auto max-w-md",
      (size === "lg") && "mx-auto max-w-lg",
      (size === "xl") && "mx-auto max-w-xl",
      className,
    ) }>
      <div className="relative w-full">
        <p className="block mb-1 text-sm font-medium text-gray-900">
          { label ? `${ label }:` : "" }
        </p>
        <select
          ref={ ref }
          className={ cn (
            "block p-2.5 w-full z-20 text-sm rounded-lg rounded-2 border",
            valid && "text-green-900 bg-green-50 border-green-700",
            !valid && "text-red-900 bg-red-50 border-red-700",
          ) }
          defaultValue={ defaultValue }
          onChange={ handleChange }
        >
          <option value="-1">{ placeholder }</option>
          {
            options.map((option: string, index: number) => (
              <option key={ index } value={ String(index) }>{ option }</option>
            ))
          }
        </select>
        <p className="px-2 mt-1 text-sm text-red-600">
          {
            (!disabled && !valid) && errorMessage
          }
        </p>
      </div>
    </div>
  )
}))
