"use client"
import React, { useCallback, useRef, useState } from "react"
import { v4 as uuid } from "uuid"
import { cn } from "@/app/libs/utils"


type SelectForm2Props = {
  id?: string,
  className?: string,
  title?: string,
  size?: "auto" | "xs" | "sm" | "md" | "lg" | "xl" | "full",
  label?: string,
  options?: string[],
  disabled?: boolean,
  placeholder?: string,
  defaultIndex?: number,
  fixed?: boolean,
  validate?: (value: string, index: number) => boolean,
  onChange?: (value: string, index: number, valid: boolean, title: string) => void,
}

export default React.memo(React.forwardRef<HTMLSelectElement, SelectForm2Props>(function SelectForm2({
  id = "",
  className = "",
  title = "",
  size = "auto",
  label = "undefined",
  options = [],
  disabled = false,
  placeholder = "Choose an option",
  defaultIndex = -1,
  fixed = false,
  validate = undefined,
  onChange = undefined,
}, ref) {
  const validateValue = useCallback((index: number) => {
    let valid = (index >= 0) && (index < options.length)
    if (validate) {
      valid = (valid && validate(options[index], index))
    }
    return valid
  }, [options, validate])

  const [valid, setValid] = useState(validateValue(defaultIndex))

  const data = useRef({
    id: id || uuid(),
  })

  const handleChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const index = Number(e.currentTarget.value)
    const valid = validateValue(index)
    if (onChange) {
      onChange(options[index], index, valid, title)
    }
    setValid(valid)
  }, [title, options, onChange, validateValue])

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
      <div className="relative w-full mt-3 group">
        <select
          key={ `${ data.current.id }-key-${ String(defaultIndex) }` }
          ref={ ref }
          id={ data.current.id }
          className={ cn (
            "block w-full px-0 py-2.5 text-sm bg-transparent border-0 border-b-2 appearance-none focus:outline-none focus:ring-0 peer",
            (valid) && "text-green-700 border-green-500 focus:border-green-500",
            (!valid) && "text-red-700 border-red-500 focus:border-red-500",
            (!validate) && "text-gray-900 border-gray-700 focus:border-gray-700",
            (disabled) && "text-gray-400 border-gray-400 cursor-not-allowed",
            (fixed) && "text-gray-900 border-gray-700 cursor-default",
          ) }
          disabled={ disabled || fixed }
          defaultValue={ String(defaultIndex) }
          onChange={ handleChange }
          suppressHydrationWarning
        >
          <option className="text-red-700" value="-1">
            { placeholder }
          </option>
          {
            options.map((option: string, index: number) => (
              <option key={ index } className="text-gray-900" value={ String(index) }>
                { option }
              </option>
            ))
          }
        </select>
        <label
          htmlFor={ data.current.id }
          className={ cn(
            "absolute top-3 -translate-y-6 origin-[0] scale-75 text-sm",
            (valid) && "text-green-500 peer-focus:text-green-700",
            (!valid) && "text-red-500 peer-focus:text-red-700",
            (!validate) && "text-gray-700 peer-focus:text-gray-900",
            (disabled) && "text-gray-400",
            (fixed) && "text-gray-700",
          ) }
          suppressHydrationWarning
        >
          { label }
        </label>
      </div>
    </div>
  )
}))
