import React, { useCallback } from "react"
import { cn } from "@/app/libs/utils"


type ButtonProps = {
  className?: string,
  title?: string,
  size?: "auto" | "xs" | "sm" | "md" | "lg" | "xl" | "full",
  color?: "white" | "black" | "blue" | "green" | "red" | "yellow",
  bgcolor?: "transparent" | "white" | "black" | "blue" | "green" | "red" | "yellow",
  label?: string,
  disabled?: boolean,
  open?: string,
  close?: string,
  onClick?: (title: string) => void,
}

export default React.memo(React.forwardRef<HTMLButtonElement, ButtonProps>(function Button({
  className = "",
  title = "",
  size = "auto",
  color = "white",
  bgcolor = "blue",
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
          "mx-2 my-2 px-4 py-3 text-center text-sm font-medium rounded-lg focus:outline-none",
          (size === "xs") && "w-full max-w-xs mx-auto",
          (size === "sm") && "w-full max-w-sm mx-auto",
          (size === "md") && "w-full max-w-md mx-auto",
          (size === "lg") && "w-full max-w-lg mx-auto",
          (size === "xl") && "w-full max-w-xl mx-auto",
          (size === "full") && "w-full",
          (color === "white") && "text-white",
          (color === "black") && "text-gray-900",
          (color === "black") && disabled && "text-gray-700",
          (color === "blue") && "text-blue-600",
          (color === "blue") && disabled && "text-blue-400",
          (color === "green") && "text-green-600",
          (color === "green") && disabled && "text-green-400",
          (color === "red") && "text-red-600",
          (color === "red") && disabled && "text-red-400",
          (color === "yellow") && "text-yellow-300",
          (color === "yellow") && disabled && "text-yellow-400",
          (bgcolor === "transparent") && "bg-transparent",
          (bgcolor === "white") && "bg-white border border-gray-300 hover:bg-gray-100 focus:ring-4 focus:ring-gray-200",
          (bgcolor === "white") && disabled && "bg-gray-100",
          (bgcolor === "black") && "bg-gray-700 hover:bg-gray-800 focus:ring-4 focus:ring-gray-300",
          (bgcolor === "black") && disabled && "bg-gray-400",
          (bgcolor === "blue") && "bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300",
          (bgcolor === "blue") && disabled && "bg-blue-400",
          (bgcolor === "green") && "bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300",
          (bgcolor === "green") && disabled && "bg-green-400",
          (bgcolor === "red") && "bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300",
          (bgcolor === "red") && disabled && "bg-red-400",
          (bgcolor === "yellow") && "bg-yellow-300 hover:bg-yellow-400 focus:ring-4 focus:ring-yellow-200",
          (bgcolor === "yellow") && disabled && "bg-yellow-200",
          (disabled) && "hover:text-0 hover:bg-0 cursor-not-allowed",
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
