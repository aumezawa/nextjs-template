"use client"
import React, { useCallback, useRef, useState } from "react"
import { v4 as uuid } from "uuid"
import { cn } from "@/app/libs/utils"


type RangeSliderParams = {
  type: string,
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
  type?: "number" | "date",
  title?: string,
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
  onChange?: (type: string, value: number | string, index: number, title: string) => void,
}

export default React.memo(React.forwardRef<HTMLInputElement, RangeSliderProps>(function RangeSlider({
  id = uuid(),
  className = "",
  type = "number",
  title = "",
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
  const [display, setDisplay] = useState(false)

    const refs = useRef({
      bar: React.createRef<HTMLDivElement>(),
    })

  const validateUserInput = useCallback(() => {
    let tmpType = "number"
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
    } else if (type === "number") {
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

  const data = useRef<RangeSliderParams>(validateUserInput())

  const calcBarLeft = useCallback(() => {
    return 0
  }, [])

  const calcBarWidth = useCallback(() => {
    return (data.current.value - data.current.start) / (data.current.end - data.current.start) * 100
  }, [])

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    data.current.value = Number(e.currentTarget.value)
    if (onChange) {
      if (data.current.type === "date") {
        const offset = +9 * 60 * 60 * 1000  /* only JST supported */
        const date = new Date()
        date.setTime(data.current.value * 86400000 + offset)
        onChange(data.current.type, date.toISOString().slice(5, 10).replace("-", "/"), data.current.value - data.current.start, title)
      } else {
        onChange(data.current.type, data.current.value, data.current.value - data.current.start, title)
      }
    }
    setDisplay(!display)
  }, [display, title, onChange])

  return (
    <div className={ cn(
      "relative mb-2",
      (size !== "auto") && "w-full",
      (size === "xs") && "max-w-xs mx-auto",
      (size === "sm") && "max-w-sm mx-auto",
      (size === "md") && "max-w-md mx-auto",
      (size === "lg") && "max-w-lg mx-auto",
      (size === "xl") && "max-w-xl mx-auto",
      className,
    ) }>
      <label
        htmlFor={ id }
        className={ cn(
          "block mb-4 text-sm font-medium text-gray-900",
          (disabled) && "text-gray-400",
        ) }
        suppressHydrationWarning
      >
        { replace(label, data.current.type, data.current.value) }
      </label>
      <div className="w-full h-2 mb-2 bg-gray-200 rounded-lg">
      </div>
      <div
        ref={ refs.current.bar }
        className="absolute top-9 h-2 z-10 bg-green-300 rounded-lg"
        style={ {
          left: calcBarLeft().toString() + "%",
          width: calcBarWidth().toString() + "%",
        } }
      >
      </div>
      <input
        ref={ ref }
        id={ id }
        type="range"
        className="absolute top-10 left-0 w-full h-0 z-20 accent-blue-600 pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:p-2.5"
        disabled={ disabled }
        min={ String(data.current.start) }
        max={ String(data.current.end) }
        step={ String(step) }
        defaultValue={ String(data.current.value) }
        onChange={ handleChange }
        suppressHydrationWarning
      />
      <div className="grid grid-cols-3">
        <span className="text-start text-sm text-gray-500">
          { data.current.startLabel }
        </span>
        <span className="text-center text-sm text-gray-500">
          { data.current.centerLabel }
        </span>
        <span className="text-end text-sm text-gray-500">
          { data.current.endLabel }
        </span>
      </div>
    </div>
  )
}))
