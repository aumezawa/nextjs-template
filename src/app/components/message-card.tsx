"use client"
import React, { useCallback, useRef, useState } from "react"
import { cn } from "@/app/libs/utils"


type MessageCardProps = {
  className?: string,
  title?: string,
  type?: "normal" | "info" | "warning" | "error",
  message?: string,
  user?: string,
  date?: string,
  alignEnd?: boolean,
  editable?: boolean,
  removable?: boolean,
  onEdit?: (value: string, title: string) => void,
  onRemove?: (title: string) => void,
}

export default React.memo<MessageCardProps>(function MessageCard({
  className = "",
  title = "",
  type = "normal",
  message = "No message",
  user = "Unknown",
  date = "someday",
  alignEnd = false,
  editable = false,
  removable = false,
  onEdit = undefined,
  onRemove = undefined,
}){
  const [edit, setEdit] = useState(false)
  const [remove, setRemove] = useState(false)

  const refs = useRef({
    message: React.createRef<HTMLDivElement>(),
    textarea: React.createRef<HTMLTextAreaElement>(),
  })

  const messages = useRef({
    old: message,
    new: message,
  })

  const handleStartEdit = useCallback(() => {
    setEdit(true)
  }, [])

  const handleStartRemove = useCallback(() => {
    setRemove(true)
  }, [])

  const handleCancel = useCallback(() => {
    if (edit) {
      if (refs.current.message.current) {
        refs.current.message.current.textContent = messages.current.old
      }
      if (refs.current.textarea.current) {
        refs.current.textarea.current.value = messages.current.old
      }
      setEdit(false)
    }
    if (remove) {
      setRemove(false)
    }
  }, [edit, remove])

  const handleSubmit = useCallback(() => {
    if (edit) {
      if (onEdit) {
        onEdit(messages.current.new, title)
      }
      messages.current.old = messages.current.new
      setEdit(false)
    }
    if (remove) {
      if (onRemove) {
        onRemove(title)
      }
      setRemove(false)
    }
  }, [edit, remove, title, onEdit, onRemove])

  const handleChangeMessage = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.currentTarget.value.includes("\n") || e.currentTarget.value.includes("  ")) {
      if (refs.current.textarea.current) {
        refs.current.textarea.current.value = messages.current.new
      }
    } else {
      messages.current.new = e.currentTarget.value
      if (refs.current.message.current) {
        refs.current.message.current.textContent = e.currentTarget.value
      }
    }
  }, [])

  return (
    <div className={ cn(
      "flex w-full",
      (alignEnd) && "justify-end",
      className,
    ) }>
      <div className={ cn(
        "flex flex-col max-w-xl w-full mb-2 px-4 py-3 rounded-ss-none rounded-se-xl rounded-es-xl rounded-ee-xl",
        (alignEnd) && "rounded-ss-xl rounded-se-none rounded-es-xl rounded-ee-xl",
        (type === "normal") && "bg-gray-100",
        (type === "info") && "bg-green-100",
        (type === "warning") && "bg-yellow-100",
        (type === "error") && "bg-red-100",
      ) }>
        <div className="flex flex-row items-center justify-between">
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
          <div className="inline-flex justify-center items-center gap-2">
            {
              (editable && !edit && !remove) &&
              <button
                className={ cn(
                  "w-6 h-6 text-gray-900 bg-transparent rounded-lg",
                  (type === "normal") && "hover:bg-gray-300",
                  (type === "info") && "hover:bg-green-300",
                  (type === "warning") && "hover:bg-yellow-300",
                  (type === "error") && "hover:bg-red-300",
                ) }
                onClick={ handleStartEdit }
              >
                <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z"/>
                </svg>
              </button>
            }
            {
              (removable && !edit && !remove) &&
              <button
                className={ cn(
                  "w-6 h-6 text-gray-900 bg-transparent rounded-lg",
                  (type === "normal") && "hover:bg-gray-300",
                  (type === "info") && "hover:bg-green-300",
                  (type === "warning") && "hover:bg-yellow-300",
                  (type === "error") && "hover:bg-red-300",
                ) }
                onClick={ handleStartRemove }
              >
                <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18 17.94 6M18 18 6.06 6"/>
                </svg>
              </button>
            }
            {
              (edit || remove) &&
              <button
                className={ cn(
                  "w-6 h-6 text-red-900 bg-transparent rounded-lg",
                  (type === "normal") && "hover:bg-gray-300",
                  (type === "info") && "hover:bg-green-300",
                  (type === "warning") && "hover:bg-yellow-300",
                  (type === "error") && "hover:bg-red-300",
                ) }
                onClick={ handleCancel }
              >
                <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9h13a5 5 0 0 1 0 10H7M3 9l4-4M3 9l4 4"/>
                </svg>
              </button>
            }
            {
              (edit || remove) &&
              <button
                className={ cn(
                  "w-6 h-6 text-green-900 bg-transparent rounded-lg",
                  (type === "normal") && "hover:bg-gray-300",
                  (type === "info") && "hover:bg-green-300",
                  (type === "warning") && "hover:bg-yellow-300",
                  (type === "error") && "hover:bg-red-300",
                ) }
                onClick={ handleSubmit }
              >
                <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 11.917 9.724 16.5 19 7.5"/>
                </svg>
              </button>
            }
          </div>
        </div>
        <div className="relative">
          <div
            ref={ refs.current.message }
            className={ cn(
              "px-0 py-1 text-sm font-normal bg-transparent",
              (type === "normal") && "text-gray-900",
              (type === "info") && "text-green-900",
              (type === "warning") && "text-yellow-900",
              (type === "error") && "text-red-900",
              (remove) && "line-through text-red-600",
            ) }
          >
            { message }
          </div>
          <textarea
            ref={ refs.current.textarea }
            className={ cn(
              "hidden absolute top-0 left-0 z-50 w-full h-full px-0 py-1 text-sm font-normal border-0 resize-none focus:outline-0 hover:cursor-text",
              (edit) && "block bg-white ring-2",
            ) }
            rows={ 1 }
            defaultValue={ message }
            disabled={ !edit }
            onChange={ handleChangeMessage }
          />
        </div>
      </div>
    </div>
  )
})
