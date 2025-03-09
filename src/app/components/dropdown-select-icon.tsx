"use client"
import React, { useCallback, useImperativeHandle, useRef, useState } from "react"
import { v4 as uuid } from "uuid"
import { cn } from "@/app/libs/utils"
import type { FormElement } from "@/app/types/form"

import Checkbox from "@/app/components/checkbox"


type DropdownSelectIconProps = {
  id?: string,
  className?: string,
  title?: string,
  subtitle?: string,
  color?: "white" | "black",
  label?: "filter",
  options?: string[],
  disabled?: boolean,
  defaultIndex?: number,
  applying?: boolean,
  onChange?: (value: string, index: number, valid: boolean, title: string, subtitle: string) => void,
}

export default React.memo(React.forwardRef<FormElement, DropdownSelectIconProps>(function DropdownSelectIcon({
  id = "",
  className = "",
  title = "",
  subtitle = "",
  color = "black",
  label = "filter",
  options = [],
  disabled = false,
  defaultIndex = -1,
  applying = false,
  onChange = undefined,
}, ref){
  const [reload, setReload] = useState(false)

  const refs = useRef({
    forms: options.map(() => (React.createRef<FormElement>())),
  })

  const data = useRef({
    id: id || uuid(),
    selected: defaultIndex,
  })

  useImperativeHandle(ref, () => ({
    clear: () => {
      data.current.selected = -1
      refs.current.forms.map((form: React.RefObject<FormElement | null>) => {
        form.current?.clear()
      })
    },
    set: (value?: string) => {
      if (value) {
        const index = Number(value)
        if (!isNaN(index) && index >= 0 && index < options.length) {
          data.current.selected = index
          refs.current.forms.map((form: React.RefObject<FormElement | null>) => {
            form.current?.clear()
          })
          refs.current.forms[index].current?.set()
          setReload(!reload)
        }
      }
    },
    get: () => {
      return String(data.current.selected)
    },
  }))

  const handleChange = useCallback((value: boolean, index: string) => {
    if (value) {
      data.current.selected = Number(index)
    } else {
      data.current.selected = -1
    }

    {
      const valid = (Number(index) >= 0 && Number(index) < options.length)
      const value = valid ? options[Number(index)] : ""
      if (onChange) {
        onChange(value, data.current.selected, valid, title, subtitle)
      }
    }
    setReload(!reload)
  }, [reload, title, subtitle, options, onChange])

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
          <svg
            className={ cn(
              "w-4 h-4",
              (color === "black") && "text-gray-800",
              (color === "white") && "text-white",
            ) }
            aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"
          >
            <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M18.796 4H5.204a1 1 0 0 0-.753 1.659l5.302 6.058a1 1 0 0 1 .247.659v4.874a.5.5 0 0 0 .2.4l3 2.25a.5.5 0 0 0 .8-.4v-7.124a1 1 0 0 1 .247-.659l5.302-6.059c.566-.646.106-1.658-.753-1.658Z"/>
          </svg>
        }
        {
          (label === "filter" && applying) &&
          <svg
            className={ cn(
              "w-4 h-4",
              (color === "black") && "text-gray-800",
              (color === "white") && "text-white",
            ) }
            aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24"
          >
            <path d="M5.05 3C3.291 3 2.352 5.024 3.51 6.317l5.422 6.059v4.874c0 .472.227.917.613 1.2l3.069 2.25c1.01.742 2.454.036 2.454-1.2v-7.124l5.422-6.059C21.647 5.024 20.708 3 18.95 3H5.05Z"/>
          </svg>
        }
      </button>
      <div id={ `${ data.current.id }-dropdown` } className="z-20 hidden bg-white border divide-y divide-gray-100 rounded-lg shadow-sm" suppressHydrationWarning>
        <ul className="px-3 py-2 text-sm text-left normal-case text-gray-700">
          {
            options.map((option: string, index: number) => {
              return (
                <li key={ index }>
                  <div className="flex items-center p-2 rounded-sm hover:bg-gray-100">
                    <Checkbox
                      ref={ refs.current.forms[index] }
                      className="m-0"
                      title={ String(index) }
                      label={ option }
                      disabled={ data.current.selected !== -1 && data.current.selected !== index }
                      onChange={ handleChange }
                    />
                  </div>
                </li>
              )
            })
          }
        </ul>
      </div>
    </>
  )
}))
