import { Box } from '@radix-ui/themes'
import { ChannelListItem } from '@/utils/channel/ChannelListProvider'
import { ChatBoxBody } from '../ChatStream/ChatBoxBody'
import { ChannelHeader } from '../../chat-header/ChannelHeader'
import { useParams } from 'react-router-dom'

interface ChannelSpaceProps {
    channelData: ChannelListItem
}

export const ChannelSpace = ({ channelData }: ChannelSpaceProps) => {

    // const { threadID } = useParams()

    return (
        <Box className="h-full min-h-0 flex flex-col overflow-hidden">
            <ChannelHeader channelData={channelData} />
            <Box className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
                <ChatBoxBody channelData={channelData} />
            </Box>
        </Box>
    )
}