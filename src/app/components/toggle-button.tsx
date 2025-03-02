import React, { useCallback, useImperativeHandle, useRef } from "react"
import { v4 as uuid } from "uuid"
import { cn } from "@/app/libs/utils"
import type { FormElement } from "@/app/types/form"


type ToggleButtonProps = {
  id?: string,
  className?: string,
  title?: string,
  subtitle?: string,
  size?: "auto" | "xs" | "sm" | "md" | "lg" | "xl" | "full",
  color?: "blue" | "green",
  label?: string,
  disabled?: boolean,
  defaultChecked?: boolean,
  fixed?: boolean,
  onChange?: (value: boolean, title: string, subtitle: string) => void,
}

export default React.memo(React.forwardRef<FormElement, ToggleButtonProps>(function ToggleButton({
  id = undefined,
  className = "",
  title = "",
  subtitle = "",
  size = "auto",
  color = "blue",
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
      "flex my-2",
      (size === "xs") && "w-full max-w-xs mx-auto",
      (size === "sm") && "w-full max-w-sm mx-auto",
      (size === "md") && "w-full max-w-md mx-auto",
      (size === "lg") && "w-full max-w-lg mx-auto",
      (size === "xl") && "w-full max-w-xl mx-auto",
      (size === "full") && "w-full",
      className,
    ) }>
      <label className="inline-flex items-center gap-2">
        <input
          ref={ refs.current.input }
          id={ data.current.id }
          type="checkbox"
          className="sr-only peer"
          disabled={ disabled || fixed }
          defaultChecked={ defaultChecked }
          onChange={ handleChange }
          suppressHydrationWarning
        />
        <div
          className={ cn(
            "relative w-9 h-5 bg-gray-200 rounded-full cursor-pointer peer peer-focus:ring-4 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all",
            (color === "blue") && "peer-focus:ring-blue-300 peer-checked:bg-blue-600",
            (color === "blue") && (disabled) && "peer-checked:bg-blue-400",
            (color === "green") && "peer-focus:ring-green-300 peer-checked:bg-green-500",
            (color === "green") && (disabled) && "peer-checked:bg-green-300",
            (disabled) && "cursor-not-allowed",
            (fixed) && "cursor-default",
          ) }
          >
        </div>
        {
          (label) &&
          <span
            className={ cn(
              "text-sm font-medium text-gray-900 cursor-pointer",
              (disabled) && "text-gray-400 cursor-not-allowed",
              (fixed) && "text-gray-900 cursor-default",
            ) }
          >
            { label }
          </span>
        }
      </label>
    </div>
  )
}))
