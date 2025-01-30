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
      "text-white bg-gray-800 border-gray-800",
      className,
    ) }>
      <div className="max-w-full flex flex-wrap items-center justify-between mx-auto px-4 py-2">
        <span className="self-center text-2xl font-semibold whitespace-nowrap">
          { title }
        </span>
        <div className="block">
          <ul className="flex flex-row space-x-8 font-medium">
            {
              buttons.map((button: React.JSX.Element, index: number) => (
                <li key={ index }>
                  {
                    button
                  }
                </li>
              ))
            }
          </ul>
        </div>
      </div>
    </div >
  )
})