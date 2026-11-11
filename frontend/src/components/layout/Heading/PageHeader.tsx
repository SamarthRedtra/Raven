import { PropsWithChildren } from 'react'
import { Box, Flex } from '@radix-ui/themes'
import { useParams } from 'react-router-dom'
import clsx from 'clsx'

export const PageHeader = ({ children }: PropsWithChildren) => {

    const { threadID } = useParams()

    return (
        <header
            className={clsx(
                'dark:bg-gray-2 bg-white fixed top-0 z-[999]',
                'left-0 right-0 w-screen px-4',
                'sm:left-[var(--sidebar-width)] sm:right-0 sm:w-auto sm:px-0 sm:ml-4',
                threadID && 'sm:right-[calc(50%+var(--space-2))]'
            )}
        >
            <Box py='2' className='border-gray-4 sm:dark:border-gray-6 border-b'>
                <Flex justify='between'>
                    {children}
                </Flex>
            </Box>
        </header>
    )
}
