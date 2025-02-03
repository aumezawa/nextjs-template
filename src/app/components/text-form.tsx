"use client"
import React, { useCallback, useState } from "react"
import { cn } from "@/app/libs/utils"


type TextFormProps = {
  id?: string,
  className?: string,
  title?: string,
  label?: string,
  size?: "auto" | "xs" | "sm" | "md" | "lg" | "xl" | "full",
  disabled?: boolean,
  placeholder?: string,
  defaultValue?: string,
  button?: undefined | "search" | "download" | "upload" | "message",
  validate?: (value: string) => boolean,
  onChange?: (value: string, valid: boolean, title: string) => void,
  onSubmit?: () => void,
}

export default React.memo(React.forwardRef<HTMLInputElement, TextFormProps>(function TextForm({
  id = undefined,
  className = "",
  title = "",
  label = "",
  size = "auto",
  disabled = false,
  placeholder = "Input",
  defaultValue = "",
  button = undefined,
  validate = undefined,
  onChange = undefined,
  onSubmit = undefined,
}, ref) {
  const validateValue = useCallback((value: string) => {
    let valid = true
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

  const handleSubmit = useCallback(() => {
    if (onSubmit) {
      onSubmit()
    }
  }, [onSubmit])

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
      <div className="flex flex-row">
        <input
          ref={ ref }
          id={ id }
          type="text"
          title={ title }
          className={ cn(
            "flex-grow min-w-0 p-2.5 text-sm placeholder-gray-600 rounded-s-lg rounded-2 border",
            (valid) && "text-green-900 bg-green-50 border-green-700",
            (!valid) && "text-red-900 bg-red-50 border-red-700",
            (!validate) && "text-gray-900 bg-gray-50 border-gray-700",
            (disabled) && "text-gray-600 bg-gray-200 border-gray-400 placeholder-gray-400 cursor-not-allowed",
            (!button) && "rounded-e-lg",
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
              "px-3 text-white rounded-e-lg border",
              (!disabled && valid) && "bg-blue-700 border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300",
              (disabled || !valid) && "bg-blue-400 border-blue-400 cursor-not-allowed",
            ) }
            disabled={ disabled || !valid }
            onClick={ handleSubmit }
          >
            {
              (button === "search") &&
              <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 20 20">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
              </svg>
            }
            {
              (button === "download") &&
              <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 13V4M7 14H5a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1h-2m-1-5-4 5-4-5m9 8h.01"/>
              </svg>
            }
            {
              (button === "upload") &&
              <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v9m-5 0H5a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1h-2M8 9l4-5 4 5m1 8h.01"/>
              </svg>
            }
            {
              (button === "message") &&
              <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 22 22">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 10.5h.01m-4.01 0h.01M8 10.5h.01M5 5h14a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1h-6.6a1 1 0 0 0-.69.275l-2.866 2.723A.5.5 0 0 1 8 18.635V17a1 1 0 0 0-1-1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z"/>
              </svg>
            }
          </button>
        }
      </div>
    </div>
  )
}))
