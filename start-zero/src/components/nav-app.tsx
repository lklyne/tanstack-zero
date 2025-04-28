import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { ChevronRight } from 'lucide-react'

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
			{breadcrumbs ? (
				<Breadcrumb>
					<BreadcrumbList>
						{breadcrumbs.items.map((item, i) => (
							<BreadcrumbItem key={`${item.label}-${item.href || 'current'}`}>
								{i === breadcrumbs.items.length - 1 ? (
									<BreadcrumbPage>{item.label}</BreadcrumbPage>
								) : (
									<BreadcrumbLink href={item.href}>{item.label}</BreadcrumbLink>
								)}
							</BreadcrumbItem>
						))}
					</BreadcrumbList>
				</Breadcrumb>
			) : (
				<h2 className='font-medium text-sm'>{title}</h2>
			)}
			{children || <div />}
		</div>
	)
}

export default NavApp
