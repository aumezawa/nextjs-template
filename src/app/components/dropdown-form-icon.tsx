"use client"
import React, { useCallback, useRef, useState } from "react"
import { v4 as uuid } from "uuid"
import { cn } from "@/app/libs/utils"

import DateForm2 from "./date-form-2"
import Textform2 from "@/app/components/text-form-2"


type DropdownFromIconProps = {
  id?: string,
  className?: string,
  title?: string,
  type?: "text" | "dec" | "JPY" | "USD" | "date",
  label?: "filter",
  disabled?: boolean,
  defaultValues?: string[],
  applying?: boolean,
  validate?: (values: string[]) => boolean,
  onChange?: (values: string[], valid: boolean, title: string) => void,
}

export default React.memo(React.forwardRef<HTMLButtonElement, DropdownFromIconProps>(function DropdownFromIcon({
  id = "",
  className = "",
  title = "",
  type = "text",
  label = "filter",
  disabled = false,
  defaultValues = ["", ""],
  applying = false,
  validate = undefined,
  onChange = undefined,
}, ref){
  const validateValue = useCallback((values: string[]) => {
    let valid = true
    if (type === "dec" || type === "JPY" || type === "USD") {
      const from = Number(values[0].replaceAll(",", "").replace("¥", "").replace("$", ""))
      const to = Number(values[1].replaceAll(",", "").replace("¥", "").replace("$", ""))
      valid = (values[0] === "") || (values[1] === "") || isNaN(from) || isNaN(to) || (from <= to)
    } else if (type === "date") {
      const from = new Date(values[0])
      const to = new Date(values[1])
      valid = (from.toString() === "Invalid Date") || (to.toString() === "Invalid Date") || (from <= to)
    }
    if (valid) {
      if (validate) {
        valid = (valid && validate(values))
      }
    }
    return valid
  }, [type, validate])

  const [valid, setValid] = useState(validateValue(defaultValues))

  const data = useRef({
    id: id || uuid(),
    values: defaultValues,
  })

  const handleChange = useCallback((value: string, valid: boolean, index: string) => {
    if (valid) {
      data.current.values[Number(index)] = value
    } else {
      data.current.values[Number(index)] = ""
    }
    {
      const valid = validateValue(data.current.values)
      if (onChange) {
        onChange(data.current.values, valid, title)
      }
      setValid(valid)
    }
  }, [title, onChange, validateValue])

  return (
    <>
      <button
        ref={ ref }
        id={ data.current.id }
        type="button"
        className={ cn(
          "flex m-0 p-0 bg-transparent border-0",
          (valid) && "",
          (!valid) && "",
          (disabled) && "cursor-not-allowed",
          className,
        ) }
        disabled={ disabled }
        data-dropdown-toggle={ `${ data.current.id }-dropdown` }
        suppressHydrationWarning
      >
        {
          (label === "filter" && !applying) &&
          <svg className="w-4 h-4 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M18.796 4H5.204a1 1 0 0 0-.753 1.659l5.302 6.058a1 1 0 0 1 .247.659v4.874a.5.5 0 0 0 .2.4l3 2.25a.5.5 0 0 0 .8-.4v-7.124a1 1 0 0 1 .247-.659l5.302-6.059c.566-.646.106-1.658-.753-1.658Z"/>
          </svg>
        }
        {
          (label === "filter" && applying) &&
          <svg className="w-4 h-4 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
            <path d="M5.05 3C3.291 3 2.352 5.024 3.51 6.317l5.422 6.059v4.874c0 .472.227.917.613 1.2l3.069 2.25c1.01.742 2.454.036 2.454-1.2v-7.124l5.422-6.059C21.647 5.024 20.708 3 18.95 3H5.05Z"/>
          </svg>
        }
      </button>
      <div id={ `${ data.current.id }-dropdown` } className="z-20 hidden w-96 bg-white border divide-y divide-gray-100 rounded-lg shadow-sm" suppressHydrationWarning>
        <ul className="px-2 pb-2 text-sm text-gray-700">
          <li className="grid grid-cols-2 gap-2">
            {
              (type === "text") &&
              <Textform2
                id={ `${ data.current.id }-textform` }
                className="col-span-2 m-0"
                title="0"
                size="full"
                label="search"
                defaultValue={ defaultValues[0] }
                validate={ undefined }
                onChange={ handleChange }
              />
            }
            {
              (type === "dec" || type === "JPY" || type === "USD") &&
              <>
                <Textform2
                  id={ `${ data.current.id }-textform-0` }
                  className="m-0"
                  title="0"
                  type={ type }
                  size="full"
                  label="From"
                  defaultValue={ defaultValues[0] }
                  validate={ undefined }
                  onChange={ handleChange }
                />
                <Textform2
                  id={ `${ data.current.id }-textform-1` }
                  className="m-0"
                  title="1"
                  type={ type }
                  size="full"
                  label="To"
                  defaultValue={ defaultValues[1] }
                  validate={ undefined }
                  onChange={ handleChange }
                />
              </>
            }
            {
              (type === "date") &&
              <>
                <DateForm2
                  className="m-0"
                  title="0"
                  type="date"
                  size="full"
                  label="From"
                  defaultValue={ defaultValues[0] }
                  validate={ undefined }
                  onChange={ handleChange }
                />
                <DateForm2
                  className="m-0"
                  title="1"
                  type="date"
                  size="full"
                  label="To"
                  defaultValue={ defaultValues[1] }
                  validate={ undefined }
                  onChange={ handleChange }
                />
              </>
            }
          </li>
        </ul>
      </div>
    </>
  )
}))
