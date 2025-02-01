import React, { useCallback } from "react"
import { cn } from "@/app/libs/utils"


type CheckboxProps = {
  className?: string,
  title?: string,
  label?: string,
  size?: "auto" | "xs" | "sm" | "md" | "lg" | "xl" | "full",
  disabled?: boolean,
  defaultChecked?: boolean,
  onChange?: (value: boolean, title: string) => void,
}

export default React.memo(React.forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox({
  className = "",
  title = "",
  label = "",
  size = "auto",
  disabled = false,
  defaultChecked = false,
  onChange = undefined,
}, ref) {
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(e.currentTarget.checked, title)
    }
  }, [onChange, title])

  return (
    <div className={ cn(
      "flex flex-row items-center gap-2 mb-2",
      (size === "xs") && "max-w-xs w-full mx-auto",
      (size === "sm") && "max-w-sm w-full mx-auto",
      (size === "md") && "max-w-md w-full mx-auto",
      (size === "lg") && "max-w-lg w-full mx-auto",
      (size === "xl") && "max-w-xl w-full mx-auto",
      (size === "full") && "w-full px-2",
      className,
    ) }>
      <input
        ref={ ref }
        type="checkbox"
        title={ title }
        className={ cn(
          "w-4 h-4 text-blue-600 bg-gray-100 border-gray-400 rounded focus:ring-blue-500 focus:ring-2",
          (disabled) && "border-gray-300 cursor-not-allowed",
        ) }
        disabled={ disabled }
        defaultChecked={ defaultChecked }
        onChange={ handleChange }
      />
      { (label) &&
        <span
          className={ cn(
            "text-sm font-medium text-gray-900 whitespace-nowrap",
            (disabled) && "text-gray-600",
          ) }
        >
          { label }
        </span>
      }
    </div>
  )
}))
