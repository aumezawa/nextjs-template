import React from "react"
import { cn } from "@/app/libs/utils"


type MessageBoxProps = {
  className?: string,
  type?: "normal" | "info" | "warning" | "error",
  message?: string,
}

export default React.memo<MessageBoxProps>(function MessageBox({
  className = "",
  type = "normal",
  message = "No message",
}){
  return (
    <div className={ cn(
      "w-full",
      className,
      "m-0 p-2",
    ) }>
      <div className={ cn(
        "px-4 py-3 font-medium border border-gray-200 rounded-lg",
        (type === "normal") && "text-gray-800 bg-gray-200",
        (type === "info") && "text-green-800 bg-green-200",
        (type === "warning") && "text-yellow-800 bg-yellow-200",
        (type === "error") && "text-red-800 bg-red-200",
      ) }>
        { message }
      </div>
    </div>
  )
})
