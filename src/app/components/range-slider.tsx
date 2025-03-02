"use client"
import React, { useCallback, useImperativeHandle, useRef, useState } from "react"
import { v4 as uuid } from "uuid"
import { cn } from "@/app/libs/utils"
import type { FormElement } from "@/app/types/form"


type RangeSliderParams = {
  type: "dec" | "date",
  value: number,
  start: number,
  end: number,
  startLabel: string,
  centerLabel: string,
  endLabel: string,
}

type RangeSliderProps = {
  id?: string,
  className?: string,
  type?: "dec" | "date",
  title?: string,
  subtitle?: string,
  size?: "auto" | "xs" | "sm" | "md" | "lg" | "xl" | "full",
  label?: string,
  disabled?: boolean,
  start?: number | string,
  end?: number | string,
  step?: number,
  defaultValue?: number | string,
  startLabel?: string,
  centerLabel?: string,
  endLabel?: string,
  replace?: (label: string, type: string, value: number) => number | string,
  onChange?: (type: string, value: number | string, index: number, title: string, subtitle: string) => void,
}

export default React.memo(React.forwardRef<FormElement, RangeSliderProps>(function RangeSlider({
  id = undefined,
  className = "",
  type = "dec",
  title = "",
  subtitle = "",
  size = "auto",
  label = "undefined",
  disabled = false,
  start = 0,
  end = 100,
  step = 1,
  defaultValue = undefined,
  startLabel = undefined,
  centerLabel = undefined,
  endLabel = undefined,
  replace = (label: string | undefined, type: string, value: number) => {
    if (label === undefined || label === "") {
      return ""
    }
    if (type === "date") {
      const offset = +9 * 60 * 60 * 1000  /* only JST supported */
      const date = new Date()
      date.setTime(value * 86400000 + offset)
      return `${ label }, current: ${ date.toISOString().slice(5, 10).replace("-", "/") }`
    }
    return `${ label }, current: ${ value }`
  },
  onChange = undefined,
}, ref) {
  const [reload, setReload] = useState(false)

  const refs = useRef({
    input: React.createRef<HTMLInputElement>(),
    bar: React.createRef<HTMLDivElement>(),
  })

  const data = useRef({
    id: id || uuid(),
  })

  useImperativeHandle(ref, () => ({
    clear: () => {},
    set: (value?: string) => {
      if (value) {
        if (param.current.type === "dec") {
          if (Number(value) >= param.current.start && Number(value) <= param.current.end) {
            param.current.value = Number(value)
            if (refs.current.input.current) {
              refs.current.input.current.value = String(param.current.value)
            }
          }
        } else if (param.current.type === "date") {
          const baseDate = new Date("2001-01-01")
          const valueDate = new Date(value)
          if (valueDate.toString() !== "Invalid Date") {
            const tmpValue = (valueDate.getTime() - baseDate.getTime()) / 86400000
            if (tmpValue >= param.current.start && tmpValue <= param.current.end) {
              param.current.value = tmpValue
              if (refs.current.input.current) {
                refs.current.input.current.value = String(param.current.value)
              }
            }
          }
        }
        setReload(!reload)
      }
    },
    get: () => {
      return refs.current.input.current?.value
    },
  }))

  const validateUserInput = useCallback(() => {
    let tmpType: "dec" | "date" = "dec"
    let tmpStartNum = 0
    let tmpEndNum = 100
    let tmpValue = 50

    const centerValue = (start: number, end: number, round: boolean = false) => {
      if (round) {
        return Math.round((end - start) / 2 + start)
      } else {
        return (end - start) / 2 + start
      }
    }

    const valueInRange = (value: number, start: number, end: number, round: boolean = false) => {
      if (start <= value && value <= end) {
        return value
      } else {
        return centerValue(start, end, round)
      }
    }

    const valueOnStep = (value: number, start: number, step: number) => {
      if ((value - start) % step === 0) {
        return value
      } else {
        return value - ((value - start) % step)
      }
    }

    const setLabel = (type: string, value: number, defaultLabel: string | undefined) => {
      if (defaultLabel === undefined) {
        if (type === "date") {
          const offset = +9 * 60 * 60 * 1000  /* only JST supported */
          const date = new Date()
          date.setTime(value * 86400000 + offset)
          return date.toISOString().slice(5, 10).replace("-", "/")
        } else {
          return String(value)
        }
      }
      return defaultLabel
    }

    if (type === "date") {
      if (typeof start === "string" && typeof end === "string") {
        const baseDate = new Date("2001-01-01")
        const startDate = new Date(start)
        const endDate = new Date(end)
        if (startDate.toString() !== "Invalid Date" && endDate.toString() !== "Invalid Date") {
          tmpType = "date"
          if (startDate <= endDate) {
            tmpStartNum = (startDate.getTime() - baseDate.getTime()) / 86400000
            tmpEndNum = (endDate.getTime() - baseDate.getTime()) / 86400000
          } else {
            tmpStartNum = (endDate.getTime() - baseDate.getTime()) / 86400000
            tmpEndNum = (startDate.getTime() - baseDate.getTime()) / 86400000
          }

          if (typeof defaultValue === "string") {
            const valueDate = new Date(defaultValue)
            if (valueDate.toString() !== "Invalid Date") {
              tmpValue = (valueDate.getTime() - baseDate.getTime()) / 86400000
            }
          }
        }
      }
    } else if (type === "dec") {
      if (typeof start === "number" && typeof end === "number") {
        if (start <= end) {
          tmpStartNum = start
          tmpEndNum = end
        } else {
          tmpStartNum = end
          tmpEndNum = start
        }

        if (typeof defaultValue === "number") {
          tmpValue = defaultValue
        }
      }
    }

    return ({
      type: tmpType,
      value: valueOnStep(valueInRange(tmpValue, tmpStartNum, tmpEndNum, true), tmpStartNum, step),
      start: tmpStartNum,
      end: tmpEndNum,
      startLabel: setLabel(tmpType, tmpStartNum, startLabel),
      centerLabel: setLabel(tmpType, centerValue(tmpStartNum, tmpEndNum), centerLabel),
      endLabel: setLabel(tmpType, tmpEndNum, endLabel),
    })
  }, [type, start, end, step, defaultValue, startLabel, centerLabel, endLabel])

  const param = useRef<RangeSliderParams>(validateUserInput())

  const calcBarLeft = useCallback(() => {
    return 0
  }, [])

  const calcBarWidth = useCallback(() => {
    return (param.current.value - param.current.start) / (param.current.end - param.current.start) * 100
  }, [])

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    param.current.value = Number(e.currentTarget.value)
    if (onChange) {
      if (param.current.type === "date") {
        const offset = +9 * 60 * 60 * 1000  /* only JST supported */
        const date = new Date()
        date.setTime(param.current.value * 86400000 + offset)
        onChange(param.current.type, date.toISOString().slice(5, 10).replace("-", "/"), param.current.value - param.current.start, title, subtitle)
      } else {
        onChange(param.current.type, param.current.value, param.current.value - param.current.start, title, subtitle)
      }
    }
    setReload(!reload)
  }, [reload, title, subtitle, onChange])

  return (
    <div className={ cn(
      "relative mb-2",
      (size === "xs") && "w-full max-w-xs mx-auto",
      (size === "sm") && "w-full max-w-sm mx-auto",
      (size === "md") && "w-full max-w-md mx-auto",
      (size === "lg") && "w-full max-w-lg mx-auto",
      (size === "xl") && "w-full max-w-xl mx-auto",
      (size === "full") && "w-full",
      className,
    ) }>
      <label
        htmlFor={ data.current.id }
        className={ cn(
          "block mb-4 text-sm font-medium text-gray-900",
          (disabled) && "text-gray-400",
        ) }
        suppressHydrationWarning
      >
        { replace(label, param.current.type, param.current.value) }
      </label>
      <div className="w-full h-2 mb-2 bg-gray-200 rounded-lg">
      </div>
      <div
        ref={ refs.current.bar }
        className="absolute top-9 h-2 z-5 bg-green-300 rounded-lg"
        style={ {
          left: calcBarLeft().toString() + "%",
          width: calcBarWidth().toString() + "%",
        } }
      >
      </div>
      <input
        ref={ refs.current.input }
        id={ data.current.id }
        type="range"
        className="absolute top-10 left-0 w-full h-0 z-6 accent-blue-600 pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:p-2.5"
        disabled={ disabled }
        min={ String(param.current.start) }
        max={ String(param.current.end) }
        step={ String(step) }
        defaultValue={ String(param.current.value) }
        onChange={ handleChange }
        suppressHydrationWarning
      />
      <div className="grid grid-cols-3">
        <span className="text-start text-sm text-gray-500">
          { param.current.startLabel }
        </span>
        <span className="text-center text-sm text-gray-500">
          { param.current.centerLabel }
        </span>
        <span className="text-end text-sm text-gray-500">
          { param.current.endLabel }
        </span>
      </div>
    </div>
  )
}))
