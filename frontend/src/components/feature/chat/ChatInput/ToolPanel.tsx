import { FlexProps } from '@radix-ui/themes/dist/cjs/components/flex'
import { ReactNode } from 'react'
import clsx from 'clsx'

export const ICON_PROPS = {
    size: '18'
}

export const DEFAULT_BUTTON_STYLE = 'bg-transparent dark:text-gray-11 sm:dark:text-gray-10 text-gray-11 hover:bg-accent-a3 hover:text-accent-a11 dark:hover:text-accent-a11'

type ToolPanelProps = FlexProps & {
    formatting: ReactNode
    actions: ReactNode
}

export const ToolPanel = ({ formatting, actions, className, ...props }: ToolPanelProps) => {

    return (
        <div
            className={clsx(
                'border-t border-t-slate-5 bg-slate-2 rounded-b-radius4 grid w-full min-w-0 max-w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-2 p-1',
                className
            )}
            {...props}
        >
            <div className='min-w-0 overflow-x-auto overscroll-x-contain'>
                {formatting}
            </div>
            <div className='shrink-0 justify-self-end'>
                {actions}
            </div>
        </div>
    )
}
