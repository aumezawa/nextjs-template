/* Bar Chart */
export type BarChartSeries = {
  name: string,
  data: number[],
}

export type BarChartFormat = {
  axis: {
    x: {
      title: string,
      labels: string[],
    },
    y: {
      title: string,
    },
  },
  series: Array<BarChartSeries>,
}

export const BarChartSampleData: BarChartFormat = {
  axis: {
    x: {
      title: "year",
      labels: ["2000", "2001", "2002", "2003", "2004"],
    },
    y: {
      title: "Revenue [$]",
    },
  },
  series: [
    { name: "test1", data: [150, 200, 350, 400, 550] },
    { name: "test2", data: [300, 150, 500, 650, 200] },
  ],
}


/* Pie Chart */
export type PieChartFormat = {
  label: string,
  unit: string,
  labels: string[],
  series: number[],
}

export const PieChartSampleData: PieChartFormat = {
  label: "Revenue",
  unit: "$",
  labels: ["Product A", "Product B", "Product C", "Product D"],
  series: [200, 500, 400, 100],
}
