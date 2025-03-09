"use client"
import React, { useCallback, useEffect, useImperativeHandle, useRef, useState } from "react"
import { cn } from "@/app/libs/utils"
import type { FormElement } from "@/app/types/form"

import DropdownFromIcon from "@/app/components/dropdown-form-icon"
import DropdownSelectIcon from "./dropdown-select-icon"
import IconButton from "@/app/components/icon-button"
import type { TableFormat, TableContent } from "@/app/types/table"


type Filter = {
  id: number,
  label: string,
  type: "text" | "dec" | "JPY" | "USD" | "date" | "select",
  from: string,
  to: string,
}

type TableProps = {
  className?: string,
  data?: TableFormat,
  filter?: { [label: string]: "text" | "dec" | "JPY" | "USD" | "date" | "select" }
  label?: string,
  fixed?: boolean,
  maxColSize?: number,
  sticky?: 0 | 1,
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
  replaceValue?: (value: any, label: string, content: TableContent, row: number) => string | number | boolean | React.JSX.Element,
  onRendered?: (value: string) => void,
  onCommand?: (content: TableContent, row: number) => void,
}

export default React.memo(React.forwardRef<FormElement, TableProps>(function Table({
  className = "",
  data = { title: "untitled", labels: ["unlabeled"], contents: [{ unlabeled: "no data" }] },
  filter = {},
  label = "",
  fixed = false,
  maxColSize = undefined,
  sticky = 0,
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
  onRendered = undefined,
  onCommand = undefined,
}, ref){
  const [reload, setReload] = useState(false)

  const refs = useRef({
    table: React.createRef<HTMLTableElement>(),
    forms: [] as Array<React.RefObject<FormElement | null>>,
  })

  const meta = useRef({
    rows: [] as Array<number>,
  })

  const filters = useRef<Array<Filter>>([])

  useImperativeHandle(ref, () => ({
    clear: () => {
      filters.current = []
      refs.current.forms.forEach((form: React.RefObject<FormElement | null>) => {
        form.current?.clear()
      })
      setReload(!reload)
    },
    set: (value?: string, index?: number, subIndex?: number) => {
      if (index !== undefined && index >= 0 && index < data.labels.length && filter[data.labels[index]] !== undefined) {
        const curfil = filters.current.find((filter: Filter) => (filter.id === index))
        const from = (subIndex === 0) ? value || "" : ""
        const to = (subIndex === 1) ? value || "" : ""
        if (curfil === undefined) {
          filters.current.push({
            id: index,
            label: data.labels[index],
            type: filter[data.labels[index]] as "text" | "dec" | "JPY" | "USD" | "date" | "select",
            from: from,
            to: to,
          })
        } else {
          curfil.from = from
          curfil.to = to
        }
        refs.current.forms[index].current?.set(value, subIndex)
        setReload(!reload)
      }
    },
    get: (index?: number, subIndex?: number) => {
      if (index !== undefined && index >= 0 && index < data.labels.length) {
        return refs.current.forms[index].current?.get(subIndex)
      }
      return undefined
    },
  }))

  const handleChangeFilter = useCallback((value: string, _: boolean, title: string, subtitle: string) => {
    const index = Number(title)
    const subIndex = Number(subtitle)

    if (subIndex === 0) {
      const to = refs.current.forms[index].current?.get(1)
      if (value === "" && (to === undefined || to === "")) {
        filters.current = filters.current.filter((filter: Filter) => (filter.id !== index))
      } else {
        const curfil = filters.current.find((filter: Filter) => (filter.id === index))
        if (curfil === undefined) {
          filters.current.push({
            id: index,
            label: data.labels[index],
            type: filter[data.labels[index]] as "text" | "dec" | "JPY" | "USD" | "date" | "select",
            from: value,
            to: to || "",
          })
        } else {
          curfil.from = value
          curfil.to = to || ""
        }
      }
    } else if (subIndex === 1) {
      const from = refs.current.forms[index].current?.get(0)
      if (value === "" && (from === undefined || from === "")) {
        filters.current = filters.current.filter((filter: Filter) => (filter.id !== index))
      } else {
        const curfil = filters.current.find((filter: Filter) => (filter.id === index))
        if (curfil === undefined) {
          filters.current.push({
            id: index,
            label: data.labels[index],
            type: filter[data.labels[index]] as "text" | "dec" | "JPY" | "USD" | "date" | "select",
            from: from || "",
            to: value,
          })
        } else {
          curfil.from = from || ""
          curfil.to = value
        }
      }
    }
    setReload(!reload)
  }, [reload, data, filter])

  const handleChangeSelectFilter = useCallback((value: string, vIndex: number, _: boolean, title: string) => {
    const index = Number(title)

    if (vIndex === -1) {
      filters.current = filters.current.filter((filter: Filter) => (filter.id !== index))
    } else {
      const curfil = filters.current.find((filter: Filter) => (filter.id === index))
      if (curfil === undefined) {
        filters.current.push({
          id: index,
          label: data.labels[index],
          type: "select",
          from: value,
          to: "",
        })
      } else {
        curfil.from = value
        curfil.to = ""
      }
    }
    setReload(!reload)
  }, [reload, data])

  const handleCommand = useCallback((title: string) => {
    const index = Number(title)
    if (onCommand) {
      onCommand(data.contents[index], index)
    }
  }, [data, onCommand])

  const applyFilterRow = (content: TableContent) => {
    return data.labels.map((label: string, index: number) => {
      const curfil = filters.current.find((filter: Filter) => (filter.id === index))
      if (curfil) {
        if (curfil.type === "text" || curfil.type === "select") {
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

  const initializeRefs = useCallback(() => {
    for (let i = 0; i < data.labels.length - refs.current.forms.length; i++) {
      refs.current.forms.push(React.createRef<FormElement>())
    }
    return null
  }, [data])

  useEffect(() => {
    if (fixed) {
      if (refs.current.table.current) {
        refs.current.table.current.style.tableLayout = "auto"
        data.labels.forEach((_: string, index: number) => {
          const element = document.getElementById(`${ data.title }_col_${ index }`)
          if (element) {
            let width = element.offsetWidth || 200
            if (maxColSize !== undefined) {
              if (width > maxColSize) {
                width = maxColSize
              }
            }
            element.style.width = String(width) + "px"
          }
        })
        if (commandable){
          const element = document.getElementById(`${ data.title }_col_command`)
          if (element) {
            const width = element.offsetWidth || 50
            element.style.width = String(width) + "px"
          }
        }
        refs.current.table.current.style.tableLayout = "fixed"
      }
    }
  }, [data, fixed, maxColSize, commandable, filterCol])

  useEffect(() => {
    if (onRendered) {
      onRendered(meta.current.rows.join("_"))
    }
  })

  return (
    <div className={ cn(
      "w-full h-full overflow-x-auto overflow-y-auto",
      className,
    ) }
    >
      <table ref={ refs.current.table } className="w-full min-h-32 text-sm text-left text-nowrap text-gray-900">
        <thead className={ cn(
          "sticky top-0 z-10 text-xs text-white bg-gray-800",
          (alignLabel === "left") && "text-left",
          (alignLabel === "center") && "text-center",
          (alignLabel === "right") && "text-right",
        ) }>
          <tr>
            {
              // sticky col
              data.labels
              .filter((label: string) => (filterCol(label)))
              .slice(0, sticky)
              .map((label: string, index: number) => (
                <th key={ index } id={ `${ data.title }_col_0` } scope="col" className="sticky left-0 z-0 px-4 py-3 bg-gray-800">
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
              .map((label: string) => {
                const index = data.labels.indexOf(label)
                return (
                  <th key={ index } id={ `${ data.title }_col_${ index }` } scope="col" className="px-4 py-3">
                    <div className="inline-flex items-center">
                      { initializeRefs() }
                      { replaceLabel(label) }
                      {
                        (filter[label] === "text" || filter[label] === "dec" || filter[label] === "JPY" || filter[label] === "USD" || filter[label] === "date") &&
                        <DropdownFromIcon
                          ref={ refs.current.forms[index] }
                          className="ms-2"
                          title={ String(index) }
                          color="white"
                          type={ filter[label] }
                          applying={ !!filters.current.find((filter: Filter) => (filter.id === index)) }
                          onChange={ handleChangeFilter }
                        />
                      }
                      {
                        (filter[label] === "select") &&
                        <DropdownSelectIcon
                          ref={ refs.current.forms[index] }
                          className="ms-2"
                          title={ String(index) }
                          color="white"
                          options={ [...new Set(data.contents.filter((content: TableContent) => (typeof content[label] === "string")).map((content: TableContent) => (content[label])))] }
                          applying={ !!filters.current.find((filter: Filter) => (filter.id === index)) }
                          onChange={ handleChangeSelectFilter }
                        />
                      }
                    </div>
                  </th>
                )
              })
            }
            {
              commandable &&
              <th scope="col" id={ `${ data.title }_col_command` } className="sticky right-0 z-0 px-4 py-3 bg-gray-800">
              </th>
            }
          </tr>
        </thead>
        {
          data.contents.map((content: TableContent, row: number) => {
            if (row === 0) {
              meta.current.rows = []
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

            meta.current.rows.push(row)

            return (
              <tbody key={ row }>
                <tr
                  className={ cn(
                    "text-nowrap border-b border-gray-800",
                    (highlight === "none") && "bg-white hover:bg-gray-200",
                    (highlight === "info") && "bg-green-100 hover:bg-green-200",
                    (highlight === "warning") && "bg-yellow-100 hover:bg-yellow-200",
                    (highlight === "error") && "bg-red-100 hover:bg-red-200",
                    (highlight === "blind") && "bg-gray-300 hover:bg-gray-400",
                  ) }
                  title={ String(data.contents[row][label]) }
                >
                  {
                    // sticky cols
                    data.labels
                    // filter cols
                    .filter((label: string) => (filterCol(label)))
                    .slice(0, sticky)
                    .map((label: string, col: number) => (
                      <td key={ col } scope="col" className="sticky left-0 z-0 px-4 py-3 text-white bg-gray-800">
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
                      <td key={ col + sticky } scope="col" className="px-4 py-3">
                        {
                          (() => {
                            // replace value
                            const value = replaceValue(content[label], label, content, row)
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
                        color="black"
                        bgcolor="white"
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
}))
