import React, { JSX } from "react"
import { cn } from "@/app/libs/utils"

/*
import { Modal } from "flowbite"
import type { ModalOptions, ModalInterface } from "flowbite"
import type { InstanceOptions } from "flowbite"
*/

type ModalProps = {
  id: string,
  size?: "sm" | "md" | "lg" | "xl",
  cols?: "1" | "2",
  header?: string,
  body?: JSX.Element,
  foot?: JSX.Element
}

export default React.memo<ModalProps>(function ModalFrame({
  id = undefined,
  size = "md",
  cols = "2",
  header = "Title",
  body = <></>,
  foot = <></>
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
      className="hidden overflow-x-hidden overflow-y-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full inset-0"
    >
      <div className={ cn(
        "relative w-full",
        (size === "sm") && "max-w-[45dvw]",
        (size === "md") && "max-w-[60dvw]",
        (size === "lg") && "max-w-[75dvw]",
        (size === "xl") && "max-w-[90dvw]",
      ) }>
        <div className="relative bg-white rounded-lg shadow">
          <div className="flex items-center justify-between p-4 border-b border-gray-200 rounded-t">
            <div className="text-xl font-semibold text-gray-900">
              { header }
            </div>
            <button type="button" className="inline-flex justify-center items-center w-8 h-8 ms-auto text-sm text-gray-400 bg-transparent hover:text-gray-900 hover:bg-gray-200 rounded-lg" data-modal-hide={ id }>
              <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
              </svg>
              <span className="sr-only">Close modal</span>
            </button>
          </div>
          <div className={ cn(
            "p-4 overflow-y-auto max-h-[75dvh]",
            (cols === "2") && "grid grid-cols-2 gap-6",
          ) }>
            { body }
          </div>
          <div className="p-4 border-t border-gray-200 rounded-b">
            { foot }
          </div>
        </div>
      </div>
    </div>
  )
})
