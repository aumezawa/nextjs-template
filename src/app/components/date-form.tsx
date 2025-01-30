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
  onChange?: (value: string, valid?: boolean, title?: string) => void,
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
  const [valid, setValid] = useState(!!defaultValue.match(/[0-9]{4}-[0-9]{2}-[0-9]{2}/))

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (validate) {
      setValid(validate(e.currentTarget.value))
    }
    if (onChange) {
      onChange(e.currentTarget.value, valid, title)
    }
  }, [valid, title, validate, onChange])

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
        <p className="block text-sm font-medium mb-1 text-gray-900">
          { label ? `${ label }:` : "" }
        </p>
        <input
          ref={ ref }
          type="date"
          title={ title }
          className={ cn(
            "block p-2.5 w-full z-20 text-sm placeholder-gray-600 rounded-lg rounded-2 border",
            valid && "text-green-900 bg-green-50 border-green-700",
            !valid && "text-red-900 bg-red-50 border-red-700",
            !validate && "text-gray-900 bg-gray-50 border-gray-700",
            disabled && "text-gray-600 bg-gray-200 border-gray-400 placeholder-gray-400 cursor-not-allowed",
          ) }
          disabled={ disabled }
          defaultValue={ defaultValue.match(/[0-9]{4}-[0-9]{2}-[0-9]{2}/) || "" }
          onChange={ handleChange }
        />
        <p className="px-2 mt-1 text-sm text-red-600">
        {
            (!disabled && validate && !valid) && errorMessage
          }
        </p>
      </div>
    </div>
  )
}))
