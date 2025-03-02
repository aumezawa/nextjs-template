export interface FormElement {
  clear: () => void,
  set: (value?: string, index?: number, subIndex?: number) => void,
  get: (index?: number, subIndex?: number) => string | undefined,
}