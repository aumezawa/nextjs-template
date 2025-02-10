"use client"
import React, { useCallback, useRef, useState } from "react"
import { v4 as uuid } from "uuid"
import { cn } from "@/app/libs/utils"

import Checkbox from "@/app/components/checkbox"
import ToggleButton from "@/app/components/toggle-button"


type DropdownCheckbox2Props = {
  id?: string,
  className?: string,
  title?: string,
  type?: "checkbox" | "toggle",
  size?: "auto" | "xs" | "sm" | "md" | "lg" | "xl" | "full",
  color?: "blue" | "green",
  label?: string,
  options?: string[],
  disabled?: boolean,
  defaultValues?: boolean[],
  disabledValues?: boolean[],
  reverse?: boolean,
  validate?: (values: boolean[]) => boolean,
  onChange?: (values: boolean[], valid: boolean, title: string) => void,
}

export default React.memo(React.forwardRef<HTMLButtonElement, DropdownCheckbox2Props>(function DropdownCheckbox2({
  id = uuid(),
  className = "",
  title = "",
  type = "checkbox",
  size = "auto",
  color = "blue",
  label = "undefined",
  options = [],
  disabled = false,
  defaultValues = [],
  disabledValues = [],
  reverse = false,
  validate = undefined,
  onChange = undefined,
}, ref){
  const validateValue = useCallback((values: boolean[]) => {
    let valid = true
    if (validate) {
      valid = (valid && validate(values))
    }
    return valid
  }, [validate])

  const [valid, setValid] = useState(validateValue(defaultValues))
  const [display, setDisplay] = useState(false)

  const updateDisplay = useCallback((values: boolean[]) => {
    if (reverse) {
      return options.filter((option: string, index: number) => (!!option && !values[index])).join(", ") || "<nothing>"
    } else {
      return options.filter((option: string, index: number) => (!!option && values[index])).join(", ") || "<nothing>"
    }
  }, [options, reverse])

  const data = useRef({
    display: updateDisplay(defaultValues),
    values: defaultValues,
  })

  const handleChange = useCallback((value: boolean, index: string) => {
    data.current.values[Number(index)] = value
    data.current.display = updateDisplay(data.current.values)
    const valid = validateValue(data.current.values)
    if (onChange) {
      onChange(data.current.values, valid, title)
    }
    setValid(valid)
    setDisplay(!display)
  }, [display, title, onChange, validateValue, updateDisplay])

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
          <button
            ref={ ref }
            id={ id }
            type="button"
            className={ cn(
              "flex flex-row items-center w-full px-0 py-2.5 text-sm bg-transparent border-0 border-b-2 appearance-none focus:outline-none focus:ring-0 peer",
              "text-gray-900 border-gray-700 focus:border-gray-700",
              (valid) && "text-green-700 border-green-500 focus:border-green-500",
              (!valid) && "text-red-700 border-red-500 focus:border-red-500",
              (!validate) && "text-gray-900 border-gray-700 focus:border-gray-700",
              (disabled) && "text-gray-400 border-gray-400 cursor-not-allowed",
            ) }
            disabled={ disabled }
            data-dropdown-toggle={ `${ id }-dropdown` }
            suppressHydrationWarning
          >
            <p className="flex-grow text-left">
              { data.current.display }
            </p>
            <svg className="w-2.5 h-2.5 mx-3 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4"/>
            </svg>
          </button>
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
      <div id={ `${ id }-dropdown` } className="z-10 hidden w-96 bg-white border divide-y divide-gray-100 rounded-lg shadow-sm" suppressHydrationWarning>
        <ul className="px-3 py-2 text-sm text-gray-700">
          {
            options.map((option: string, index: number) => {
              return (
                <li key={ index }>
                  <div className="flex items-center p-2 rounded-sm hover:bg-gray-100">
                    {
                      (type === "checkbox") &&
                      <Checkbox
                        className="m-0"
                        title={ index.toString() }
                        label={ option }
                        disabled={ disabledValues[index] }
                        defaultChecked={ defaultValues[index] }
                        onChange={ handleChange }
                      />
                    }
                    {
                      (type === "toggle") &&
                      <ToggleButton
                        className="m-0"
                        title={ index.toString() }
                        color={ color }
                        label={ option }
                        disabled={ disabledValues[index] }
                        defaultChecked={ defaultValues[index] }
                        onChange={ handleChange }
                      />
                    }
                  </div>
                </li>
              )
            })
          }
        </ul>
      </div>
    </div>
  )
}))
