"use client"
import React from "react"
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
  data?: BarChartFormat
}

export default React.memo<BarChartProps>(function BarChart({
  id = uuid(),
  className = "",
  title = "undefined",
  size = "md",
  data = BarChartSampleData,
}){
  const options: ApexOptions = {
    chart: {
      id: id,
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
      categories: data.axis.x.labels,
      title: {
        text: data.axis.x.title,
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
        text: data.axis.y.title,
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
        (size === "md") && "max-w-md",
        (size === "lg") && "max-w-lg",
        (size === "xl") && "max-w-xl",
        className,
      ) }
    >
      <ApexCharts
        type="bar"
        height={ (size === "md") ? 384 : (size === "lg") ? 448 : (size === "xl") ? 512 : "100%" }
        options={ options }
        series={ data.series }
        suppressHydrationWarning
      />
    </div>
  )
})
