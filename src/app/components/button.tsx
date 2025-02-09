import React, { useCallback } from "react"
import { cn } from "@/app/libs/utils"


type ButtonProps = {
  className?: string,
  title?: string,
  type?: "normal" | "nav"
  size?: "auto" | "xs" | "sm" | "md" | "lg" | "xl" | "full",
  color?: "blue" | "dark" | "light" | "green" | "red" | "yellow",
  label?: string,
  disabled?: boolean,
  open?: string,
  close?: string,
  onClick?: (title: string) => void,
}

export default React.memo(React.forwardRef<HTMLButtonElement, ButtonProps>(function Button({
  className = "",
  title = "",
  type = "normal",
  size = "auto",
  color = "blue",
  label = "undefined",
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
      className={
        cn(
          "text-center text-sm font-medium",
          (type === "normal") && "mx-2 my-2 px-4 py-3 rounded-lg focus:outline-none focus:ring-4",
          (size !== "auto") && "w-full",
          (size === "xs") && "max-w-xs mx-auto",
          (size === "sm") && "max-w-sm mx-auto",
          (size === "md") && "max-w-md mx-auto",
          (size === "lg") && "max-w-lg mx-auto",
          (size === "xl") && "max-w-xl mx-auto",
          (color === "blue") && "text-white bg-blue-700 hover:bg-blue-800 focus:ring-blue-300",
          (color === "blue") && disabled && "bg-blue-400",
          (color === "dark") && "text-white bg-gray-700 hover:bg-gray-800 focus:ring-gray-300",
          (color === "dark") && disabled && "bg-gray-400",
          (color === "light") && "text-gray-900 bg-white hover:bg-gray-100 focus:ring-gray-200 border border-gray-300",
          (color === "light") && disabled && "text-gray-600 bg-gray-200",
          (color === "green") && "text-white bg-green-700 hover:bg-green-800 focus:ring-green-300",
          (color === "green") && disabled && "bg-green-400",
          (color === "red") && "text-white bg-red-700 hover:bg-red-800 focus:ring-red-300",
          (color === "red") && disabled && "bg-red-400",
          (color === "yellow") && "text-white bg-yellow-300 hover:bg-yellow-400 focus:ring-yellow-500",
          (color === "yellow") && disabled && "bg-yellow-200",
          (type === "nav") && "mx-0 my-0 px-2 py-2 text-white bg-transparent rounded-md hover:text-gray-400 hover:bg-transparent",
          (type === "nav") && disabled && "text-gray-400",
          disabled && "hover:text-0 hover:bg-0 cursor-not-allowed",
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
