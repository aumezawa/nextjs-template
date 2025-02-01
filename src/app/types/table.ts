export type TableContent = {
  [label: string]: string,
}

export type TableFormat = {
  title: string,
  labels: string[],
  contents: Array<TableContent>,
}
