import React from "react"
import { cn } from "@/app/libs/utils"


type MessageBoxProps = {
  className?: string,
  message?: string,
  type?: "info" | "warning" | "error",
}

export default React.memo<MessageBoxProps>(function MessageBox({
  className = "",
  message = "No message",
  type = "info",
}){
  return (
    <div className={ cn(
      "max-h-min w-full",
      className,
      "m-0 p-2",
    ) }>
      <div className={ cn(
        "p-4 font-medium border border-gray-200 rounded-lg",
        (type === "info") && "text-green-800 bg-green-200",
        (type === "warning") && "text-yellow-800 bg-yellow-200",
        (type === "error") && "text-red-800 bg-red-200",
      ) }>
        { message }
      </div>
    </div>
  )
})
