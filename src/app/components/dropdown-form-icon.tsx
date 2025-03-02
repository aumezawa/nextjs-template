"use client"
import React, { useCallback,  useImperativeHandle, useRef } from "react"
import { v4 as uuid } from "uuid"
import { cn } from "@/app/libs/utils"
import type { FormElement } from "@/app/types/form"

import DateForm from "@/app/components/date-form"
import Textform from "@/app/components/text-form"


type DropdownFormIconProps = {
  id?: string,
  className?: string,
  title?: string,
  type?: "text" | "dec" | "JPY" | "USD" | "date",
  label?: "filter",
  disabled?: boolean,
  defaultValues?: string[],
  applying?: boolean,
  validate?: (value: string, title: string, subtitle: string) => boolean,
  onChange?: (value: string, valid: boolean, title: string, subtitle: string) => void,
}

export default React.memo(React.forwardRef<FormElement, DropdownFormIconProps>(function DropdownFormIcon({
  id = undefined,
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
  const refs = useRef({
    forms: [
      React.createRef<FormElement>(),
      React.createRef<FormElement>(),
    ],
  })

  const data = useRef({
    id: id || uuid(),
  })

  useImperativeHandle(ref, () => ({
    clear: () => {
      refs.current.forms.forEach((form: React.RefObject<FormElement | null>) => {
        form.current?.clear()
      })
    },
    set: (value?: string, index?: number) => {
      if (index !== undefined && index >= 0 && index <= 1) {
        refs.current.forms[index].current?.set(value)
      }
    },
    get: (index?: number) => {
      if (index !== undefined && index >= 0 && index <= 1) {
        return refs.current.forms[index].current?.get()
      }
      return undefined
    },
  }))

  const validateValue = useCallback((value: string, index: string) => {
    let valid = true

    if (type === "dec" || type === "JPY" || type === "USD") {
      if (index === "0") {
        refs.current.forms[1].current?.set()
      } else if (index === "1") {
        const from = refs.current.forms[0].current?.get()
        if (from && value) {
          if (Number(from) >= Number(value)) {
            valid = false
          }
        }
      }
    } else if (type === "date") {
      if (index === "0") {
        refs.current.forms[1].current?.set()
      } else if (index === "1") {
        const from = refs.current.forms[0].current?.get()
        if (from && value) {
          if (new Date(from) >= new Date(value)) {
            valid = false
          }
        }
      }
    }

    if (validate) {
      valid = valid && validate(value, title, index)
    }
    return valid
  }, [title, type, validate])

  const handleChange = useCallback((value: string, valid: boolean, index: string) => {
    if (onChange) {
      onChange(value, valid, title, index)
    }
  }, [title, onChange])

  return (
    <>
      <button
        id={ data.current.id }
        type="button"
        className={ cn(
          "flex m-0 p-0 bg-transparent border-0",
          (disabled) && "cursor-not-allowed",
          className,
        ) }
        disabled={ disabled }
        data-dropdown-toggle={ `${ data.current.id }-dropdown` }
        suppressHydrationWarning
      >
        {
          (label === "filter" && !applying) &&
          <svg className="w-4 h-4 text-gray-800" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M18.796 4H5.204a1 1 0 0 0-.753 1.659l5.302 6.058a1 1 0 0 1 .247.659v4.874a.5.5 0 0 0 .2.4l3 2.25a.5.5 0 0 0 .8-.4v-7.124a1 1 0 0 1 .247-.659l5.302-6.059c.566-.646.106-1.658-.753-1.658Z"/>
          </svg>
        }
        {
          (label === "filter" && applying) &&
          <svg className="w-4 h-4 text-gray-800" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
            <path d="M5.05 3C3.291 3 2.352 5.024 3.51 6.317l5.422 6.059v4.874c0 .472.227.917.613 1.2l3.069 2.25c1.01.742 2.454.036 2.454-1.2v-7.124l5.422-6.059C21.647 5.024 20.708 3 18.95 3H5.05Z"/>
          </svg>
        }
      </button>
      <div
        id={ `${ data.current.id }-dropdown` }
        className="z-20 hidden bg-white border divide-y divide-gray-100 rounded-lg shadow-sm"
        suppressHydrationWarning
      >
        <ul className="px-2 pb-2 text-sm text-gray-700">
          <li className="grid grid-cols-2 gap-2">
            {
              (type === "text") &&
              <Textform
                ref={ refs.current.forms[0] }
                id={ `${ data.current.id }-textform` }
                className="col-span-2 m-0 text-left normal-case"
                title="0"
                size="lg"
                label="Search"
                defaultValue={ defaultValues[0] }
                validate={ validateValue }
                onChange={ handleChange }
              />
            }
            {
              (type === "dec" || type === "JPY" || type === "USD") &&
              <>
                <Textform
                  ref={ refs.current.forms[0] }
                  id={ `${ data.current.id }-textform-0` }
                  className="m-0 text-left normal-case"
                  title="0"
                  type={ type }
                  size="lg"
                  label="From"
                  defaultValue={ defaultValues[0] }
                  validate={ validateValue }
                  onChange={ handleChange }
                />
                <Textform
                  ref={ refs.current.forms[1] }
                  id={ `${ data.current.id }-textform-1` }
                  className="m-0 text-left normal-case"
                  title="1"
                  type={ type }
                  size="lg"
                  label="To"
                  defaultValue={ defaultValues[1] }
                  validate={ validateValue }
                  onChange={ handleChange }
                />
              </>
            }
            {
              (type === "date") &&
              <>
                <DateForm
                  ref={ refs.current.forms[0] }
                  id={ `${ data.current.id }-dateform-0` }
                  className="m-0 text-left normal-case"
                  title="0"
                  type="date"
                  size="lg"
                  label="From"
                  defaultValue={ defaultValues[0] }
                  validate={ validateValue }
                  onChange={ handleChange }
                />
                <DateForm
                  ref={ refs.current.forms[1] }
                  id={ `${ data.current.id }-dateform-1` }
                  className="m-0 text-left normal-case"
                  title="1"
                  type="date"
                  size="lg"
                  label="To"
                  defaultValue={ defaultValues[1] }
                  validate={ validateValue }
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
