"use client"
import React, { useCallback, useRef, useState } from "react"
import { cn } from "@/app/libs/utils"

import Chackbox from "@/app/components/checkbox"
import IconButtun from "@/app/components/icon-button"
import type { TableFormat, TableContent } from "@/app/types/table"


type TableProps = {
  className?: string,
  data?: TableFormat,
  checkable?: boolean,
  commandable?: boolean,
  filter?: (key: string, value: string) => boolean,
  remind?: (ket: string, value: string) => "none" | "info" | "warning" | "error",
  onChecked?: (value: Array<string>) => void,
  onCommand?: (title: string) => void,
}

export default React.memo<TableProps>(function Table({
  className = "",
  data = { title: "untitled", labels: ["unlabeled"], contents: [{ unlabeled: "no data" }] },
  checkable = false,
  commandable = false,
  filter = (_key: string, _value: string) => true,
  remind = (_key: string, _value: string) => "none",
  onChecked = undefined,
  onCommand = undefined,
}){
  const [checked, setChecked] = useState<Array<string>>([])

  const refs = useRef({
    head: React.createRef<HTMLInputElement>(),
    body: ([] as Array<React.RefObject<HTMLInputElement | null>>),
  })

  const handleChecked = useCallback((value: boolean, title: string) => {
    let updated: Array<string> = []

    if (title === "header") {
      if (value) {
        updated = refs.current.body.map((_: React.RefObject<HTMLInputElement | null>, index: number) => (String(index)))
      } else {
        updated = []
      }
      refs.current.body.forEach((ref: React.RefObject<HTMLInputElement | null>) => {
        if (ref.current) {
          ref.current.checked = value
        }
      })
    } else {
      if (value) {
        updated = [...checked, title].sort()
        if (updated.length === data.contents.length) {
          if (refs.current.head.current) {
            refs.current.head.current.checked = value
          }
        }
      } else {
        updated = checked.filter((row: string) => (row !== title))
        if (refs.current.head.current) {
          refs.current.head.current.checked = value
        }
      }
    }
    if (onChecked) {
      onChecked(updated)
    }
    setChecked(updated)
  }, [checked, data, onChecked])

  const handleCommand = useCallback((title: string) => {
    if (onCommand) {
      onCommand(title)
    }
  }, [onCommand])

  return (
    <div className={ cn(
      "w-full h-full overflow-x-auto overflow-y-auto",
      className,
    ) }
    >
      <table className="w-full text-sm text-left text-gray-600">
        <thead className="sticky top-0 z-10 text-xs uppercase text-nowrap text-gray-800 bg-gray-100">
          <tr>
            {
              checkable &&
              <th scope="col" className="sticky left-0 z-0 px-3 py-3 bg-gray-100">
                <Chackbox
                  ref={ refs.current.head }
                  className="m-0"
                  title="header"
                  onChange={ handleChecked }
                />
              </th>
            }
            {
              data.labels.map((label: string, index: number) => (
                <th key={ index } scope="col" className="px-6 py-3">
                  { label }
                </th>
              ))
            }
            {
              commandable &&
              <th scope="col" className="sticky right-0 z-0 px-6 py-3 bg-gray-100">
              </th>
            }
          </tr>
        </thead>
        {
          data.contents.map((content: TableContent, row: number) => {
            // recreating refs
            if (row > refs.current.body.length - 1) {
              refs.current.body.push(React.createRef<HTMLInputElement>())
            }
            if (row === refs.current.body.length - 1) {
              refs.current.body = refs.current.body.slice(0, refs.current.body.length)
            }

            // filter
            if (
              !data.labels
              .map((label: string) => (filter(label, content[label] || "")))
              .reduce((acc: boolean, cur: boolean) => (acc || cur))
            ) {
              return (
                <tbody key={ row }>
                </tbody>
              )
            }

            // remind
            const type = data.labels
              .map((label: string) => (remind(label, content[label] || "none")))
              .reduce((acc: string, cur: string) => {
                if (acc === "error" || cur === "error") {
                  return "error"
                } else if (acc === "warning" || cur === "warning") {
                  return "warning"
                } else if (acc === "info" || cur === "info") {
                  return "info"
                } else {
                  return "none"
                }
              })

            return (
              <tbody key={ row }>
                <tr className={ cn(
                  "text-nowrap bg-white hover:bg-gray-100 border-b",
                  (type === "none" && (checked.includes(String(row)))) && "bg-blue-100 hover:bg-blue-200",
                  (type === "info") && "bg-green-100 hover:bg-green-200",
                  (type === "info" && (checked.includes(String(row)))) && "bg-green-200 hover:bg-green-300",
                  (type === "warning") && "bg-yellow-100 hover:bg-yellow-200",
                  (type === "warning" && (checked.includes(String(row)))) && "bg-yellow-200 hover:bg-yellow-300",
                  (type === "error") && "bg-red-100 hover:bg-red-200",
                  (type === "error" && (checked.includes(String(row)))) && "bg-red-200 hover:bg-red-300",
                ) }>
                  {
                    checkable &&
                    <td className="sticky left-0 z-0 px-3 py-3">
                      <Chackbox
                        ref={ refs.current.body[row] }
                        className="m-0"
                        title={ String(row) }
                        onChange={ handleChecked }
                      />
                    </td>
                  }
                  {
                    data.labels.map((label: string, col: number) => (
                      <td key={ col } scope="col" className="px-6 py-3">
                        { content[label] }
                      </td>
                    ))
                  }
                  {
                    commandable &&
                    <td className="sticky right-0 z-0 px-2 py-2">
                      <IconButtun
                        className="m-0 p-1"
                        title={ String(row) }
                        icon="edit"
                        onClick={ handleCommand }
                      />
                    </td>
                  }
                </tr>
              </tbody>
            )
          })
        }
      </table>
    </div>
  )
})