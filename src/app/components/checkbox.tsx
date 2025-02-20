import React, { useCallback, useRef } from "react"
import { v4 as uuid } from "uuid"
import { cn } from "@/app/libs/utils"


type CheckboxProps = {
  id?: string,
  className?: string,
  title?: string,
  size?: "auto" | "xs" | "sm" | "md" | "lg" | "xl" | "full",
  label?: string,
  disabled?: boolean,
  defaultChecked?: boolean,
  fixed?: boolean,
  onChange?: (value: boolean, title: string) => void,
}

export default React.memo(React.forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox({
  id = "",
  className = "",
  title = "",
  size = "auto",
  label = "undefined",
  disabled = false,
  defaultChecked = false,
  fixed = false,
  onChange = undefined,
}, ref) {
  const data = useRef({
    id: id || uuid(),
  })

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(e.currentTarget.checked, title)
    }
  }, [title, onChange])

  return (
    <div className={ cn(
      "flex flex-row items-center gap-2 mb-2",
      (size !== "auto") && "w-full",
      (size === "xs") && "max-w-xs mx-auto",
      (size === "sm") && "max-w-sm mx-auto",
      (size === "md") && "max-w-md mx-auto",
      (size === "lg") && "max-w-lg mx-auto",
      (size === "xl") && "max-w-xl mx-auto",
      className,
    ) }>
      <input
        key={ `${ data.current.id }-key-${ String(defaultChecked) }` }
        ref={ ref }
        id={ data.current.id }
        type="checkbox"
        className={ cn(
          "w-4 h-4 text-blue-700 bg-gray-100 border-gray-400 rounded focus:ring-blue-500 focus:ring-2",
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
