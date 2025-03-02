import React, { useCallback, useImperativeHandle, useRef } from "react"
import { v4 as uuid } from "uuid"
import { cn } from "@/app/libs/utils"
import type { FormElement } from "@/app/types/form"


type CheckboxProps = {
  id?: string,
  className?: string,
  title?: string,
  subtitle?: string,
  size?: "auto" | "xs" | "sm" | "md" | "lg" | "xl" | "full",
  label?: string,
  disabled?: boolean,
  defaultChecked?: boolean,
  fixed?: boolean,
  onChange?: (value: boolean, title: string, subtitle: string) => void,
}

export default React.memo(React.forwardRef<FormElement, CheckboxProps>(function Checkbox({
  id = undefined,
  className = "",
  title = "",
  subtitle = "",
  size = "auto",
  label = "undefined",
  disabled = false,
  defaultChecked = false,
  fixed = false,
  onChange = undefined,
}, ref) {
  const refs = useRef({
    input: React.createRef<HTMLInputElement>(),
  })

  const data = useRef({
    id: id || uuid(),
  })

  useImperativeHandle(ref, () => ({
    clear: () => {
      if (refs.current.input.current) {
        refs.current.input.current.checked = false
      }
    },
    set: () => {
      if (refs.current.input.current) {
        refs.current.input.current.checked = true
      }
    },
    get: () => {
      const value = refs.current.input.current?.checked
      if (value === undefined) {
        return undefined
      }
      if (value) {
        return "true"
      } else {
        return "false"
      }
    },
  }))

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(e.currentTarget.checked, title, subtitle)
    }
  }, [title, subtitle, onChange])

  return (
    <div className={ cn(
      "flex flex-row items-center gap-2 mb-2",
      (size === "xs") && "w-full max-w-xs mx-auto",
      (size === "sm") && "w-full max-w-sm mx-auto",
      (size === "md") && "w-full max-w-md mx-auto",
      (size === "lg") && "w-full max-w-lg mx-auto",
      (size === "xl") && "w-full max-w-xl mx-auto",
      (size === "full") && "w-full",
      className,
    ) }>
      <input
        ref={ refs.current.input }
        id={ data.current.id }
        type="checkbox"
        className={ cn(
          "w-4 h-4 text-blue-700 bg-gray-100 border-gray-400 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer",
          (disabled) && "text-blue-400 border-gray-300 cursor-not-allowed",
          (fixed) && "text-blue-700 border-gray-100 cursor-default",
        ) }
        disabled={ disabled || fixed }
        defaultChecked={ defaultChecked }
        onChange={ handleChange }
        suppressHydrationWarning
      />
      {
        (label) &&
        <label
          htmlFor={ data.current.id }
          className={ cn(
            "text-sm font-medium text-gray-900 whitespace-nowrap cursor-pointer",
            (disabled) && "text-gray-400 cursor-not-allowed",
            (fixed) && "text-gray-900 cursor-default",
          ) }
          suppressHydrationWarning
        >
          { label }
        </label>
      }
    </div>
  )
}))
