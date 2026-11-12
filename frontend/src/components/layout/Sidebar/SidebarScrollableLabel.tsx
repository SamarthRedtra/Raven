import { ReactNode } from 'react'
import { Text } from '@radix-ui/themes'
import { TextProps } from '@radix-ui/themes/dist/cjs/components/text'
import clsx from 'clsx'

type SidebarScrollableLabelProps = TextProps & {
    title?: string
    /** Renders beside the label (e.g. unread count), not at the row edge */
    adjacent?: ReactNode
}

export const SidebarScrollableLabel = ({
    children,
    title,
    className,
    weight,
    size,
    adjacent,
    ...textProps
}: SidebarScrollableLabelProps) => {
    const label = typeof children === 'string' ? children : undefined

    return (
        <div
            className={clsx(
                'sidebar-label-scroll flex min-w-0 flex-1 items-center gap-1 overflow-x-auto overflow-y-hidden',
                className
            )}
            title={title ?? label}
        >
            <Text
                size={size ?? { initial: '3', md: '2' }}
                weight={weight}
                className="whitespace-nowrap"
                as="span"
                {...textProps}
            >
                {children}
            </Text>
            {adjacent ? <span className="inline-flex shrink-0 items-center">{adjacent}</span> : null}
        </div>
    )
}
