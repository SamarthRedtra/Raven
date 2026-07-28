import { Controller, FormProvider, useForm } from 'react-hook-form'
import { useFrappePostCall, useSWRConfig } from 'frappe-react-sdk'
import { ErrorBanner } from '@/components/layout/AlertBanner/ErrorBanner'
import { Loader } from '@/components/common/Loader'
import { Box, Button, Dialog, Flex, Select, Text } from '@radix-ui/themes'
import { ChannelIcon } from '@/utils/layout/channelIcon'
import { Suspense, lazy } from 'react'
import { UserFields } from '@/utils/users/UserListProvider'
import { ErrorText } from '@/components/common/Form'
import { toast } from 'sonner'
import { useParams } from 'react-router-dom'
import { useCurrentChannelData } from '@/hooks/useCurrentChannelData'
const AddMembersDropdown = lazy(() => import('../../selectDropdowns/AddMembersDropdown'))

interface AddChannelMemberForm {
  add_members: UserFields[] | null
  notification_preference: 'All Messages' | 'Mentions Only'
}

interface AddChannelMemberModalContentProps {
  // channelID: string,
  // channel_name: string,
  // type: RavenChannel['type'],
  onClose: () => void,
  // updateMembers: () => void,
  // channelMembers?: ChannelMembers
}

export const AddChannelMembersModalContent = ({ onClose }: AddChannelMemberModalContentProps) => {

  const { channelID } = useParams<{ channelID: string }>()

  const { channel } = useCurrentChannelData(channelID ?? '')

  const { mutate } = useSWRConfig()

  const { call, error, loading } = useFrappePostCall('raven.api.raven_channel_member.add_channel_members')

  const methods = useForm<AddChannelMemberForm>({
    defaultValues: {
      add_members: null,
      notification_preference: 'Mentions Only'
    }
  })

  const { handleSubmit, control } = methods

  const onSubmit = (data: AddChannelMemberForm) => {
    if (data.add_members && data.add_members.length > 0) {
      call({
        channel_id: channelID,
        members: data.add_members.map((member) => member.name),
        notification_preference: data.notification_preference
      })
        .then(() => {
          toast.success("Members added")
          mutate(["channel_members", channelID])
          onClose()
        })
    }
  }

  return (
    <>
      {channelID && channel &&
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Dialog.Title>
              <Text as='span'>Add members to <ChannelIcon type={channel?.channelData.type} size='18' className='inline-block -mb-0.5' />{channel?.channelData.channel_name}</Text>
            </Dialog.Title>
            <Dialog.Description size='2'>
              New members will be able to see all of <strong>{channel?.channelData.channel_name}</strong>'s history, including any files that have been shared in the channel.
            </Dialog.Description>

            <Flex gap='2' pt='2' direction='column' width='100%'>
              <ErrorBanner error={error} />
              <Text size='2'>
                You can only add members from your workspace to this channel.
              </Text>
              <Box width='100%'>
                <Flex direction='column' gap='2'>
                  <Flex direction='column' gap='2'>
                    <Suspense fallback={<Loader />}>
                      <Controller
                        control={control}
                        name='add_members'
                        rules={{
                          validate: (value) => {
                            if (value && value.length > 0) {
                              return true
                            }
                            return 'Please select at least one member'
                          }
                        }}
                        render={({ field: { onChange, value } }) => (
                          <AddMembersDropdown
                            setSelectedUsers={onChange}
                            workspaceID={channel?.channelData.workspace ?? ''}
                            selectedUsers={value ?? []}
                            channelID={channelID}
                            label='' />
                        )}
                      />
                    </Suspense>
                    <ErrorText>{methods.formState.errors.add_members?.message}</ErrorText>
                  </Flex>
                  <Controller
                    control={control}
                    name='notification_preference'
                    render={({ field }) => (
                      <Flex direction='column' gap='1'>
                        <Text size='2' weight='medium'>Notification preference</Text>
                        <Select.Root value={field.value} onValueChange={field.onChange}>
                          <Select.Trigger aria-label='Notification preference' />
                          <Select.Content>
                            <Select.Item value='All Messages'>All messages</Select.Item>
                            <Select.Item value='Mentions Only'>Mentions only</Select.Item>
                          </Select.Content>
                        </Select.Root>
                        <Text size='1' color='gray'>Applies to every member selected above.</Text>
                      </Flex>
                    )}
                  />
                </Flex>
              </Box>
            </Flex>

            <Flex gap="3" mt="6" justify="end" align='center'>
              <Dialog.Close disabled={loading}>
                <Button variant="soft" color="gray">Cancel</Button>
              </Dialog.Close>
              <Button type='submit' disabled={loading}>
                {loading && <Loader className="text-white" />}
                {loading ? "Saving" : "Save"}
              </Button>
            </Flex>

          </form>
        </FormProvider>
      }
    </>
  )

}
