import { DMChannelListItem } from "@/utils/channel/ChannelListProvider"
import { Box } from "@radix-ui/themes"
import { DMChannelHeader } from "../../chat-header/DMChannelHeader"
import { ChatBoxBody } from "../ChatStream/ChatBoxBody"

interface DirectMessageSpaceProps {
    channelData: DMChannelListItem
}

export const DirectMessageSpace = ({ channelData }: DirectMessageSpaceProps) => {

    return (
        <Box className="h-full min-h-0 flex flex-col overflow-hidden">
            <DMChannelHeader
                channelData={channelData}
            />
            <Box className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
                <ChatBoxBody channelData={channelData} />
            </Box>
        </Box>
    )
}