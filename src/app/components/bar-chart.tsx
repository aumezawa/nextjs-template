"use client"
import React, { useRef } from "react"
import { v4 as uuid } from "uuid"
import { cn } from "@/app/libs/utils"

import type { ApexOptions } from "apexcharts"
import { BarChartFormat, BarChartSampleData } from "@/app/types/chart"

import dynamic from "next/dynamic"
const ApexCharts = dynamic(() => import("react-apexcharts"), { ssr: false })


type BarChartProps = {
  id?: string,
  className?: string,
  title?: string,
  size?: "md" | "lg" | "xl" | "full",
  content?: BarChartFormat
}

export default React.memo<BarChartProps>(function BarChart({
  id = "",
  className = "",
  title = "undefined",
  size = "md",
  content = BarChartSampleData,
}){
  const data = useRef({
    id: id || uuid(),
  })

  const options: ApexOptions = {
    chart: {
      id: id || data.current.id,
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
    xaxis: {
      categories: content.axis.x.labels,
      title: {
        text: content.axis.x.title,
        style: {
          fontSize: "14px",
          fontWeight: undefined,
          fontFamily: "Inter, sans-serif",
          color: "gray",
        },
      },
    },
    yaxis: {
      title: {
        text: content.axis.y.title,
        style: {
          fontSize: "14px",
          fontWeight: undefined,
          fontFamily: "Inter, sans-serif",
          color: "gray",
        },
      },
    },
    legend: {
      fontSize: "12px",
      fontWeight: undefined,
      fontFamily: "Inter, sans-serif",
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
        type="bar"
        height={ (size === "md") ? 384 : (size === "lg") ? 448 : (size === "xl") ? 512 : "100%" }
        options={ options }
        series={ content.series }
        suppressHydrationWarning
      />
    </div>
  )
})
