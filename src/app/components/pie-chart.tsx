"use client"
import React from "react"
import { v4 as uuid } from "uuid"
import { cn } from "@/app/libs/utils"

import type { ApexOptions } from "apexcharts"
import { PieChartFormat, PieChartSampleData } from "@/app/types/chart"

import dynamic from "next/dynamic"
const ApexCharts = dynamic(() => import("react-apexcharts"), { ssr: false })


type BarChartProps = {
  id?: string,
  className?: string,
  title?: string,
  size?: "md" | "lg" | "xl" | "full",
  data?: PieChartFormat
}

export default React.memo<BarChartProps>(function BarChart({
  id = uuid(),
  className = "",
  title = "undefined",
  size = "md",
  data = PieChartSampleData,
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
    labels: data.labels,
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
              label: data.label,
              fontFamily: "Inter, sans-serif",
            },
          },
        },
      },
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
        type="donut"
        height={ (size === "md") ? 384 : (size === "lg") ? 448 : (size === "xl") ? 512 : "100%" }
        options={ options }
        series={ data.series }
        suppressHydrationWarning
      />
    </div>
  )
})
