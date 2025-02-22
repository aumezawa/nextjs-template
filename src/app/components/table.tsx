"use client"
import React, { useCallback, useRef, useState } from "react"
import { cn } from "@/app/libs/utils"

import Chackbox from "@/app/components/checkbox"
import IconButton from "@/app/components/icon-button"
import type { TableFormat, TableContent } from "@/app/types/table"


type TableProps = {
  className?: string,
  data?: TableFormat,
  label?: string,
  sticky?: 0 | 1,
  checkable?: boolean,
  commandable?: boolean,
  linkable?: boolean,
  linkIcon?: boolean,
  alignLabel?: "left" | "center" | "right",
  alignNumber?: "left" | "center" | "right",
  highlight?: (value: string | number | boolean, label: string, row: number) => "none" | "info" | "warning" | "error" | "blind",
  filterCol?: (label: string) => boolean,
  filterRow?: (value: string | number | boolean, label: string, row: number) => boolean,
  replaceLabel?: (label: string) => string,
  replaceValue?: (value: string | number | boolean, label: string, row: number) => string | number | boolean | React.JSX.Element,
  onChecked?: (value: Array<string>) => void,
  onCommand?: (row: number) => void,
}

export default React.memo<TableProps>(function Table({
  className = "",
  data = { title: "untitled", labels: ["unlabeled"], contents: [{ unlabeled: "no data" }] },
  sticky = 0,
  label = "",
  checkable = false,
  commandable = false,
  linkable = false,
  linkIcon = false,
  alignLabel = "left",
  alignNumber = "right",
  highlight = () => ("none"),
  filterCol = () => (true),
  filterRow = () => (true),
  replaceLabel = (label: string) => (label),
  replaceValue = (value: string | number | boolean) => (value),
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
        updated = refs.current.body.map((_: React.RefObject<HTMLInputElement | null>, index: number) => String(index))
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
      onCommand(Number(title))
    }
  }, [onCommand])

  return (
    <div className={ cn(
      "w-full h-full overflow-x-auto overflow-y-auto",
      className,
    ) }
    >
      <table className="w-full text-sm text-left text-nowrap text-gray-600">
        <thead className={ cn(
          "sticky top-0 z-10 text-xs uppercase text-gray-800 bg-gray-100",
          (alignLabel === "left") && "text-left",
          (alignLabel === "center") && "text-center",
          (alignLabel === "right") && "text-right",
        ) }>
          <tr>
            {
              checkable && !sticky &&
              <th scope="col" className="sticky left-0 z-0 px-3 py-3 bg-gray-100">
                <Chackbox
                  ref={ refs.current.head }
                  className="m-0"
                  title="header"
                  label=""
                  onChange={ handleChecked }
                />
              </th>
            }
            {
              // sticky col
              data.labels
              .filter((label: string) => (filterCol(label)))
              .slice(0, sticky)
              .map((label: string, index: number) => (
                <th key={ index } scope="col" className="sticky left-0 z-0 px-6 py-3 bg-gray-100">
                  { replaceLabel(label) }
                </th>
              ))
            }
            {
              // non-sticky cols
              data.labels
              // filter cols
              .filter((label: string) => (filterCol(label)))
              .slice(sticky)
              .map((label: string, index: number) => (
                <th key={ index + sticky } scope="col" className="px-6 py-3">
                  { replaceLabel(label) }
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

            // filter rows
            if (
              !data.labels
              .map((label: string) => (filterRow(content[label], label, row)))
              .reduce((acc: boolean, cur: boolean) => (acc || cur))
            ) {
              return (
                <tbody key={ row }>
                </tbody>
              )
            }

            // highlight
            const type = data.labels
              .map((label: string) => (highlight(content[label], label, row)))
              .reduce((acc: string, cur: string) => {
                if (acc === "blind" || cur === "blind") {
                  return "blind"
                } else if (acc === "error" || cur === "error") {
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
                <tr
                  className={ cn(
                    "text-nowrap border-b",
                    (type === "none") && "bg-white hover:bg-gray-100",
                    (type === "none" && (checked.includes(String(row)))) && "bg-blue-100 hover:bg-blue-200",
                    (type === "info") && "bg-green-100 hover:bg-green-200",
                    (type === "info" && (checked.includes(String(row)))) && "bg-green-200 hover:bg-green-300",
                    (type === "warning") && "bg-yellow-100 hover:bg-yellow-200",
                    (type === "warning" && (checked.includes(String(row)))) && "bg-yellow-200 hover:bg-yellow-300",
                    (type === "error") && "bg-red-100 hover:bg-red-200",
                    (type === "error" && (checked.includes(String(row)))) && "bg-red-200 hover:bg-red-300",
                    (type === "blind") && "bg-gray-300 hover:bg-gray-400",
                    (type === "blind" && (checked.includes(String(row)))) && "bg-gray-400 hover:bg-gray-500",
                  ) }
                  title={ String(data.contents[row][label]) }
                >
                  {
                    checkable && !sticky &&
                    <td className="sticky left-0 z-0 px-3 py-3">
                      <Chackbox
                        ref={ refs.current.body[row] }
                        className="m-0"
                        title={ String(row) }
                        label=""
                        onChange={ handleChecked }
                      />
                    </td>
                  }
                  {
                    // sticky cols
                    data.labels
                    // filter cols
                    .filter((label: string) => (filterCol(label)))
                    .slice(0, sticky)
                    .map((label: string, col: number) => (
                      <td key={ col } scope="col" className="sticky left-0 z-0 px-6 py-3 bg-gray-100">
                        { content[label] }
                      </td>
                    ))
                  }
                  {
                    // non-sticky cols
                    data.labels
                    // filter cols
                    .filter((label: string) => (filterCol(label)))
                    .slice(sticky)
                    .map((label: string, col: number) => (
                      <td key={ col + sticky } scope="col" className="px-6 py-3">
                        {
                          (() => {
                            // replace value
                            const value = replaceValue(content[label], label, row)
                            if (value === undefined) {
                              return ""
                            }
                            if (value === true) {
                              return (
                                <svg className="w-6 h-6 mx-auto text-green-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 11.917 9.724 16.5 19 7.5"/>
                                </svg>
                              )
                            }
                            if (value === false) {
                              return (
                                <svg className="w-6 h-6 mx-auto text-red-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14"/>
                                </svg>
                              )
                            }
                            if (typeof value === "number") {
                              return (
                                <p className={ cn(
                                  (alignNumber === "left") && "text-left",
                                  (alignNumber === "center") && "text-center",
                                  (alignNumber === "right") && "text-right",
                                ) }>
                                  { value }
                                </p>
                              )
                            }
                            if (linkable && (typeof value === "string") && (value.startsWith("http://") || value.startsWith("https://"))) {
                              return (
                                <a className="text-blue-600 hover:text-blue-800 hover:underline" href={ value } title={ value } target="_blank">
                                  {
                                    (() => {
                                      if (linkIcon) {
                                        return (
                                          <svg className="w-6 h-6 mx-auto" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                            <path fillRule="evenodd" d="M8 5a1 1 0 0 1 1-1h11a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-1a1 1 0 1 1 0-2h1V6H9a1 1 0 0 1-1-1Z" clipRule="evenodd"/>
                                            <path fillRule="evenodd" d="M4 7a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2H4Zm0 11v-5.5h11V18H4Z" clipRule="evenodd"/>
                                          </svg>
                                        )
                                      } else {
                                        return value
                                      }
                                    })()
                                  }
                                </a>
                              )
                            }
                            return value
                          })()
                        }
                      </td>
                    ))
                  }
                  {
                    commandable &&
                    <td className="sticky right-0 z-0 px-2 py-2">
                      <IconButton
                        className="m-0 p-1"
                        title={ String(row) }
                        color="light"
                        label="edit"
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