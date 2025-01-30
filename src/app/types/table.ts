export type TableContent = {
  [label: string]: string,
}

export type Table = {
  title: string,
  labels: string[],
  contents: Array<TableContent>,
}