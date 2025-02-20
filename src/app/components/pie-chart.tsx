"use client"
import React, { useRef } from "react"
import { v4 as uuid } from "uuid"
import { cn } from "@/app/libs/utils"

import type { ApexOptions } from "apexcharts"
import { PieChartFormat, PieChartSampleData } from "@/app/types/chart"

import dynamic from "next/dynamic"
const ApexCharts = dynamic(() => import("react-apexcharts"), { ssr: false })


type PieChartProps = {
  id?: string,
  className?: string,
  title?: string,
  size?: "md" | "lg" | "xl" | "full",
  content?: PieChartFormat
}

export default React.memo<PieChartProps>(function PieChart({
  id = "",
  className = "",
  title = "undefined",
  size = "md",
  content = PieChartSampleData,
}){
  const data = useRef({
    id: id || uuid(),
  })

  const options: ApexOptions = {
    chart: {
      id: data.current.id,
    },
    title: {
      text: title,
      align: "center",
      style: {
        fontSize: "16px",
        fontWeight: undefined,
        fontFamily: "Inter, sans-serif",
        color: "gray",
      },
    },
    dataLabels: {
      /* eslint-disable */
      formatter: (val: number, opts: any) => {
        return [`${ content.unit } ${ content.series[opts.seriesIndex].toLocaleString() }`, `${ Math.round(val * 10) / 10 } %`]
      },
      style: {
        fontSize: "12px",
        fontWeight: undefined,
        fontFamily: "Inter, sans-serif",
      },
    },
    labels: content.labels,
    legend: {
      position: "bottom",
      fontSize: "12px",
      fontWeight: undefined,
      fontFamily: "Inter, sans-serif",
    },
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: true,
            name: {
              show: true,
              fontFamily: "Inter, sans-serif",
            },
            total: {
              showAlways: true,
              show: true,
              label: content.label,
              fontFamily: "Inter, sans-serif",
              /* eslint-disable */
              formatter: (w: any) => {
                return content.unit + Number(w.globals.seriesTotals.reduce((a: number, b: number) => {
                  return a + b
                }, 0)).toLocaleString()
              },
            },
          },
        },
        expandOnClick: false,
      },
    },
    tooltip: {
      theme: "light",
      style: {
        fontSize: "12px",
        fontFamily: "Inter, sans-serif",
      },
    },
  }

  return (
    <div
      className={ cn(
        "flex flex-col w-full px-2 pt-4 bg-white rounded-lg border shadow-sm",
        (size === "md") && "max-w-md mx-auto",
        (size === "lg") && "max-w-lg mx-auto",
        (size === "xl") && "max-w-xl mx-auto",
        className,
      ) }
    >
      <ApexCharts
        type="donut"
        height={ (size === "md") ? 384 : (size === "lg") ? 448 : (size === "xl") ? 512 : "100%" }
        options={ options }
        series={ content.series }
      />
    </div>
  )
})
