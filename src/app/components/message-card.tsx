"use client"
import React, { useCallback, useRef, useState } from "react"
import { cn } from "@/app/libs/utils"


type MessageCardProps = {
  className?: string,
  title?: string,
  message?: string,
  user?: string,
  date?: string,
  own?: boolean,
  type?: "normal" | "info" | "warning" | "error",
  command?: undefined | "edit" | "delete",
  onCommand?: (title: string, command: string, message: string) => void,
}

export default React.memo<MessageCardProps>(function MessageCard({
  className = "",
  title = "",
  message = "No message",
  user = "Unknown",
  date = "someday",
  own = false,
  type = "normal",
  command = undefined,
  onCommand = undefined,
}){
  const [editable, setEditable] = useState(false)

  const refs = useRef({
    message: React.createRef<HTMLInputElement>(),
  })

  const newMessage = useRef(message)

  const handleStartCommand = useCallback(() => {
    setEditable(!editable)
  }, [editable])

  const handleCancelCommand = useCallback(() => {
    if (refs.current.message.current) {
      refs.current.message.current.value = message
    }
    setEditable(!editable)
  }, [editable, message])

  const handleSubmitCommand = useCallback(() => {
    if (onCommand) {
      onCommand(title, command!, newMessage.current)
    }
    setEditable(!editable)
  }, [editable, title, command, onCommand])

  const handleChangeMessage = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    newMessage.current = e.currentTarget.value
  }, [])

  return (
    <div className={ cn(
      "flex w-full",
      (own) && "justify-end",
      className,
    ) }>
      <div className={ cn(
        "flex flex-col max-w-xl w-full mb-2 px-4 py-3",
        (own) && "rounded-ss-xl rounded-es-xl rounded-ee-xl",
        (!own) && "rounded-se-xl rounded-es-xl rounded-ee-xl",
        (type === "normal") && "bg-gray-100",
        (type === "info") && "bg-green-100",
        (type === "warning") && "bg-yellow-100",
        (type === "error") && "bg-red-100",
      ) }>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className={ cn(
              "text-sm font-semibold",
              (type === "normal") && "text-gray-900",
              (type === "info") && "text-green-900",
              (type === "warning") && "text-yellow-900",
              (type === "error") && "text-red-900",
            ) }>
              { user }
            </span>
            <span className={ cn(
              "text-sm font-semibold",
              (type === "normal") && "text-gray-500",
              (type === "info") && "text-green-500",
              (type === "warning") && "text-yellow-500",
              (type === "error") && "text-red-500",
            ) }>
              { date }
            </span>
          </div>
          {
            (own && command) &&
            <div className="inline-flex justify-center items-center gap-2">
              {
                (!editable) &&
                <button
                  type="button"
                  className={ cn(
                    "w-6 h-6 text-gray-800 bg-transparent hover:text-gray-900 rounded-lg",
                    (type === "normal") && "hover:bg-gray-300",
                    (type === "info") && "hover:bg-green-300",
                    (type === "warning") && "hover:bg-yellow-300",
                    (type === "error") && "hover:bg-red-300",
                  ) }
                  onClick={ handleStartCommand }
                >
                  {
                    (command === "edit") &&
                    <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z"/>
                    </svg>
                  }
                  {
                    (command === "delete") &&
                    <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18 17.94 6M18 18 6.06 6"/>
                    </svg>
                  }
                </button>
              }
              {
                (editable) &&
                <>
                  <button
                    type="button"
                    className={ cn(
                      "w-6 h-6 text-gray-800 bg-transparent hover:text-gray-900 rounded-lg",
                      (type === "normal") && "hover:bg-gray-300",
                      (type === "info") && "hover:bg-green-300",
                      (type === "warning") && "hover:bg-yellow-300",
                      (type === "error") && "hover:bg-red-300",
                    ) }
                    onClick={ handleCancelCommand }
                  >
                    <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9h13a5 5 0 0 1 0 10H7M3 9l4-4M3 9l4 4"/>
                    </svg>
                  </button>
                  <button
                    type="button"
                    className={ cn(
                      "w-6 h-6 text-gray-800 bg-transparent hover:text-gray-900 rounded-lg",
                      (type === "normal") && "hover:bg-gray-300",
                      (type === "info") && "hover:bg-green-300",
                      (type === "warning") && "hover:bg-yellow-300",
                      (type === "error") && "hover:bg-red-300",
                    ) }
                    onClick={ handleSubmitCommand }
                  >
                    <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 11.917 9.724 16.5 19 7.5"/>
                    </svg>
                  </button>
                </>
              }
            </div>
          }
        </div>
        <input
          ref={ refs.current.message }
          className={ cn(
            "py-1 text-sm font-normal bg-transparent focus:outline-0 hover:cursor-text",
            (type === "normal") && "text-gray-900",
            (type === "info") && "text-green-900",
            (type === "warning") && "text-yellow-900",
            (type === "error") && "text-red-900",
            (editable && command === "edit") && "font-semibold underline text-green-600",
            (editable && command === "delete") && "font-semibold line-through text-red-600",
          ) }
          defaultValue={ message }
          disabled={ !editable || (command === "delete") }
          onChange={ handleChangeMessage }
        />
      </div>
    </div>
  )
})
