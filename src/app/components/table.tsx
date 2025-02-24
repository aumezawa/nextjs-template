"use client"
import React, { useCallback, useRef, useState } from "react"
import { cn } from "@/app/libs/utils"

import Chackbox from "@/app/components/checkbox"
import DropdownFromIcon from "@/app/components/dropdown-form-icon"
import IconButton from "@/app/components/icon-button"
import type { TableFormat, TableContent } from "@/app/types/table"
import DropdownSelectIcon from "./dropdown-select-icon"


type Filter = {
  label: string,
  type: "text" | "dec" | "JPY" | "USD" | "date",
  from: string,
  to: string,
}

type TableProps = {
  className?: string,
  data?: TableFormat,
  filter?: { [label: string]: "text" | "dec" | "JPY" | "USD" | "date" | "select" }
  label?: string,
  sticky?: 0 | 1,
  checkable?: boolean,
  commandable?: boolean,
  linkable?: boolean,
  linkIcon?: boolean,
  alignLabel?: "left" | "center" | "right",
  alignNumber?: "left" | "center" | "right",
  highlightRow?: (content: TableContent, row: number) => "none" | "info" | "warning" | "error" | "blind",
  filterCol?: (label: string) => boolean,
  filterRow?: (content: TableContent, row: number) => boolean,
  replaceLabel?: (label: string) => string,
  /* eslint-disable-next-line */
  replaceValue?: (value: any, label: string, row: number) => string | number | boolean | React.JSX.Element,
  onChecked?: (value: Array<string>) => void,
  onCommand?: (row: number) => void,
}

export default React.memo<TableProps>(function Table({
  className = "",
  data = { title: "untitled", labels: ["unlabeled"], contents: [{ unlabeled: "no data" }] },
  filter = {},
  sticky = 0,
  label = "",
  checkable = false,
  commandable = false,
  linkable = false,
  linkIcon = false,
  alignLabel = "left",
  alignNumber = "right",
  highlightRow = () => "none",
  filterCol = () => true,
  filterRow = () => true,
  replaceLabel = (label: string) => (label),
  replaceValue = (value: string | number | boolean) => (value),
  onChecked = undefined,
  onCommand = undefined,
}){
  const [checked, setChecked] = useState<Array<string>>([])
  const [reload, setReload] = useState(false)

  const refs = useRef({
    head: React.createRef<HTMLInputElement>(),
    body: ([] as Array<React.RefObject<HTMLInputElement | null>>),
  })

  const filters = useRef<Array<Filter>>([])

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

  const handleChangeFilter = useCallback((values: string[], _: boolean, title: string) => {
    if (values[0] === "" && values[1] === "") {
      filters.current = filters.current.filter((filter: Filter) => (filter.label !== title))
    } else {
      const curfil = filters.current.find((filter: Filter) => (filter.label === title))
      if (curfil === undefined) {
        filters.current.push({
          label: title,
          type: filter[title] as "text" | "dec" | "JPY" | "USD" | "date",
          from: values[0],
          to: values[1],
        })
      } else {
        curfil.from = values[0]
        curfil.to = values[1]
      }
    }
    setReload(!reload)
  }, [reload, filter])

  const handleChangeSelectFilter = useCallback((value: string, index: number, _: boolean, title: string) => {
    console.log(value, index, title)
    if (index === -1) {
      filters.current = filters.current.filter((filter: Filter) => (filter.label !== title))
    } else {
      const curfil = filters.current.find((filter: Filter) => (filter.label === title))
      if (curfil === undefined) {
        filters.current.push({
          label: title,
          type: "text",
          from: value,
          to: "",
        })
      } else {
        curfil.from = value
        curfil.to = ""
      }
    }
    setReload(!reload)
  }, [reload])

  const handleCommand = useCallback((title: string) => {
    if (onCommand) {
      onCommand(Number(title))
    }
  }, [onCommand])

  const applyFilterRow = (content: TableContent) => {
    return data.labels.map((label: string) => {
      const curfil = filters.current.find((filter: Filter) => (filter.label === label))
      if (curfil) {
        if (curfil.type === "text") {
          if (typeof content[label] !== "string") {
            return false
          } else {
            return content[label].includes(curfil.from)
          }
        } else if (curfil.type === "dec" || curfil.type === "JPY" || curfil.type === "USD") {
          if (typeof content[label] !== "string" || isNaN(Number(content[label]))) {
            return false
          }
          if (curfil.from !== "" && (Number(content[label].replaceAll(",", "").replace("¥", "").replace("$", "")) < Number(curfil.from.replace(",", "").replace("¥", "").replace("$", "")))) {
            return false
          }
          if (curfil.to !== "" && Number(content[label].replaceAll(",", "").replace("¥", "").replace("$", "")) > Number(curfil.to.replace(",", "").replace("¥", "").replace("$", ""))) {
            return false
          }
        } else if (curfil.type === "date") {
          const at = new Date(content[label])
          const from = new Date(curfil.from)
          const to = new Date(curfil.to)
          if (at.toString() === "Invalid Date") {
            return false
          }
          if (from.toString() !== "Invalid Date" && at < from) {
            return false
          }
          if (to.toString() !== "Invalid Date" && at > to) {
            return false
          }
        }
      }
      return true
    }).reduce((acc: boolean, cur: boolean) => (acc && cur))
  }

  return (
    <div className={ cn(
      "w-full h-full overflow-x-auto overflow-y-auto",
      className,
    ) }
    >
      <table className="w-full min-h-32 text-sm text-left text-nowrap text-gray-600">
        <thead className={ cn(
          "sticky top-0 z-10 text-xs uppercase text-gray-800 bg-gray-100",
          (alignLabel === "left") && "text-left",
          (alignLabel === "center") && "text-center",
          (alignLabel === "right") && "text-right",
        ) }>
          <tr>
            {
              checkable && (sticky === 0) &&
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
                  <div className="inline-flex items-center">
                  { replaceLabel(label) }
                  {
                    (filter[label] === "text" || filter[label] === "dec" || filter[label] === "JPY" || filter[label] === "USD" || filter[label] === "date") &&
                    <DropdownFromIcon
                      className="ms-2"
                      title={ label }
                      type={ filter[label] }
                      applying={ filters.current.map((filter: Filter) => (filter.label)).includes(label) }
                      onChange={ handleChangeFilter }
                    />
                  }
                  {
                    (filter[label] === "select") &&
                    <DropdownSelectIcon
                      className="ms-2"
                      title={ label }
                      options={ [...new Set(data.contents.filter((content: TableContent) => (typeof content[label] === "string")).map((content: TableContent) => (content[label])))] }
                      applying={ filters.current.map((filter: Filter) => (filter.label)).includes(label) }
                      onChange={ handleChangeSelectFilter }
                    />
                  }
                  </div>
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
            if (!applyFilterRow(content) || !filterRow(content, row)) {
              return (
                <tbody key={ row }>
                </tbody>
              )
            }

            // highlight
            const highlight = highlightRow(content, row)

            return (
              <tbody key={ row }>
                <tr
                  className={ cn(
                    "text-nowrap border-b",
                    (highlight === "none") && "bg-white hover:bg-gray-100",
                    (highlight === "none" && (checked.includes(String(row)))) && "bg-blue-100 hover:bg-blue-200",
                    (highlight === "info") && "bg-green-100 hover:bg-green-200",
                    (highlight === "info" && (checked.includes(String(row)))) && "bg-green-200 hover:bg-green-300",
                    (highlight === "warning") && "bg-yellow-100 hover:bg-yellow-200",
                    (highlight === "warning" && (checked.includes(String(row)))) && "bg-yellow-200 hover:bg-yellow-300",
                    (highlight === "error") && "bg-red-100 hover:bg-red-200",
                    (highlight === "error" && (checked.includes(String(row)))) && "bg-red-200 hover:bg-red-300",
                    (highlight === "blind") && "bg-gray-300 hover:bg-gray-400",
                    (highlight === "blind" && (checked.includes(String(row)))) && "bg-gray-400 hover:bg-gray-500",
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