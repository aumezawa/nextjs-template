import React from "react"
import { cn } from "@/app/libs/utils"


type TabFrameProps = {
  id: string,
  className?: string,
  labels?: string[],
  contents?: Array<React.JSX.Element>,
}

export default React.memo<TabFrameProps>(function TabFrame({
  id,
  className = "",
  labels = [],
  contents = [],
}){
  return (
    <>
      {
        (labels.length > 0) &&
        <div className={ cn(
          "w-full mb-4 border-b border-gray-200",
          className,
        ) } >
          <ul
            id={ id }
            data-tabs-toggle={ `#${ id }-contents` }
            className="flex flex-wrap -mb-px"
            role="tablist"
            suppressHydrationWarning
          >
            {
              labels.map((label: string, index: number) => (
                <li
                  key={ index }
                  className="me-2"
                  role="presentation"
                >
                  <button
                    id={ `${ id }-tab-${ index }` }
                    type="button"
                    role="tab"
                    className="inline-block px-4 py-2 text-sm font-medium text-center border-b-2 rounded-t-lg cursor-pointer hover:text-gray-600 hover:border-gray-300 aria-selected:text-blue-600 aria-selected:border-blue-600"
                    data-tabs-target={ `#${ id }-content-${ index }` }
                    aria-controls={ `${ id }-content-${ index }` }
                    aria-selected="false"
                    suppressHydrationWarning
                  >
                    { label }
                  </button>
                </li>
              ))
            }
          </ul>
        </div>
      }
      {
        (contents.length > 0) &&
        <div
          id={ `${ id }-contents` }
          className="block w-full"
          suppressHydrationWarning
        >
          {
            contents.map((content: React.JSX.Element, index: number) => (
              <div
                key={ index }
                id={ `${ id }-content-${ index }` }
                role="tabpanel"
                className="hidden"
                aria-labelledby={ `${ id }-tab-${ index }` }
                suppressHydrationWarning
              >
                { content }
              </div>
            ))
          }
        </div>
      }
    </>
  )
})
