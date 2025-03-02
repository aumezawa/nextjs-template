"use client"
import React, { useCallback, useImperativeHandle, useRef, useState } from "react"
import { v4 as uuid } from "uuid"
import { cn } from "@/app/libs/utils"
import type { FormElement } from "@/app/types/form"


type DualRangeSliderParams = {
  type: "dec" | "date",
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
  type?: "dec" | "date",
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
  onChange?: (type: string, value: number | string, index: number, title: string, subtitle: string) => void,
}

export default React.memo(React.forwardRef<FormElement, DualRangeSliderProps>(function DualRangeSlider({
  id = undefined,
  className = "",
  type = "dec",
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
}, ref){
  const [reload, setReload] = useState(false)

  const refs = useRef({
    inputs: [
      React.createRef<HTMLInputElement>(),
      React.createRef<HTMLInputElement>(),
    ],
    bar: React.createRef<HTMLDivElement>(),
  })

  const data = useRef({
    id: id || uuid(),
  })

  useImperativeHandle(ref, () => ({
    clear: () => {},
    set: (value?: string, index?: number) => {
      if (value && index !== undefined) {
        if (param.current.type === "dec") {
          if (index === 0) {
            if (Number(value) >= param.current.start && Number(value) <= param.current.highValue) {
              param.current.lowValue = Number(value)
              if (refs.current.inputs[0].current) {
                refs.current.inputs[0].current.value = String(param.current.lowValue)
                refs.current.inputs[0].current.style.zIndex = "7"
              }
              if (refs.current.inputs[1].current) {
                refs.current.inputs[1].current.style.zIndex = "6"
              }
            }
          } else if (index === 1) {
            if (Number(value) >= param.current.lowValue && Number(value) <= param.current.end) {
              param.current.highValue = Number(value)
              if (refs.current.inputs[0].current) {
                refs.current.inputs[0].current.style.zIndex = "6"
              }
              if (refs.current.inputs[1].current) {
                refs.current.inputs[1].current.value = String(param.current.highValue)
                refs.current.inputs[1].current.style.zIndex = "7"
              }
            }
          }
        } else if (param.current.type === "date") {
          const baseDate = new Date("2001-01-01")
          const valueDate = new Date(value)
          if (valueDate.toString() !== "Invalid Date") {
            const tmpValue = (valueDate.getTime() - baseDate.getTime()) / 86400000
            if (index === 0) {
              if (tmpValue >= param.current.start && tmpValue <= param.current.highValue) {
                param.current.lowValue = tmpValue
                if (refs.current.inputs[0].current) {
                  refs.current.inputs[0].current.value = String(param.current.lowValue)
                  refs.current.inputs[0].current.style.zIndex = "7"
                }
                if (refs.current.inputs[1].current) {
                  refs.current.inputs[1].current.style.zIndex = "6"
                }
              }
            } else if (index === 1) {
              if (tmpValue >= param.current.lowValue && tmpValue <= param.current.end) {
                param.current.highValue = tmpValue
                if (refs.current.inputs[0].current) {
                  refs.current.inputs[0].current.style.zIndex = "6"
                }
                if (refs.current.inputs[1].current) {
                  refs.current.inputs[1].current.value = String(param.current.highValue)
                  refs.current.inputs[1].current.style.zIndex = "7"
                }
              }
            }
          }
        }
        setReload(!reload)
      }
    },
    get: (index?: number) => {
      if (index !== undefined && index >= 0 && index <= 1) {
        return refs.current.inputs[index].current?.value
      }
      return undefined
    },
  }))

  const validateUserInput = useCallback(() => {
    let tmpType: "dec" | "date" = "dec"
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
    } else if (type === "dec") {
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

  const param = useRef<DualRangeSliderParams>(validateUserInput())

  const calcBarLeft = useCallback(() => {
    return (param.current.lowValue - param.current.start) / (param.current.end - param.current.start) * 100
  }, [])

  const calcBarWidth = useCallback(() => {
    return (param.current.highValue - param.current.lowValue) / (param.current.end - param.current.start) * 100
  }, [])

  const handleChangeLow = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.currentTarget.value)
    if (value <= param.current.highValue) {
      param.current.lowValue = value
      if (onChange) {
        if (param.current.type === "date") {
          const offset = +9 * 60 * 60 * 1000  /* only JST supported */
          const lowDate = new Date()
          const highDate = new Date()
          lowDate.setTime(param.current.lowValue * 86400000 + offset)
          highDate.setTime(param.current.highValue * 86400000 + offset)
          onChange(param.current.type, lowDate.toISOString().slice(5, 10).replace("-", "/"), param.current.lowValue - param.current.start, title, "0")
        } else {
          onChange(param.current.type, param.current.lowValue, param.current.lowValue - param.current.start, title, "0")
        }
      }
    } else {
      if (refs.current.inputs[0].current) {
        refs.current.inputs[0].current.value = String(param.current.highValue)
      }
    }
    if (refs.current.inputs[0].current && refs.current.inputs[1].current && refs.current.bar.current) {
      refs.current.inputs[0].current.style.zIndex = "7"
      refs.current.inputs[1].current.style.zIndex = "6"
      refs.current.bar.current.style.left = calcBarLeft().toString() + "%"
      refs.current.bar.current.style.width = calcBarWidth().toString() + "%"
    }
    setReload(!reload)
  }, [reload, title, onChange, calcBarLeft, calcBarWidth])

  const handleChangeHigh = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.currentTarget.value)
    if (value >= param.current.lowValue) {
      param.current.highValue = value
      if (onChange) {
        if (param.current.type === "date") {
          const offset = +9 * 60 * 60 * 1000  /* only JST supported */
          const lowDate = new Date()
          const highDate = new Date()
          lowDate.setTime(param.current.lowValue * 86400000 + offset)
          highDate.setTime(param.current.highValue * 86400000 + offset)
          onChange(param.current.type, highDate.toISOString().slice(5, 10).replace("-", "/"), param.current.highValue - param.current.start, title, "1")
        } else {
          onChange(param.current.type, param.current.highValue, param.current.highValue - param.current.start, title, "1")
        }
      }
    } else {
      if (refs.current.inputs[1].current) {
        refs.current.inputs[1].current.value = String(param.current.lowValue)
      }
    }
    if (refs.current.inputs[0].current && refs.current.inputs[1].current && refs.current.bar.current) {
      refs.current.inputs[0].current.style.zIndex = "6"
      refs.current.inputs[1].current.style.zIndex = "7"
      refs.current.bar.current.style.left = calcBarLeft().toString() + "%"
      refs.current.bar.current.style.width = calcBarWidth().toString() + "%"
    }
    setReload(!reload)
  }, [reload, title, onChange, calcBarLeft, calcBarWidth])

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
        htmlFor={ `${ data.current.id }-low` }
        className={ cn(
          "block mb-4 text-sm font-medium text-gray-900",
          (disabled) && "text-gray-400",
        ) }
        suppressHydrationWarning
      >
        { replace(label, param.current.type, param.current.lowValue, param.current.highValue) }
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
        ref={ refs.current.inputs[0] }
        id={ `${ data.current.id }-low` }
        type="range"
        className="absolute top-10 left-0 w-full h-0 z-6 accent-blue-600 pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:p-2.5"
        disabled={ disabled }
        min={ String(param.current.start) }
        max={ String(param.current.end) }
        step={ String(step) }
        defaultValue={ String(param.current.lowValue) }
        onChange={ handleChangeLow }
        suppressHydrationWarning
      />
      <input
        ref={ refs.current.inputs[1] }
        id={ `${ data.current.id }-high` }
        type="range"
        className="absolute top-10 left-0 w-full h-0 z-7 accent-purple-600 pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:p-2.5"
        disabled={ disabled }
        min={ String(param.current.start) }
        max={ String(param.current.end) }
        step={ String(step) }
        defaultValue={ String(param.current.highValue) }
        onChange={ handleChangeHigh }
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
