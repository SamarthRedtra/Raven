import { Text } from '@radix-ui/themes'
import { TextProps } from '@radix-ui/themes/dist/cjs/components/text'
import clsx from 'clsx'

type SidebarScrollableLabelProps = TextProps & {
    title?: string
}

export const SidebarScrollableLabel = ({
    children,
    title,
    className,
    weight,
    size,
    ...textProps
}: SidebarScrollableLabelProps) => {
    const label = typeof children === 'string' ? children : undefined

    return (
        <div
            className={clsx(
                'sidebar-label-scroll min-w-0 flex-1 overflow-x-auto overflow-y-hidden',
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
        </div>
    )
}
