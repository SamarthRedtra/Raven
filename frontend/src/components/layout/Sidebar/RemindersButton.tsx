import { UserAvatar } from '@/components/common/UserAvatar'
import { useGetUser } from '@/hooks/useGetUser'
import { HStack } from '@/components/layout/Stack'
import { RavenChannel } from '@/types/RavenChannelManagement/RavenChannel'
import { ChannelIcon } from '@/utils/layout/channelIcon'
import { __ } from '@/utils/translations'
import { Box, Button, Flex, IconButton, Popover, Text } from '@radix-ui/themes'
import { FrappeConfig, FrappeContext, useFrappeEventListener, useFrappeGetCall } from 'frappe-react-sdk'
import parse from 'html-react-parser'
import { useContext, useMemo } from 'react'
import { BiMessageAltDetail } from 'react-icons/bi'
import { LuAlarmClock } from 'react-icons/lu'
import { Link, useParams } from 'react-router-dom'

type Reminder = {
    name: string
    message: string
    channel_id: string
    remind_at: string
    text?: string
    message_type?: string
    owner?: string
    file?: string
    channel_name?: string
    channel_type?: RavenChannel['type']
    workspace?: string
    is_thread?: 0 | 1
    is_direct_message?: 0 | 1
}

const RemindersButton = () => {
    const { data: dueCount, mutate: mutateCount } = useFrappeGetCall<{ message: number }>(
        'raven.api.reminders.get_due_reminder_count',
        undefined,
        'raven-due-reminders',
        { revalidateOnFocus: true },
    )
    const { data: reminders, mutate } = useFrappeGetCall<{ message: Reminder[] }>(
        'raven.api.reminders.get_my_reminders',
        undefined,
        'raven-my-reminders',
        { revalidateOnFocus: false },
    )

    useFrappeEventListener('raven_reminder', () => {
        mutateCount()
        mutate()
    })

    return (
        <Popover.Root onOpenChange={(open) => { if (open) mutate() }}>
            <Popover.Trigger>
                <IconButton
                    size={{ initial: '2', md: '2' }}
                    aria-label={__('View reminders')}
                    title={__('View reminders')}
                    color='gray'
                    variant='ghost'
                    className='relative text-gray-11 sm:hover:text-gray-12 sm:hover:bg-transparent p-2 data-[state=open]:bg-transparent data-[state=open]:text-gray-12'
                >
                    <LuAlarmClock className='text-lg sm:text-xl' />
                    {dueCount && dueCount.message > 0 && (
                        <Box className='rounded-full absolute -right-0.5 -bottom-0.5 sm:right-1.5 sm:bottom-0 bg-red-11 dark:bg-red-9 text-white w-4 h-4 flex items-center justify-center'>
                            <Text as='span' size='1'>{dueCount.message}</Text>
                        </Box>
                    )}
                </IconButton>
            </Popover.Trigger>
            <Popover.Content width={{ initial: '360px', md: '480px' }} className='p-0'>
                <Flex direction='column' className='border-b border-gray-4 px-4 py-3'>
                    <Text size='3' weight='bold'>{__('Reminders')}</Text>
                </Flex>
                <ReminderList reminders={reminders?.message || []} onChange={() => { mutate(); mutateCount() }} />
            </Popover.Content>
        </Popover.Root>
    )
}

const ReminderList = ({ reminders, onChange }: { reminders: Reminder[], onChange: () => void }) => {
    if (!reminders.length) {
        return (
            <Flex direction='column' align='center' justify='center' className='h-[240px] px-6 text-center'>
                <div className='text-gray-8 mb-3'>
                    <LuAlarmClock size={40} />
                </div>
                <Text size='3' weight='medium' className='mb-1'>{__('No reminders yet')}</Text>
                <Text as='p' size='2' color='gray'>{__('Right-click a message and choose Remind me.')}</Text>
            </Flex>
        )
    }
    return (
        <ul role='list' className='list-none max-h-[420px] overflow-y-auto'>
            {reminders.map((reminder) => (
                <li key={reminder.name} className='border-b border-gray-4 last:border-0'>
                    <ReminderItem reminder={reminder} onChange={onChange} />
                </li>
            ))}
        </ul>
    )
}

const reminderDestination = (reminder: Reminder, workspaceID?: string) => {
    const workspace = reminder.workspace || workspaceID
    if (reminder.is_thread) {
        return { pathname: `/${workspace}/threads/${reminder.channel_id}`, search: '' }
    }
    return { pathname: `/${workspace}/${reminder.channel_id}`, search: `message_id=${reminder.message}` }
}

const ReminderItem = ({ reminder, onChange }: { reminder: Reminder, onChange: () => void }) => {
    const { workspaceID } = useParams()
    const { call } = useContext(FrappeContext) as FrappeConfig
    const user = useGetUser(reminder.owner || '')
    const senderName = user?.full_name ?? reminder.owner
    const to = useMemo(() => reminderDestination(reminder, workspaceID), [reminder, workspaceID])

    const dismiss = () => {
        call.post('raven.api.reminders.cancel_reminder', { name: reminder.name }).then(onChange)
    }

    return (
        <Box className='px-4 py-3'>
            <HStack gap='2' align='start' className='w-full'>
                <UserAvatar src={user?.user_image} alt={senderName || ''} size='2' className='mt-0.5' />
                <Box className='min-w-0 w-full'>
                    <HStack className='w-full justify-between' align='center' gap='2'>
                        <HStack gap='1' align='center' className='min-w-0'>
                            <Text size='2' weight='medium' className='truncate'>{senderName || __('Message')}</Text>
                            <ChannelLabel reminder={reminder} />
                        </HStack>
                        <Text as='span' size='1' color='gray' className='shrink-0'>{formatRemindAt(reminder.remind_at)}</Text>
                    </HStack>
                    <Box className='mt-1'>
                        <Text as='p' size='2' className='line-clamp-2 [&_.mention]:text-accent-11 [&_p]:my-0'>
                            {reminder.text ? parse(reminder.text) : (reminder.message_type || __('Message'))}
                        </Text>
                    </Box>
                    <HStack gap='2' className='mt-2'>
                        <Popover.Close>
                            <Button size='1' variant='soft' asChild>
                                <Link to={{ pathname: to.pathname, search: to.search }}>
                                    {reminder.is_thread ? __('Open thread') : __('Open chat')}
                                </Link>
                            </Button>
                        </Popover.Close>
                        <Button size='1' variant='ghost' color='gray' onClick={dismiss}>
                            {__('Dismiss')}
                        </Button>
                    </HStack>
                </Box>
            </HStack>
        </Box>
    )
}

const ChannelLabel = ({ reminder }: { reminder: Reminder }) => {
    if (reminder.is_direct_message) return null
    if (reminder.is_thread) {
        return (
            <Text size='1' color='gray' className='inline-flex items-center gap-1 truncate'>
                {__('in')} <BiMessageAltDetail size='14' /> {__('thread')}
            </Text>
        )
    }
    return (
        <Text size='1' color='gray' className='inline-flex items-center gap-1 truncate'>
            {__('in')} {reminder.channel_type ? <ChannelIcon type={reminder.channel_type} size='14' /> : null}
            <span className='truncate'>{reminder.channel_name}</span>
        </Text>
    )
}

const formatRemindAt = (value: string) => {
    const date = new Date(value.replace(' ', 'T'))
    if (Number.isNaN(date.getTime())) return value
    return date.toLocaleString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })
}

export default RemindersButton
