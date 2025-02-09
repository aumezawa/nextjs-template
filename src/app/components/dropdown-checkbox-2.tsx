"use client"
import React, { useCallback, useRef, useState } from "react"
import { cn } from "@/app/libs/utils"


type DropdownChechbox2Props = {
  id: string,
  className?: string,
  title?: string,
  label?: string,
  options?: string[],
  type?: "checkbox" | "toggle",
  size?: "auto" | "xs" | "sm" | "md" | "lg" | "xl" | "full",
  disabled?: boolean,
  defaultValues?: boolean[],
  reverse?: boolean,
  validate?: (values: boolean[]) => boolean,
  onChange?: (values: boolean[], valid: boolean) => void,
}

export default React.memo(React.forwardRef<HTMLButtonElement, DropdownChechbox2Props>(function DropdownChechbox2({
  id = "",
  className = "",
  title = "",
  label = "undefined",
  options = [],
  type = "checkbox",
  size = "auto",
  disabled = false,
  defaultValues = [],
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

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    data.current.values[Number(e.currentTarget.title)] = e.currentTarget.checked
    data.current.display = updateDisplay(data.current.values)
    const valid = validateValue(data.current.values)
    if (onChange) {
      onChange(data.current.values, valid)
    }
    setValid(valid)
    setDisplay(!display)
  }, [display, onChange, validateValue, updateDisplay])

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
      <p
        className={ cn(
          "origin-[0] scale-75 text-sm font-medium cursor-default",
          (valid) && "text-green-500",
          (!valid) && "text-red-500",
          (!validate) && "text-gray-700",
          (disabled) && "text-gray-400",
        ) }
      >
        { label }
      </p>
      <button
        ref={ ref }
        className={ cn(
          "flex flex-row items-center w-full text-sm border-0 border-b-2 cursor-default focus:outline-none focus:ring-0",
          "text-gray-900 border-gray-700 focus:border-gray-700",
          (valid) && "text-green-700 border-green-500 focus:border-green-500",
          (!valid) && "text-red-700 border-red-500 focus:border-red-500",
          (!validate) && "text-gray-900 border-gray-700 focus:border-gray-700",
          (disabled) && "text-gray-400 border-gray-400 cursor-not-allowed",
        ) }
        title={ title }
        disabled={ disabled }
        data-dropdown-toggle={ id }
      >
        <p className="flex-grow pt-0.5 pb-2.5 text-left">
          { data.current.display }
        </p>
        <svg className="w-2.5 h-2.5 ms-3 me-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4"/>
        </svg>
      </button>

      <div id={ id } className="z-10 hidden w-96 bg-white border divide-y divide-gray-100 rounded-lg shadow-sm" suppressHydrationWarning>
        <ul className="px-3 py-2 text-sm text-gray-700">
          {
            options.map((option: string, index: number) => {
              return (
                <li key={ index }>
                  <div className="flex items-center p-2 rounded-sm hover:bg-gray-100">
                    {
                      (type === "checkbox") &&
                      <>
                        <input
                          id={ `${ id }-${ option }` }
                          title={ index.toString() }
                          type="checkbox"
                          className="w-4 h-4 text-blue-700 bg-gray-100 border-gray-400 rounded focus:ring-blue-500 focus:ring-2"
                          defaultChecked={ defaultValues[index] }
                          onChange={ handleChange }
                        />
                        <label
                          htmlFor={ `${ id }-${ option }` }
                          className="w-full ms-2 text-sm font-medium text-gray-900 rounded-sm"
                        >
                          { option }
                        </label>
                      </>
                    }
                    {
                      (type === "toggle") &&
                      <label className="inline-flex items-center w-full cursor-pointer">
                        <input
                          title={ index.toString() }
                          type="checkbox"
                          className="sr-only peer"
                          defaultChecked={ defaultValues[index] }
                          onChange={ handleChange }
                        />
                        <div className="relative w-9 h-5 rounded-full bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 peer peer-checked:after:translate-x-full rtl:peer-checked:after:translate-x-[-100%] peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600">
                        </div>
                        <span className="ms-3 text-sm font-medium text-gray-900">
                          { option }
                        </span>
                      </label>
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
