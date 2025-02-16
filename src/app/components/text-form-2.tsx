"use client"
import React, { useCallback, useState } from "react"
import { v4 as uuid } from "uuid"
import { cn } from "@/app/libs/utils"


type TextForm2Props = {
  id?: string,
  className?: string,
  title?: string,
  size?: "auto" | "xs" | "sm" | "md" | "lg" | "xl" | "full",
  label?: string,
  button?: "none" | "search" | "download" | "upload" | "message",
  disabled?: boolean,
  defaultValue?: string,
  validate?: (value: string) => boolean,
  onChange?: (value: string, valid: boolean, title: string) => void,
  onSubmit?: () => void,
}

export default React.memo(React.forwardRef<HTMLInputElement, TextForm2Props>(function TextForm2({
  id = uuid(),
  className = "",
  title = "",
  size = "auto",
  label = "undefined",
  button = "none",
  disabled = false,
  defaultValue = "",
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
      (size !== "auto") && "w-full",
      (size === "xs") && "max-w-xs mx-auto",
      (size === "sm") && "max-w-sm mx-auto",
      (size === "md") && "max-w-md mx-auto",
      (size === "lg") && "max-w-lg mx-auto",
      (size === "xl") && "max-w-xl mx-auto",
      className,
    ) }>
      <div className="flex flex-row">
        <div className="relative w-full z-0 mt-3 group">
          <input
            ref={ ref }
            id={ id }
            type="text"
            className={ cn(
              "block w-full py-2.5 px-0 text-sm bg-transparent border-0 border-b-2 appearance-none focus:outline-none focus:ring-0 peer",
              (valid) && "text-green-700 border-green-500 focus:border-green-500",
              (!valid) && "text-red-700 border-red-500 focus:border-red-500",
              (!validate) && "text-gray-900 border-gray-700 focus:border-gray-700",
              (disabled) && "text-gray-400 border-gray-400 cursor-not-allowed",
            ) }
            placeholder=""
            disabled={ disabled }
            defaultValue={ defaultValue }
            onChange={ handleChange }
            suppressHydrationWarning
          />
          <label
            htmlFor={ id }
            className={ cn(
              "absolute transform duration-300 top-3 -translate-y-6 origin-[0] scale-75 text-sm peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:font-medium peer-focus:scale-75 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0",
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
        {
          (button !== "none") &&
          <button
            className={ cn(
              "mt-5 px-3 text-gray-900 bg-transparent border-0 border-b-2",
              (valid) && "border-green-500 hover:text-green-500 focus:text-green-700",
              (!valid) && "text-gray-400 border-red-500 cursor-not-allowed",
              (!validate) && "border-gray-700 hover:text-blue-500 focus:text-blue-700",
              (disabled) && "text-gray-400 border-gray-400 cursor-not-allowed",
            ) }
            disabled={ disabled || !valid }
            onClick={ handleSubmit }
          >
            {
              (button === "search") ?
                <svg className="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                </svg>
              :
              (button === "download") ?
                <svg className="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 13V4M7 14H5a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1h-2m-1-5-4 5-4-5m9 8h.01"/>
                </svg>
              :
              (button === "upload") ?
                <svg className="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v9m-5 0H5a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1h-2M8 9l4-5 4 5m1 8h.01"/>
                </svg>
              :
              (button === "message") ?
                <svg className="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 10.5h.01m-4.01 0h.01M8 10.5h.01M5 5h14a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1h-6.6a1 1 0 0 0-.69.275l-2.866 2.723A.5.5 0 0 1 8 18.635V17a1 1 0 0 0-1-1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z"/>
                </svg>
              :
                <></>
            }
          </button>
        }
      </div>
    </div>
  )
}))
