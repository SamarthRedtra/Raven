import { getErrorMessage } from '@/components/layout/AlertBanner/ErrorBanner'
import { Member } from '@/hooks/fetchers/useFetchChannelMembers'
import { DropdownMenu, Flex } from '@radix-ui/themes'
import { useFrappeUpdateDoc } from 'frappe-react-sdk'
import { BiCheck, BiBell } from 'react-icons/bi'
import { type ReactNode } from 'react'
import { toast } from 'sonner'

type NotificationPreference = 'All Messages' | 'Mentions Only'

interface UpdateNotificationPreferenceMenuProps {
    member: Member
    onUpdate: () => void
}

export const UpdateNotificationPreferenceMenu = ({ member, onUpdate }: UpdateNotificationPreferenceMenuProps) => {
    const { updateDoc, loading } = useFrappeUpdateDoc()
    const preference = member.notification_preference ?? 'All Messages'

    const updatePreference = (notification_preference: NotificationPreference) => {
        if (!member.channel_member_name || notification_preference === preference) return

        updateDoc('Raven Channel Member', member.channel_member_name, { notification_preference })
            .then(() => {
                onUpdate()
                toast.success('Notification preference updated')
            })
            .catch((error) => {
                toast.error('Failed to update notification preference', {
                    description: getErrorMessage(error)
                })
            })
    }

    return (
        <DropdownMenu.Sub>
            <DropdownMenu.SubTrigger>
                <Flex gap='2' align='center'>
                    <BiBell />
                    Notification preference
                </Flex>
            </DropdownMenu.SubTrigger>
            <DropdownMenu.SubContent>
                <DropdownMenu.Item disabled={loading} onClick={() => updatePreference('All Messages')}>
                    <PreferenceItem active={preference === 'All Messages'}>All messages</PreferenceItem>
                </DropdownMenu.Item>
                <DropdownMenu.Item disabled={loading} onClick={() => updatePreference('Mentions Only')}>
                    <PreferenceItem active={preference === 'Mentions Only'}>Mentions only</PreferenceItem>
                </DropdownMenu.Item>
            </DropdownMenu.SubContent>
        </DropdownMenu.Sub>
    )
}

const PreferenceItem = ({ active, children }: { active: boolean, children: ReactNode }) => (
    <Flex justify='between' align='center' width='100%' gap='4'>
        {children}
        {active && <BiCheck />}
    </Flex>
)
