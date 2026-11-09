import { ChannelSpace } from "@/components/feature/chat/chat-space/ChannelSpace"
import { DirectMessageSpace } from "@/components/feature/chat/chat-space/DirectMessageSpace"
import { ErrorBanner } from "@/components/layout/AlertBanner/ErrorBanner"
import { FullPageLoader } from "@/components/layout/Loaders/FullPageLoader"
import { useCurrentChannelData } from "@/hooks/useCurrentChannelData"
import { useEffect } from "react"
import { Box, Flex, Grid, Text } from '@radix-ui/themes'
import { Outlet, useParams, useSearchParams } from "react-router-dom"
import { useSWRConfig } from "frappe-react-sdk"
import { UnreadChannelCountItem, UnreadCountData } from "@/utils/channel/ChannelListProvider"
import { useIsMobile } from "@/hooks/useMediaQuery"
import { useSetAtom } from "jotai"
import { lastChannelAtom } from "@/utils/lastVisitedAtoms"

const ChatSpace = () => {

    // only if channelID is present render ChatSpaceArea component'
    const { channelID } = useParams<{ channelID: string }>()
    // const className = 'bg-white dark:from-accent-1 dark:to-95% dark:to-accent-2 dark:bg-gradient-to-b'
    return <div className="h-full min-h-0 flex flex-1 flex-col overflow-hidden">
        {channelID && <ChatSpaceArea channelID={channelID} />}
    </div>

}

const MissingChannel = () => {
    return <Flex align="center" justify="center" className="h-full px-6">
        <Text size="2" color="gray" align="center">This channel is not available. Pick another channel from the sidebar.</Text>
    </Flex>
}

export const Component = ChatSpace

const ChatSpaceArea = ({ channelID }: { channelID: string }) => {

    const { threadID } = useParams()

    const isMobile = useIsMobile()

    const { channel, error, isLoading } = useCurrentChannelData(channelID)
    const { mutate, cache } = useSWRConfig()

    const [searchParams] = useSearchParams()

    const baseMessage = searchParams.get('message_id')

    const setLastChannel = useSetAtom(lastChannelAtom)

    useEffect(() => {

        const unread_count = cache.get('unread_channel_count')

        // If unread count is present
        if (unread_count?.data) {
            // If the user entered the channel without a base message
            if (!baseMessage) {
                // Mutate the unread channel count to set the unread count of the current channel to 0
                //@ts-ignore
                mutate('unread_channel_count', (d: { message: UnreadCountData } | undefined) => {
                    if (d) {
                        const newChannels: UnreadChannelCountItem[] = d.message.map(c => {
                            if (c.name === channelID)
                                return {
                                    ...c,
                                    unread_count: 0
                                }
                            return c
                        })


                        return {
                            message: newChannels,
                        }
                    }
                    else {
                        return d
                    }


                }, {
                    revalidate: false
                })
            }
        }

    }, [channelID, baseMessage])

    useEffect(() => {
        if (channel) setLastChannel(channelID)
    }, [channel, channelID, setLastChannel])

    return <Grid columns={threadID && !isMobile ? "2" : "1"} gap="2" rows="1" width="auto" className="dark:bg-gray-2 bg-white h-full min-h-0 max-h-full w-full overflow-hidden">
        {threadID && isMobile ? null : <Box className="flex h-full min-h-0 max-h-full min-w-0 w-full flex-col overflow-hidden">
            {isLoading && <FullPageLoader />}
            <ErrorBanner error={error} />
            {channel ?
                channel.type === "dm" ?
                    <DirectMessageSpace channelData={channel.channelData} />
                    : <ChannelSpace channelData={channel.channelData} />
                : !isLoading && !error ? <MissingChannel /> : null}
        </Box>}
        <Outlet />
    </Grid>
}