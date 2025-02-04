export type TableContent = {
  [label: string]: string | number | boolean,
}

export type TableFormat = {
  title: string,
  labels: string[],
  contents: Array<TableContent>,
}
