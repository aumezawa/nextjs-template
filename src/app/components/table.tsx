"use client"
import React, { useCallback, useRef, useState } from "react"
import { cn } from "@/app/libs/utils"

import Chackbox from "@/app/components/checkbox"
import IconButtun from "@/app/components/icon-buttun"
import { Table, TableContent } from "@/app/types/table"


type TableProps = {
  className?: string,
  data: Table,
  checkable?: boolean,
  commandable?: boolean,
  onChecked?: (value: Array<string>) => void,
  onCommand?: (value: string) => void,
}

export default React.memo<TableProps>(function Table({
  className = "",
  data = undefined,
  checkable = false,
  commandable = false,
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
        if (updated.length === data?.contents.length) {
          if (refs.current.head.current) {
            refs.current.head.current.checked = value
          }
        }
      } else {
        updated = checked.filter((v: string) => (v !== title))
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
      "relative overflow-x-auto overflow-y-auto shadow-md",
      className,
    ) }
    >
      <table className="text-sm text-left text-gray-500">
        <thead className="sticky top-0 text-xs uppercase text-gray-700 bg-gray-50">
          <tr>
            {
              checkable &&
              <th scope="col" className="p-4">
                <div className="flex items-center">
                  <Chackbox ref={ refs.current.head } title="header" onChange={ handleChecked }/>
                </div>
              </th>
            }
            {
              data?.labels.map((label: string, index: number) => (
                <th key={ index } scope="col" className="px-6 py-3">
                  { label }
                </th>
              ))
            }
            {
              commandable &&
              <th scope="col" className="px-6 py-3">
              </th>
            }
          </tr>
        </thead>
        {
          data?.contents.map((content: TableContent, row: number) => {
            if (row > refs.current.body.length - 1) {
              refs.current.body.push(React.createRef<HTMLInputElement>())
            }
            if (row === refs.current.body.length - 1) {
              refs.current.body = refs.current.body.slice(0, refs.current.body.length)
            }

            return (
              <tbody key={ row }>
                <tr className={ cn(
                  "bg-white border-b hover:bg-blue-100",
                  (checked.includes(String(row))) && "bg-green-100 hover:bg-green-200",
                ) }>
                  {
                    checkable &&
                    <td className="w-4 p-4">
                      <div className="flex items-center">
                        <Chackbox ref={ refs.current.body[row] } title={ String(row) } onChange={ handleChecked }/>
                      </div>
                    </td>
                  }
                  {
                    data?.labels.map((label: string, col: number) => (
                      <td key={ col } scope="col" className="px-6 py-4">
                        { content[label] }
                      </td>
                    ))
                  }
                  {
                    commandable &&
                    <td className="w-2 p-2">
                      <div className="flex items-center">
                        <IconButtun className="m-2 p-2" title={ String(row) } icon="edit" onClick={ handleCommand }/>
                      </div>
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