export type TableContent = {
  /* eslint-disable-next-line */
  [label: string]: any,
}

export type TableFormat = {
  title: string,
  labels: string[],
  contents: Array<TableContent>,
}
