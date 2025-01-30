import React, { useCallback } from "react"
import { cn } from "@/app/libs/utils"


type IconButtonProps = {
  className?: string,
  title?: string,
  icon?: "edit" | "left" | "right",
  color?: "light" | "dark" | "blue" | "green" | "red" | "yellow",
  disabled?: boolean,
  open?: string,
  close?: string,
  onClick?: (title: string) => void
}

export default React.memo<IconButtonProps>(function IconButton({
  className = "",
  title = "",
  icon = "edit",
  color = "light",
  disabled = false,
  open = undefined,
  close = undefined,
  onClick = undefined,
}){
  const handleClick = useCallback(() => {
    if (onClick) {
      onClick(title)
    }
  }, [title, onClick])

  return (
    <button
      type="button"
      className={
        cn(
          "inline-flex items-center text-center text-sm font-medium rounded-lg focus:ring-4 focus:outline-none",
          "mx-2 my-2 px-5 py-2.5 gap-2",
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
          disabled && (color === "yellow") && "text-white bg-yellow-400 hover:bg-0 cursor-not-allowed",
          className,
        )
      }
      disabled={ disabled }
      data-modal-target={ open }
      data-modal-toggle={ open }
      data-modal-hide={ close }
      onClick={ handleClick }
    >
      {
        (icon === "left") &&
        <svg className={ cn("w-6 h-6 text-white", (color === "light") && "text-gray-900") } aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14M5 12l4-4m-4 4 4 4"/>
        </svg>
      }
      {
        (icon === "right") &&
        <svg className={ cn("w-6 h-6 text-white", (color === "light") && "text-gray-900") } aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 12H5m14 0-4 4m4-4-4-4"/>
        </svg>
      }
      {
        (icon === "edit") &&
        <svg className={ cn("w-6 h-6 text-white", (color === "light") && "text-gray-900") } aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z"/>
        </svg>
      }
    </button>
  )
})
