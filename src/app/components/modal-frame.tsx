import React, { useRef } from "react"
import { v4 as uuid } from "uuid"
import { cn } from "@/app/libs/utils"


type ModalFrameProps = {
  id?: string,
  size?: "sm" | "md" | "lg" | "xl",
  cols?: "1" | "2" | "3" | "4",
  closable?: boolean,
  title?: string,
  head?: React.JSX.Element,
  body?: React.JSX.Element,
  foot?: React.JSX.Element,
}

export default React.memo<ModalFrameProps>(function ModalFrame({
  id = "",
  size = "md",
  cols = "1",
  closable = true,
  title = "Title",
  head = <></>,
  body = <></>,
  foot = <></>,
}){
  const data = useRef({
    id: id || uuid(),
  })

  return (
    <div
      id={ data.current.id }
      className="hidden justify-center items-center w-full overflow-x-hidden overflow-y-hidden fixed inset-0 top-0 left-0 right-0 z-50 bg-gray-500 bg-opacity-70"
      data-modal-backdrop="static"
      data-modal-placement="top-center"
      tabIndex={ -1 }
      aria-hidden="true"
      suppressHydrationWarning
    >
      <div className={ cn(
        "w-full",
        (size === "sm") && "max-w-[45dvw]",
        (size === "md") && "max-w-[60dvw]",
        (size === "lg") && "max-w-[75dvw]",
        (size === "xl") && "max-w-[90dvw]",
      ) }>
        <div className="bg-white rounded-lg border">
          <div className="flex flex-col border-b border-gray-200 rounded-t px-4">
            <div className="flex items-center justify-between pt-3 pb-1">
              <div className="ps-2 text-xl font-semibold text-gray-900">
                { title }
              </div>
              {
                (closable) &&
                <button
                  className="inline-flex justify-center items-center w-8 h-8 ms-auto text-sm text-gray-400 bg-transparent hover:text-gray-900 hover:bg-gray-200 rounded-lg"
                  data-modal-hide={ data.current.id }
                >
                  <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                  </svg>
                  <span className="sr-only">
                    Close modal
                  </span>
                </button>
              }
            </div>
            { head }
          </div>
          <div className={ cn(
            "max-h-[70dvh] overflow-y-auto p-4",
            (cols === "1") && "flex flex-col",
            (cols === "2") && "grid grid-cols-2 items-center gap-x-2 gap-y-4",
            (cols === "3") && "grid grid-cols-3 items-center gap-x-2 gap-y-4",
            (cols === "4") && "grid grid-cols-4 items-center gap-x-2 gap-y-4",
          ) }>
            { body }
          </div>
          <div className="flex justify-center px-2 py-2 border-t border-gray-200 rounded-b">
            { foot }
          </div>
        </div>
      </div>
    </div>
  )
})
