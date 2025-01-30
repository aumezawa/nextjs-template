"use client"
import React, { useCallback, useState } from "react"
import { cn } from "@/app/libs/utils"


type TextFormProps = {
  className?: string,
  title?: string,
  label?: string,
  size?: "auto" | "xs" | "sm" | "md" | "lg" | "xl",
  disabled?: boolean,
  placeholder?: string,
  defaultValue?: string,
  errorMessage?: string,
  button?: undefined | "search" | "download" | "upload",
  validate?: (value: string) => boolean,
  onChange?: (value: string, valid?: boolean, title?: string) => void,
  onSubmit?: () => void,
}

export default React.memo(React.forwardRef<HTMLInputElement, TextFormProps>(function TextForm({
  className = "",
  title = "",
  label = "",
  size = "auto",
  disabled = false,
  placeholder = "Input",
  errorMessage = "",
  defaultValue = "",
  button = undefined,
  validate = undefined,
  onChange = undefined,
  onSubmit = undefined,
}, ref) {
  const [valid, setValid] = useState(validate === undefined)

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (validate) {
      setValid(validate(e.currentTarget.value))
    }
    if (onChange) {
      onChange(e.currentTarget.value, valid, title)
    }
  }, [valid, title, validate, onChange])

  const handleSubmit = useCallback(() => {
    if (onSubmit) {
      onSubmit()
    }
  }, [onSubmit])

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
          type="text"
          title={ title }
          className={ cn(
            "block p-2.5 w-full z-20 text-sm placeholder-gray-600 rounded-lg rounded-2 border",
            valid && "text-green-900 bg-green-50 border-green-700",
            !valid && "text-red-900 bg-red-50 border-red-700",
            !validate && "text-gray-900 bg-gray-50 border-gray-700",
            disabled && "text-gray-600 bg-gray-200 border-gray-400 placeholder-gray-400 cursor-not-allowed",
          ) }
          disabled={ disabled }
          placeholder={ placeholder }
          defaultValue={ defaultValue }
          onChange={ handleChange }
        />
        {
          button &&
          <button
            className={ cn(
              "absolute top-0 end-0 p-2 h-full text-sm font-medium text-white rounded-e-lg border",
              (!disabled &&  valid) && "bg-blue-700 border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300",
              ( disabled || !valid) && "bg-blue-400 border-blue-400 cursor-not-allowed",
            ) }
            disabled={ disabled || !valid }
            onClick={ handleSubmit }
          >
            {
              (button === "search") &&
              <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
              </svg>
            }
            {
              (button === "download") &&
              <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 13V4M7 14H5a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1h-2m-1-5-4 5-4-5m9 8h.01"/>
              </svg>
            }
            {
              (button === "upload") &&
              <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v9m-5 0H5a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1h-2M8 9l4-5 4 5m1 8h.01"/>
              </svg>
            }
          </button>
        }
        <p className="px-2 mt-1 text-sm text-red-600">
          {
            (!disabled && validate && !valid) && errorMessage
          }
        </p>
      </div>
    </div>
  )
}))
