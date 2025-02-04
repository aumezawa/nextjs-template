import React from "react"
import { cn } from "@/app/libs/utils"

/*
import { Modal } from "flowbite"
import type { ModalOptions, ModalInterface } from "flowbite"
import type { InstanceOptions } from "flowbite"
*/

type ModalFrameProps = {
  id: string,
  size?: "sm" | "md" | "lg" | "xl",
  cols?: "1" | "2",
  closable?: boolean,
  title?: string,
  head?: React.JSX.Element,
  body?: React.JSX.Element,
  foot?: React.JSX.Element,
}

export default React.memo<ModalFrameProps>(function ModalFrame({
  id = undefined,
  size = "md",
  cols = "2",
  closable = true,
  title = "Title",
  head = <></>,
  body = <></>,
  foot = <></>,
}){

/*
  useEffect(() => {
    const modalElement: HTMLElement = document.querySelector(id)

    const modalOptions: ModalOptions = {
      placement: "top-center",
      backdrop: "static",
      backdropClasses: "bg-gray-900/50 fixed inset-0 z-40",
      closable: true,
      onHide: () => {},
      onShow: () => {},
      onToggle: () => {},
    }

    const instanceOptions: InstanceOptions = {
      id: id,
      override: true
    }

    new Modal(modalElement, modalOptions, instanceOptions)
  }, [id])
*/

  return (
    <div id={ id } data-modal-backdrop="static" data-modal-placement="top-center" tabIndex={ -1 } aria-hidden="true"
      className="hidden fixed w-full overflow-x-hidden overflow-y-hidden top-0 left-0 right-0 z-50 justify-center items-center inset-0"
      suppressHydrationWarning
    >
      <div className={ cn(
        "w-full",
        (size === "sm") && "max-w-[45dvw]",
        (size === "md") && "max-w-[60dvw]",
        (size === "lg") && "max-w-[75dvw]",
        (size === "xl") && "max-w-[90dvw]",
      ) }>
        <div className="bg-white rounded-lg shadow">
          <div className="flex flex-col border-b border-gray-200 rounded-t">
            <div className="flex items-center justify-between px-4 pt-4 pb-2">
              <div className="text-xl font-semibold text-gray-900">
                { title }
              </div>
              {
                (closable) &&
                <button type="button" className="inline-flex justify-center items-center w-8 h-8 ms-auto text-sm text-gray-400 bg-transparent hover:text-gray-900 hover:bg-gray-200 rounded-lg" data-modal-hide={ id }>
                  <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                  </svg>
                  <span className="sr-only">Close modal</span>
                </button>
              }
            </div>
            { head }
          </div>
          <div className={ cn(
            "flex flex-col max-h-[70dvh] overflow-y-auto p-4",
            (cols === "2") && "grid grid-cols-2 gap-6 items-center",
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
