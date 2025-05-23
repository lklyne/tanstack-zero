import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Link } from '@tanstack/react-router'
import { ChevronRight } from 'lucide-react'
import React from 'react'
import { SidebarRail, SidebarTrigger } from './ui/sidebar'
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip'

interface NavAppProps {
	title?: string
	breadcrumbs?: {
		items: Array<{
			label: string
			href?: string
		}>
	}
	children?: React.ReactNode
}

const NavApp = ({ title, breadcrumbs, children }: NavAppProps) => {
	return (
		<div className='flex justify-between items-center border-b border-gray-200 h-12 px-4 sticky top-0 bg-background z-10 shrink-0'>
			<div className='flex items-center gap-3'>
				<Tooltip delayDuration={500}>
					<TooltipTrigger asChild>
						<SidebarTrigger />
					</TooltipTrigger>
					<TooltipContent>
						<span className='flex items-center gap-0.5'>
							<p className='mr-2'>Toggle Sidebar</p>
							<kbd className='font-mono text-xs px-1 rounded bg-muted-foreground/60 border border-muted-foreground'>
								⌘
							</kbd>
							<kbd className='font-mono text-xs px-1 rounded bg-muted-foreground/60 border border-muted-foreground'>
								B
							</kbd>
						</span>
					</TooltipContent>
				</Tooltip>
				{breadcrumbs ? (
					<Breadcrumb>
						<BreadcrumbList>
							{breadcrumbs.items.map((item, i) => (
								<React.Fragment key={`${item.label}-${item.href || 'current'}`}>
									<BreadcrumbItem>
										{i === breadcrumbs.items.length - 1 ? (
											<BreadcrumbPage>{item.label}</BreadcrumbPage>
										) : (
											<BreadcrumbLink asChild>
												<Link to={item.href}>{item.label}</Link>
											</BreadcrumbLink>
										)}
									</BreadcrumbItem>
									{i < breadcrumbs.items.length - 1 && (
										<BreadcrumbSeparator>
											<ChevronRight className='h-4 w-4' />
										</BreadcrumbSeparator>
									)}
								</React.Fragment>
							))}
						</BreadcrumbList>
					</Breadcrumb>
				) : (
					<div className='flex items-center gap-2'>
						<h2 className='font-medium text-sm'>{title}</h2>
					</div>
				)}
			</div>

			{children || <div />}
		</div>
	)
}

export default NavApp
