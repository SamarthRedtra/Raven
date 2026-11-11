import { SidebarHeader } from "./SidebarHeader";
import { SidebarBody } from "./SidebarBody";
import { Box, Flex, Separator } from "@radix-ui/themes";
import WorkspacesSidebar from "./WorkspacesSidebar";

export const Sidebar = () => {
    return (
        <Flex
            direction="row"
            gap="0"
            className="h-screen w-full min-w-0 overflow-hidden bg-gray-2 dark:bg-gray-1"
        >
            <WorkspacesSidebar />
            <Flex direction='column' gap='2' className="min-w-0 flex-1 overflow-hidden">
                <SidebarHeader />
                <Box px='2'>
                    <Separator size='4' className={`bg-gray-4 dark:bg-gray-6`} />
                </Box>
                <SidebarBody />
            </Flex>
        </Flex>

    )
}
