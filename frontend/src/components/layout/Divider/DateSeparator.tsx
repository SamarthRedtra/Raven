import { Flex, Text } from '@radix-ui/themes'
import { FlexProps } from '@radix-ui/themes/dist/cjs/components/flex'
import clsx from 'clsx'

export const DateSeparator = (props: FlexProps) => {

    const { children, className, ...flexProps } = props

    return (
        <Flex align="center" gap="3" {...flexProps} className={clsx('w-full min-w-0', className)}>
            <div className="h-px min-w-0 flex-1 bg-gray-5 dark:bg-gray-7" />
            <Text
                as="span"
                size='1'
                className='shrink-0 text-center'
                color='gray'>
                {children}
            </Text>
            <div className="h-px min-w-0 flex-1 bg-gray-5 dark:bg-gray-7" />
        </Flex>
    )
}