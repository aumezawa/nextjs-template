"use client"
import React, { useCallback, useImperativeHandle, useRef, useState } from "react"
import { v4 as uuid } from "uuid"
import { cn } from "@/app/libs/utils"
import type { FormElement } from "@/app/types/form"

import Checkbox from "@/app/components/checkbox"
import ToggleButton from "@/app/components/toggle-button"


type DropdownCheckboxProps = {
  id?: string,
  className?: string,
  title?: string,
  type?: "checkbox" | "toggle",
  size?: "auto" | "xs" | "sm" | "md" | "lg" | "xl" | "full",
  color?: "blue" | "green",
  label?: string,
  blank?: string,
  options?: string[],
  disabled?: boolean,
  defaultValues?: boolean[],
  disabledValues?: boolean[],
  reverse?: boolean,
  onChange?: (value: boolean, title: string, subtitle: string) => void,
}

export default React.memo(React.forwardRef<FormElement, DropdownCheckboxProps>(function DropdownCheckbox({
  id = undefined,
  className = "",
  title = "",
  type = "checkbox",
  size = "auto",
  color = "blue",
  label = "undefined",
  blank = "<Nothing>",
  options = [],
  disabled = false,
  defaultValues = options.map(() => (false)),
  disabledValues = options.map(() => (false)),
  reverse = false,
  onChange = undefined,
}, ref){
  const [reload, setReload] = useState(false)

  const updateDisplay = useCallback((values: boolean[]) => {
    if (reverse) {
      return options.filter((option: string, index: number) => (!!option && !values[index])).join(", ") || blank
    } else {
      return options.filter((option: string, index: number) => (!!option && values[index])).join(", ") || blank
    }
  }, [blank, options, reverse])

  const refs = useRef({
    forms: options.map(() => (React.createRef<FormElement>())),
  })

  const data = useRef({
    id: id || uuid(),
    display: updateDisplay(defaultValues),
    values: defaultValues,
  })

  useImperativeHandle(ref, () => ({
    clear: () => {
      data.current.values = options.map(() => (false))
      refs.current.forms.forEach((form: React.RefObject<FormElement | null>) => {
        form.current?.clear()
      })
    },
    set: (value?: string, index?: number) => {
      if (index !== undefined && index >= 0 && index < options.length) {
        if (value === "true") {
          data.current.values[index] = true
          refs.current.forms[index].current?.set()
        } else if (value === "false") {
          data.current.values[index] = false
          refs.current.forms[index].current?.clear()
        }
      }
    },
    get: (index?: number) => {
      if (index !== undefined && index >= 0 && index < options.length) {
        return refs.current.forms[index].current?.get()
      }
      return undefined
    },
  }))

  const handleChange = useCallback((value: boolean, index: string) => {
    data.current.values[Number(index)] = value
    data.current.display = updateDisplay(data.current.values)
    if (onChange) {
      onChange(value, title, index)
    }
    setReload(!reload)
  }, [reload, title, onChange, updateDisplay])

  return (
    <div className={ cn(
      "mb-2",
      (size === "xs") && "w-full max-w-xs mx-auto",
      (size === "sm") && "w-full max-w-sm mx-auto",
      (size === "md") && "w-full max-w-md mx-auto",
      (size === "lg") && "w-full max-w-lg mx-auto",
      (size === "xl") && "w-full max-w-xl mx-auto",
      (size === "full") && "w-full",
      className,
    ) }>
      <div className="flex flex-row">
        <div className="relative w-full z-0 mt-3 group">
          <button
            id={ data.current.id }
            type="button"
            className={ cn(
              "flex flex-row items-center w-full px-0 py-2.5 text-sm bg-transparent border-0 border-b-2 appearance-none focus:outline-none focus:ring-0 peer",
              "text-gray-900 border-gray-700 focus:border-gray-900",
              (disabled) && "text-gray-400 border-gray-400 cursor-not-allowed",
            ) }
            disabled={ disabled }
            data-dropdown-toggle={ `${ data.current.id }-dropdown` }
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
            htmlFor={ data.current.id }
            className={ cn(
              "absolute top-3 -translate-y-6 origin-[0] scale-75 text-sm text-left normal-case",
              "text-gray-700 peer-focus:text-gray-900",
              (disabled) && "text-gray-400",
            ) }
            suppressHydrationWarning
          >
            { label }
          </label>
        </div>
      </div>
      <div id={ `${ data.current.id }-dropdown` } className="z-20 hidden min-w-48 bg-white border divide-y divide-gray-100 rounded-lg shadow-sm" suppressHydrationWarning>
        <ul className="px-3 py-2 text-sm text-gray-700">
          {
            options.map((option: string, index: number) => {
              return (
                <li key={ index }>
                  <div className="flex items-center p-2 rounded-sm hover:bg-gray-100">
                    {
                      (type === "checkbox") &&
                      <Checkbox
                        ref={ refs.current.forms[index] }
                        className="m-0"
                        title={ String(index) }
                        label={ option }
                        disabled={ disabledValues[index] }
                        defaultChecked={ defaultValues[index] }
                        onChange={ handleChange }
                      />
                    }
                    {
                      (type === "toggle") &&
                      <ToggleButton
                        ref={ refs.current.forms[index] }
                        className="m-0"
                        title={ String(index) }
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
