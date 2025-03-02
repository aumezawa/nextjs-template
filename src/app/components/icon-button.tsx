import React, { useCallback } from "react"
import { cn } from "@/app/libs/utils"


type IconButtonProps = {
  className?: string,
  title?: string,
  size?: "auto" | "xs" | "sm" | "md" | "lg" | "xl" | "full",
  color?: "white" | "black" | "blue" | "green" | "red" | "yellow",
  bgcolor?: "transparent" | "white" | "black" | "blue" | "green" | "red" | "yellow",
  label?: "edit"  | "dollar" | "plus" | "file-plus" | "file-check" | "file-csv" | "file-export" | "message" | "search" | "left" | "right",
  disabled?: boolean,
  open?: string,
  close?: string,
  onClick?: (title: string) => void
}

export default React.memo(React.forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton({
  className = "",
  title = "",
  size = "auto",
  color = "white",
  bgcolor = "blue",
  label = "edit",
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
          "justify-items-center mx-2 my-2 px-5 py-2.5 rounded-lg focus:outline-none",
          (size === "xs") && "w-full max-w-xs mx-auto",
          (size === "sm") && "w-full max-w-sm mx-auto",
          (size === "md") && "w-full max-w-md mx-auto",
          (size === "lg") && "w-full max-w-lg mx-auto",
          (size === "xl") && "w-full max-w-xl mx-auto",
          (size === "full") && "w-full",
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
      <svg
        className={ cn(
          "w-6 h-6",
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
        ) }
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        fill="none"
        viewBox="0 0 24 24"
      >
        {
          (label === "edit") ?
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z"/>
          :
          (label === "dollar") ?
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 17.345a4.76 4.76 0 0 0 2.558 1.618c2.274.589 4.512-.446 4.999-2.31.487-1.866-1.273-3.9-3.546-4.49-2.273-.59-4.034-2.623-3.547-4.488.486-1.865 2.724-2.899 4.998-2.31.982.236 1.87.793 2.538 1.592m-3.879 12.171V21m0-18v2.2"/>
          :
          (label === "plus") ?
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14m-7 7V5"/>
          :
          (label === "file-plus") ?
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9V4a1 1 0 0 0-1-1H8.914a1 1 0 0 0-.707.293L4.293 7.207A1 1 0 0 0 4 7.914V20a1 1 0 0 0 1 1h4M9 3v4a1 1 0 0 1-1 1H4m11 6v4m-2-2h4m3 0a5 5 0 1 1-10 0 5 5 0 0 1 10 0Z"/>
          :
          (label === "file-check") ?
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 3v4a1 1 0 0 1-1 1H5m4 6 2 2 4-4m4-8v16a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V7.914a1 1 0 0 1 .293-.707l3.914-3.914A1 1 0 0 1 9.914 3H18a1 1 0 0 1 1 1Z"/>
          :
          (label === "file-csv") ?
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10V7.914a1 1 0 0 1 .293-.707l3.914-3.914A1 1 0 0 1 9.914 3H18a1 1 0 0 1 1 1v6M5 19v1a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-1M10 3v4a1 1 0 0 1-1 1H5m2.665 9H6.647A1.647 1.647 0 0 1 5 15.353v-1.706A1.647 1.647 0 0 1 6.647 12h1.018M16 12l1.443 4.773L19 12m-6.057-.152-.943-.02a1.34 1.34 0 0 0-1.359 1.22 1.32 1.32 0 0 0 1.172 1.421l.536.059a1.273 1.273 0 0 1 1.226 1.718c-.2.571-.636.754-1.337.754h-1.13"/>
          :
          (label === "file-export") ?
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 10V4a1 1 0 0 0-1-1H9.914a1 1 0 0 0-.707.293L5.293 7.207A1 1 0 0 0 5 7.914V20a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2M10 3v4a1 1 0 0 1-1 1H5m5 6h9m0 0-2-2m2 2-2 2"/>
          :
          (label === "message") ?
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 10.5h.01m-4.01 0h.01M8 10.5h.01M5 5h14a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1h-6.6a1 1 0 0 0-.69.275l-2.866 2.723A.5.5 0 0 1 8 18.635V17a1 1 0 0 0-1-1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z"/>
          :
          (label === "search") ?
            <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="m21 21-3.5-3.5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"/>
          :
          (label === "left") ?
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14M5 12l4-4m-4 4 4 4"/>
          :
          (label === "right") ?
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 12H5m14 0-4 4m4-4-4-4"/>
          :
            <></>
        }
      </svg>
    </button>
  )
}))
