import { DateTimePicker } from '@/components/common/DateTimePicker'
import { getErrorMessage } from '@/components/layout/AlertBanner/ErrorBanner'
import { Button, ContextMenu, Flex, Separator, Text } from '@radix-ui/themes'
import { FrappeConfig, FrappeContext } from 'frappe-react-sdk'
import { useContext, useState } from 'react'
import { LuAlarmClock } from 'react-icons/lu'
import { toast } from 'sonner'

const stamp = (date: Date) => {
    const pad = (value: number) => String(value).padStart(2, '0')
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:00`
}

const defaultInOneHour = () => stamp(new Date(Date.now() + 60 * 60 * 1000))

const tomorrowMorning = () => {
    const date = new Date()
    date.setDate(date.getDate() + 1)
    date.setHours(9, 0, 0, 0)
    return stamp(date)
}

/** Keeps Radix context menu open while interacting with non-menu controls inside it. */
const stopMenuDismiss = (e: { preventDefault: () => void }) => {
    e.preventDefault()
}

const RemindMeSubmenu = ({ messageId }: { messageId: string }) => {
    const { call } = useContext(FrappeContext) as FrappeConfig
    const [remindAt, setRemindAt] = useState(defaultInOneHour)

    const remind = (when: string) => {
        if (!when) return
        call.post('raven.api.reminders.create_reminder', { message: messageId, remind_at: when })
            .then(() => toast.success('Reminder set'))
            .catch((error) => toast.error('Could not set the reminder', { description: getErrorMessage(error) }))
    }

    const confirmCustom = () => {
        if (!remindAt) return
        remind(remindAt)
    }

    return (
        <ContextMenu.Sub>
            <ContextMenu.SubTrigger>
                <Flex gap='2' width='100%' align='center'>
                    <LuAlarmClock size='18' />
                    Remind me
                </Flex>
            </ContextMenu.SubTrigger>
            <ContextMenu.SubContent
                className='raven-remind-submenu min-w-[18rem] max-w-[min(100vw-1.5rem,24rem)] overflow-visible'
                onCloseAutoFocus={(e) => e.preventDefault()}
            >
                <ContextMenu.Item onSelect={() => remind(defaultInOneHour())}>In 1 hour</ContextMenu.Item>
                <ContextMenu.Item onSelect={() => remind(tomorrowMorning())}>Tomorrow 9:00</ContextMenu.Item>
                <Separator my='2' size='4' />
                <Text as='div' size='1' weight='medium' color='gray' px='2' mb='1'>
                    Pick date and time
                </Text>
                <div
                    className='px-1'
                    onPointerDown={stopMenuDismiss}
                    onKeyDown={(e) => e.stopPropagation()}
                >
                    <DateTimePicker
                        value={remindAt}
                        onChange={setRemindAt}
                        minDate={new Date()}
                        required
                        display='inline'
                    />
                </div>
                <Flex justify='end' mt='2' px='2' pb='1'>
                    <Button size='2' onClick={confirmCustom} disabled={!remindAt}>
                        Set reminder
                    </Button>
                </Flex>
            </ContextMenu.SubContent>
        </ContextMenu.Sub>
    )
}

export default RemindMeSubmenu
