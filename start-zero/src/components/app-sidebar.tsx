// import {
// 	IconCamera,
// 	IconChartBar,
// 	IconDashboard,
// 	IconDatabase,
// 	IconFileAi,
// 	IconFileDescription,
// 	IconFileWord,
// 	IconFolder,
// 	IconHelp,
// 	IconListDetails,
// 	IconReport,
// 	IconSearch,
// 	IconSettings,
// 	IconUsers,
// } from '@tabler/icons-react'

import Logo from '@/components/logo'

import { NavExamples } from '@/components/nav-examples'
import { NavOfflineBadge } from '@/components/nav-offline-badge'
// import { NavMain } from "@/components/nav-main"
// import { NavSecondary } from '@/components/nav-secondary'
// import { NavDocuments } from '@/components/nav-documents'
import { NavUser } from '@/components/nav-user'
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarRail,
} from '@/components/ui/sidebar'
import { Link } from '@tanstack/react-router'

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	return (
		<Sidebar collapsible='offcanvas' {...props}>
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton
							asChild
							className='data-[slot=sidebar-menu-button]:!p-1.5 mt-0.5'
						>
							<Link to='/' className='flex items-center justify-between w-full'>
								<div className='flex items-center gap-2'>
									<Logo />
									<span className='text-sm font-semibold'>Zero Start</span>
								</div>
								<NavOfflineBadge />
							</Link>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>
			<SidebarContent>
				<NavExamples />
				{/* <NavMain items={data.navMain} /> */}
				{/* <NavDocuments items={data.documents} /> */}
				{/* <NavSecondary items={data.navSecondary} className='mt-auto' /> */}
			</SidebarContent>
			<SidebarFooter>
				<NavUser />
			</SidebarFooter>
		</Sidebar>
	)
}
