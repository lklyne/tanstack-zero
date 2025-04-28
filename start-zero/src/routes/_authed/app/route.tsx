import { AppSidebar } from '@/components/app-sidebar'
import { SidebarProvider } from '@/components/ui/sidebar'
import type { ZeroSchema } from '@/db/schema.zero'
import { initZero } from '@/lib/zero'
import type { Zero } from '@rocicorp/zero'
import { ZeroProvider } from '@rocicorp/zero/react'
import {
	Outlet,
	createFileRoute,
	useRouteContext,
} from '@tanstack/react-router'

import { use } from 'react'

export const Route = createFileRoute('/_authed/app')({
	component: RouteComponent,
	context: () => ({
		// Initialize the zero instance, this won't serialize the zero instance (beforeLoad will)
		z: initZero(),
	}),
	loader: async ({ context }) => {
		// We are not returning the zero instance here, but using the loader to initialize it before the component mounts
		await context.z
	},
})

function RouteComponent() {
	const { z: zeroPromise } = useRouteContext({ from: '/_authed/app' })

	if (!zeroPromise) {
		// This should ideally not happen due to the loader awaiting z
		return <div>Loading Zero...</div>
	}

	const z = use(zeroPromise) as unknown as Zero<ZeroSchema>

	return (
		<ZeroProvider zero={z}>
			<SidebarProvider className='flex h-screen'>
				<AppSidebar variant='inset' />
				<div className='flex-1 p-2'>
					<main className='h-full border border-border bg-background rounded flex flex-col overflow-hidden'>
						<Outlet />
					</main>
				</div>
			</SidebarProvider>
		</ZeroProvider>
	)
}
