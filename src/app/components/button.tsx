import React, { useCallback } from "react"
import { cn } from "@/app/libs/utils"


type ButtonProps = {
  className?: string,
  title?: string,
  label?: string,
  type?: undefined | "nav"
  color?: "blue" | "dark" | "light" | "green" | "red" | "yellow",
  disabled?: boolean,
  open?: string,
  close?: string,
  onClick?: (title: string) => void,
}

export default React.memo(React.forwardRef<HTMLButtonElement, ButtonProps>(function Button({
  className = "",
  title = "",
  type = undefined,
  label = "undefined",
  color = "blue",
  disabled = false,
  open = undefined,
  close = undefined,
  onClick = undefined,
}, ref){
  const handleClick = useCallback(() => {
    if (onClick) {
      onClick(title)
    }
  }, [title, onClick])

  return (
    <button
      ref={ ref }
      type="button"
      className={
        cn(
          "mx-2 my-2 px-4 py-3 text-center text-sm font-medium rounded-lg focus:ring-4 focus:outline-none",
          (color === "blue") && "text-white bg-blue-700 hover:bg-blue-800 focus:ring-blue-300",
          disabled && (color === "blue") && "text-white bg-blue-400 hover:bg-0 cursor-not-allowed",
          (color === "dark") && "text-white bg-gray-800 hover:bg-gray-900 focus:ring-gray-300",
          disabled && (color === "dark") && "text-white bg-gray-400 hover:bg-0 cursor-not-allowed",
          (color === "light") && "text-gray-900 bg-white hover:bg-gray-100 focus:ring-gray-100 border border-gray-300",
          disabled && (color === "light") && "text-gray-600 bg-gray-100 hover:bg-0 border border-gray-300 cursor-not-allowed",
          (color === "green") && "text-white bg-green-700 hover:bg-green-800 focus:ring-green-300",
          disabled && (color === "green") && "text-white bg-green-400 hover:bg-0 cursor-not-allowed",
          (color === "red") && "text-white bg-red-700 hover:bg-red-800 focus:ring-red-300",
          disabled && (color === "red") && "text-white bg-red-400 hover:bg-0 cursor-not-allowed",
          (color === "yellow") && "text-white bg-yellow-400 hover:bg-yellow-500 focus:ring-yellow-300",
          disabled && (color === "yellow") && "text-white bg-yellow-300 hover:bg-0 cursor-not-allowed",
          (type === "nav") && "mx-0 my-0 px-2 py-2 text-white bg-transparent hover:text-gray-400 hover:bg-transparent focus:ring-0 rounded-md",
          className,
        )
      }
      disabled={ disabled }
      data-modal-target={ open }
      data-modal-toggle={ open }
      data-modal-hide={ close }
      onClick={ handleClick }
    >
      { label }
    </button>
  )
}))
