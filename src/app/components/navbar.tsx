import React from "react"
import { cn } from "@/app/libs/utils"


type NavibarProps = {
  className?: string,
  title?: string,
  buttons?: Array<React.JSX.Element>,
}

export default React.memo<NavibarProps>(function Navibar({
  className = "",
  title = "Project",
  buttons = []
}){
  return (
    <div className={ cn (
      "text-white bg-gray-800 border border-gray-800",
      className,
    ) }>
      <div className="flex justify-between max-w-full px-4 py-2">
        <span className="text-2xl font-semibold whitespace-nowrap">
          { title }
        </span>
        <span>
          <ul className="flex flex-row space-x-4">
            {
              buttons.map((button: React.JSX.Element, index: number) => (
                <li key={ index }>
                  { button }
                </li>
              ))
            }
          </ul>
        </span>
      </div>
    </div>
  )
})