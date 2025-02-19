"use client"
import React, { useCallback, useRef, useState } from "react"
import { v4 as uuid } from "uuid"
import { cn } from "@/app/libs/utils"


type DualRangeSliderParams = {
  type: string,
  lowValue: number,
  highValue: number,
  start: number,
  end: number,
  startLabel: string,
  centerLabel: string,
  endLabel: string,
}

type DualRangeSliderProps = {
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
  defaultLowValue?: number | string,
  defaultHighValue?: number | string,
  startLabel?: string,
  centerLabel?: string,
  endLabel?: string,
  replace?: (label: string, type: string, value: number) => number | string,
  onChange?: (type: string, lowValue: number | string, lowIndex: number, highValue: number | string, highIndex: number, title: string) => void,
}

export default React.memo<DualRangeSliderProps>(function DualRangeSlider({
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
  defaultLowValue = undefined,
  defaultHighValue = undefined,
  startLabel = undefined,
  centerLabel = undefined,
  endLabel = undefined,
  replace = (label: string | undefined, type: string, lowValue: number, highValue: number) => {
    if (label === undefined || label === "") {
      return ""
    }
    if (type === "date") {
      const offset = +9 * 60 * 60 * 1000  /* only JST supported */
      const lowDate = new Date()
      const hightDate = new Date()
      lowDate.setTime(lowValue * 86400000 + offset)
      hightDate.setTime(highValue * 86400000 + offset)
      return `${ label }, current: ${ lowDate.toISOString().slice(5, 10).replace("-", "/") } - ${ hightDate.toISOString().slice(5, 10).replace("-", "/") }`
    }
    return `${ label }, current: ${ lowValue } - ${ highValue }`
  },
  onChange = undefined,
}){
  const [display, setDisplay] = useState(false)

  const refs = useRef({
    bar: React.createRef<HTMLDivElement>(),
    low: React.createRef<HTMLInputElement>(),
    high: React.createRef<HTMLInputElement>(),
  })

  const validateUserInput = useCallback(() => {
    let tmpType = "number"
    let tmpStartNum = 0
    let tmpEndNum = 100
    let tmpLowValue = 33
    let tmpHighValue = 66

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

          if (typeof defaultLowValue === "string" && typeof defaultHighValue === "string") {
            const lowValueDate = new Date(defaultLowValue)
            const highValueDate = new Date(defaultHighValue)
            if (lowValueDate.toString() !== "Invalid Date" && highValueDate.toString() !== "Invalid Date") {
              if (lowValueDate <= highValueDate) {
                tmpLowValue = (lowValueDate.getTime() - baseDate.getTime()) / 86400000
                tmpHighValue = (highValueDate.getTime() - baseDate.getTime()) / 86400000
              } else {
                tmpLowValue = (highValueDate.getTime() - baseDate.getTime()) / 86400000
                tmpHighValue = (lowValueDate.getTime() - baseDate.getTime()) / 86400000
              }
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

        if (typeof defaultLowValue === "number" && typeof defaultHighValue === "number") {
          tmpLowValue = defaultLowValue
          tmpHighValue = defaultHighValue
        }
      }
    }

    return ({
      type: tmpType,
      lowValue: valueOnStep(valueInRange(tmpLowValue, tmpStartNum, tmpEndNum, true), tmpStartNum, step),
      highValue: valueOnStep(valueInRange(tmpHighValue, tmpStartNum, tmpEndNum, true), tmpStartNum, step),
      start: tmpStartNum,
      end: tmpEndNum,
      startLabel: setLabel(tmpType, tmpStartNum, startLabel),
      centerLabel: setLabel(tmpType, centerValue(tmpStartNum, tmpEndNum), centerLabel),
      endLabel: setLabel(tmpType, tmpEndNum, endLabel),
    })
  }, [type, start, end, step, defaultLowValue, defaultHighValue, startLabel, centerLabel, endLabel])

  const data = useRef<DualRangeSliderParams>(validateUserInput())

  const calcBarLeft = useCallback(() => {
    return (data.current.lowValue - data.current.start) / (data.current.end - data.current.start) * 100
  }, [])

  const calcBarWidth = useCallback(() => {
    return (data.current.highValue - data.current.lowValue) / (data.current.end - data.current.start) * 100
  }, [])

  const handleChangeLow = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.currentTarget.value)
    if (value <= data.current.highValue) {
      data.current.lowValue = value
      if (onChange) {
        if (data.current.type === "date") {
          const offset = +9 * 60 * 60 * 1000  /* only JST supported */
          const lowDate = new Date()
          const highDate = new Date()
          lowDate.setTime(data.current.lowValue * 86400000 + offset)
          highDate.setTime(data.current.highValue * 86400000 + offset)
          onChange(data.current.type, lowDate.toISOString().slice(5, 10).replace("-", "/"), data.current.lowValue - data.current.start, highDate.toISOString().slice(5, 10).replace("-", "/"), data.current.highValue - data.current.start, title)
        } else {
          onChange(data.current.type, data.current.lowValue, data.current.lowValue - data.current.start, data.current.highValue, data.current.highValue - data.current.start, title)
        }
      }
    } else {
      if (refs.current.low.current) {
        refs.current.low.current.value = String(data.current.highValue)
      }
    }
    if (refs.current.low.current && refs.current.high.current && refs.current.bar.current) {
      refs.current.low.current.style.zIndex = "30"
      refs.current.high.current.style.zIndex = "20"
      refs.current.bar.current.style.left = calcBarLeft().toString() + "%"
      refs.current.bar.current.style.width = calcBarWidth().toString() + "%"
    }
    setDisplay(!display)
  }, [display, title, onChange, calcBarLeft, calcBarWidth])

  const handleChangeHigh = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.currentTarget.value)
    if (value >= data.current.lowValue) {
      data.current.highValue = value
      if (onChange) {
        if (data.current.type === "date") {
          const offset = +9 * 60 * 60 * 1000  /* only JST supported */
          const lowDate = new Date()
          const highDate = new Date()
          lowDate.setTime(data.current.lowValue * 86400000 + offset)
          highDate.setTime(data.current.highValue * 86400000 + offset)
          onChange(data.current.type, lowDate.toISOString().slice(5, 10).replace("-", "/"), data.current.lowValue - data.current.start, highDate.toISOString().slice(5, 10).replace("-", "/"), data.current.highValue - data.current.start, title)
        } else {
          onChange(data.current.type, data.current.lowValue, data.current.lowValue - data.current.start, data.current.highValue, data.current.highValue - data.current.start, title)
        }
      }
    } else {
      if (refs.current.high.current) {
        refs.current.high.current.value = String(data.current.lowValue)
      }
    }
    if (refs.current.low.current && refs.current.high.current && refs.current.bar.current) {
      refs.current.low.current.style.zIndex = "20"
      refs.current.high.current.style.zIndex = "30"
      refs.current.bar.current.style.left = calcBarLeft().toString() + "%"
      refs.current.bar.current.style.width = calcBarWidth().toString() + "%"
    }
    setDisplay(!display)
  }, [display, title, onChange, calcBarLeft, calcBarWidth])

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
        htmlFor={ `${ id }-low` }
        className={ cn(
          "block mb-4 text-sm font-medium text-gray-900",
          (disabled) && "text-gray-400",
        ) }
        suppressHydrationWarning
      >
        { replace(label, data.current.type, data.current.lowValue, data.current.highValue) }
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
        ref={ refs.current.low }
        id={ `${ id }-low` }
        type="range"
        className="absolute top-10 left-0 w-full h-0 z-20 accent-blue-600 pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:p-2.5"
        disabled={ disabled }
        min={ String(data.current.start) }
        max={ String(data.current.end) }
        step={ String(step) }
        defaultValue={ String(data.current.lowValue) }
        onChange={ handleChangeLow }
        suppressHydrationWarning
      />
      <input
        ref={ refs.current.high }
        id={ `${ id }-high` }
        type="range"
        className="absolute top-10 left-0 w-full h-0 z-30 accent-purple-600 pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:p-2.5"
        disabled={ disabled }
        min={ String(data.current.start) }
        max={ String(data.current.end) }
        step={ String(step) }
        defaultValue={ String(data.current.highValue) }
        onChange={ handleChangeHigh }
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
})
